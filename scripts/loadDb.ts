import { DataAPIClient } from "@datastax/astra-db-ts";
import { readFile } from 'fs/promises';
import OpenAI from "openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import "dotenv/config";

// Declare the SimilarityMetric type manually
type SimilarityMetric = "cosine" | "euclidean" | "dot_product";


// Load environment variables
const {
    ASTRA_DB_NAMESPACE,
    ASTRA_DB_COLLECTION = "Tourist",
    ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_APPLICATION_TOKEN,
    OPENAI_API_KEY,
    OPENAI_BASE_URL
} = process.env;

if (!ASTRA_DB_API_ENDPOINT || !ASTRA_DB_COLLECTION) {
    throw new Error("Required environment variables are missing.");
}

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    baseURL: OPENAI_BASE_URL,
});

// Sample data paths
const TouristData = [
    'public/faq/faq.txt'
];

// Initialize Astra DB client
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, {namespace: ASTRA_DB_NAMESPACE});

// Initialize text splitter
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 100
});

// Function to create a collection
const createCollection = async (similarityMetric: SimilarityMetric = "cosine") => {
    const res = await db.createCollection(ASTRA_DB_COLLECTION, {
        vector: {
            dimension: 1536,
            metric: similarityMetric
        }
    });
    console.log(res);
};

// Function to load .txt file
const loadTextFile = async (filePath: string) => {
    try {
        const content = await readFile(filePath, 'utf-8');
        return content.replace(/<[^>]*>?/gm, ''); // Clean HTML if necessary
    } catch (error) {
        console.error(`Error reading .txt file ${filePath}:`, error);
        return null;
    }
};

// General function to load content from text files
const loadFileContent = async (filePath: string) => {
    if (filePath.endsWith('.txt')) {
        return await loadTextFile(filePath);
    } else {
        console.log(`Unsupported file type: ${filePath}`);
        return null;
    }
};

// Main function to load the sample data into your database
const loadSampleData = async () => {
    const collection = await db.collection(ASTRA_DB_COLLECTION);

    for await (const filePath of TouristData) {
        // Load the file content (only .txt in this case)
        const content = await loadFileContent(filePath);
        if (!content) {
            console.log(`Failed to load content from ${filePath}`);
            continue;
        }

        // Split the content into chunks
        const chunks = await splitter.splitText(content);

        // Process each chunk
        for await (const chunk of chunks) {
            const embedding = await openai.embeddings.create({
                model: "text-embedding-3-small",
                input: chunk,
                encoding_format: "float"
            });

            const vector = embedding.data[0].embedding;

            // Insert the chunk and its embedding into the database
            const res = await collection.insertOne({
                $vector: vector,
                text: chunk
            });

            console.log(res);
        }
    }
};

// Create the collection and load the sample data
createCollection().then(() => loadSampleData());
