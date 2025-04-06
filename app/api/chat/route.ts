//app/api/chat/route.ts
import OpenAI from "openai";
import { DataAPIClient } from "@datastax/astra-db-ts";
import "dotenv/config";

// Load environment variables
const {
    ASTRA_DB_NAMESPACE,
    ASTRA_DB_COLLECTION,
    ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_APPLICATION_TOKEN,
    OPENAI_API_KEY,
    OPENAI_BASE_URL
} = process.env;

if (!ASTRA_DB_API_ENDPOINT || !ASTRA_DB_COLLECTION) {
    throw new Error("Required environment variables are missing.");
}

const collectionName = ASTRA_DB_COLLECTION as string;
const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    baseURL: OPENAI_BASE_URL,
});

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, {
    namespace: ASTRA_DB_NAMESPACE
});

// Function to clean the response by removing unwanted formatting (like bold, etc.)
const cleanResponse = (response: string) => {
    // Remove bold (**) formatting
    let cleanedResponse = response.replace(/\*\*(.*?)\*\*/g, '$1');

    // Optionally, remove any unnecessary common phrases (e.g., "Would you like to know more?")
    const unwantedPhrases = [
        "Would you like to know more?",
        "Let me know if you need further assistance.",
        "Would you like to hear more about this feature?"
    ];

    unwantedPhrases.forEach(phrase => {
        cleanedResponse = cleanedResponse.replace(new RegExp(phrase, 'g'), '');
    });

    return cleanedResponse.trim();
};

export async function POST(req: Request) {
    try {
        // Extract messages from the request body
        const { messages } = await req.json();
        const latestMessage = messages[messages.length - 1]?.content;

        if (!latestMessage) {
            return new Response(JSON.stringify({ error: "No latest message provided" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        let docContext = "";
        const embedding = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: latestMessage,
            encoding_format: "float"
        });

        try {
            const collection = await db.collection(collectionName);
            const cursor = collection.find({}, {
                sort: {
                    $vector: embedding.data[0].embedding,
                },
                limit: 10
            });
            const documents = await cursor.toArray();

            const docsMap = documents?.map(doc => doc.text);

            docContext = JSON.stringify(docsMap);

        } catch (err) {
            console.log("Error querying db ...");
            docContext = "";
        }

        const template = {
            role: 'system',
            content: `
            You are an AI assistant called Touristo. You provide concise and relevant information about the Touristo platform without unnecessary elaboration or formatting.
            Use the context below to answer the user's query. If the context doesn't include the information, tell the user to clarify or inform them that the information isn't available. Be direct and to the point.
            -------------
            START CONTEXT 
            ${docContext}
            END CONTEXT
            ------------
            QUESTION: ${latestMessage}
            `
        };

        // Send the message to OpenAI and get a response
        const response = await openai.chat.completions.create({
            model: 'gpt-4o', // Correct model name
            messages: [template, ...messages]
        });

        console.log("OpenAI Response:", response); // Log the response to ensure it's received

        // Extract AI's response content and clean it
        let aiMessage = response.choices[0]?.message?.content;
        console.log('The message from AI is:', aiMessage);

        if (!aiMessage) {
            return new Response(JSON.stringify({ error: "No response from OpenAI" }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Clean the response to remove any unwanted formatting or phrases
        aiMessage = cleanResponse(aiMessage);

        // Send the cleaned response back to the frontend
        return new Response(JSON.stringify({ response: aiMessage }), {
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "Error processing the request" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
