//app/components/Chatbot.tsx
'use client';

import { useChat } from 'ai/react';
import { Message } from "ai";
import Bubble from "./Bubble";
import LoadingBubble from "./LoadingBubble";
import PromptSuggestionsRow from "./PromptSuggestionsRow";
import { useState } from "react";
import { FaComments, FaTimes, FaPaperPlane } from 'react-icons/fa'; // Import the required icons

const Chatbot = () => {
    const { append, isLoading, messages, input, handleInputChange, setInput } = useChat();
    const noMessages = !messages || messages.length === 0;
    const [isChatOpen, setIsChatOpen] = useState(false); // State to control chat visibility

    const handlePrompt = async (promptText: string) => {
        const msg: Message = {
            id: crypto.randomUUID(),
            content: promptText,
            role: "user"
        };
        append(msg); // Append user message immediately
        
        // Fetch the AI response from the backend
        try {
            const response = await fetch('/api/chat', {  // Ensure correct backend route here
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ messages: [...messages, msg] })  // Send the full chat history (including user message)
            });

            const data = await response.json();
            console.log("Backend response:", data); // Log the response to check what we get

            if (data.error) {
                console.error("Error from backend:", data.error);
                return;
            }

            const aiMessage: Message = {
                id: crypto.randomUUID(),
                content: data.response,  // AI's response from the backend
                role: 'assistant'
            };
            append(aiMessage);  // Append the AI message to the chat

            // Clear the input field after sending the message
            setInput("");  // This clears the input field

        } catch (error) {
            console.error("Error fetching AI response:", error);
        }
    };

    // Function to close the chat window
    const handleCloseChat = () => {
        setIsChatOpen(false);
    };

    return (
        <main>
            {/* Chat icon button to toggle visibility */}
            <button 
                onClick={() => setIsChatOpen(!isChatOpen)} 
                className={`chat-toggle-btn ${isChatOpen ? 'open' : ''}`}
            >
                {/* Using React Icons for chat toggle */}
                {isChatOpen ? <FaTimes size={24} /> : <FaComments size={24} />}
            </button>

            {/* Chat window */}
            {isChatOpen && (
                <section className="chat-window">
                    {/* Close icon button inside the chat window */}
                    <button 
                        onClick={handleCloseChat}
                        className="close-chat-btn"
                    >
                        <FaTimes size={20} /> {/* Close icon */}
                    </button>

                    <div className="chat-body">
                        <section className={noMessages ? "" : "populated"}>
                            {noMessages ? (
                                <>
                                    <p className="starter-text">Touristo</p>
                                    <br />
                                    <PromptSuggestionsRow onPromptClick={handlePrompt} />
                                </>
                            ) : (
                                <>
                                    {messages.map((message, index) => (
                                        <Bubble key={`message-${index}`} message={message} />
                                    ))}
                                    {isLoading && <LoadingBubble />}
                                </>
                            )}
                        </section>
                    </div>

                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            handlePrompt(input);  // Handle prompt when form is submitted
                        }}
                        className="input-form"
                    >
                        <input
                            className="question-box"
                            onChange={handleInputChange}
                            value={input}
                            placeholder="Ask me some question about Tourist in Saudi Arabia.."
                        />
                        
                        {/* Send icon button using React Icons */}
                        <button 
                            type="submit" 
                            className="send-btn"
                        >
                            <FaPaperPlane size={20} /> {/* Send icon */}
                        </button>
                    </form>
                </section>
            )}
        </main>
    );
};

export default Chatbot;
