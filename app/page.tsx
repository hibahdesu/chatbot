'use client';

import Chatbot from "./components/Chatbot"; // Import the Chatbot component

const Home = () => {
    return (
        <div>
            <h1>Welcome to the Home Page!</h1>
            {/* Chatbot component that can be used in any page */}
            <Chatbot />
        </div>
    );
};

export default Home;
