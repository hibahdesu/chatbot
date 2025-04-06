'use client';

import Chatbot from "./components/Chatbot";
import { useState, useEffect } from "react";

const Home = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = [
        { src: "./images/2.jpg", alt: "AlUla" },
        { src: "./images/4.jpg", alt: "Diriyah" },
        { src: "./images/3.jpg", alt: "Jeddah" },
    ];

    // Go to the next image
    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    // Go to the previous image
    const goToPrevious = () => {
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + images.length) % images.length
        );
    };

    // Automatically change the image every 5 seconds
    useEffect(() => {
        const intervalId = setInterval(goToNext, 5000); // Change image every 5000ms (5 seconds)

        return () => clearInterval(intervalId); // Clean up the interval when the component unmounts
    }, []); // Empty dependency array means this runs only once on mount

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start">

            {/* Image Slider Section */}
            <div className="w-full max-w-full h-[350px] sm:h-[450px] md:h-[500px] relative overflow-hidden mb-12 rounded-xl shadow-xl">
                <div className="absolute inset-0 z-10 bg-black opacity-50"></div>
                <div className="relative z-20 w-full h-full transition-all duration-700 ease-in-out">
                    {/* Image Display */}
                    <img
                        className="block w-full h-full object-cover rounded-xl"
                        src={images[currentIndex].src}
                        alt={images[currentIndex].alt}
                    />
                    {/* Caption */}
                    <div className="absolute bottom-4 left-4 text-white font-semibold text-lg bg-black bg-opacity-60 p-3 rounded-lg">
                        {images[currentIndex].alt}
                    </div>

                    {/* Navigation Buttons */}
                    <button
                        onClick={goToPrevious}
                        className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-3 rounded-full shadow-lg hover:bg-opacity-70 transition-all duration-300 z-30"
                    >
                        &#8592;
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-3 rounded-full shadow-lg hover:bg-opacity-70 transition-all duration-300 z-30"
                    >
                        &#8594;
                    </button>

                    {/* Header Text Overlay */}
                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center text-white px-6 py-16 sm:py-20 md:py-28">
                        <h1 className="text-4xl sm:text-5xl font-bold tracking-wide leading-tight mb-6">
                            Explore the Wonders of Saudi Arabia
                        </h1>
                    </div>
                </div>
            </div>

            <div>
                <h1 className="text-4xl font-bold text-[#2c3e50] mb-8 text-center">
                    Welcome to Our Chatbot
                </h1>
                <p className="text-lg text-[#34495e] max-w-2xl text-center mb-12 px-4">
                    Discover the beauty and culture of Saudi Arabia with our interactive chatbot. Whether you're looking for travel tips, local attractions, or cultural insights, we're here to help you navigate your journey.
                </p>
                    
            </div>

            {/* Image Section */}
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl mt-12 p-8 mx-4 text-center">
                <h2 className="text-3xl font-semibold text-[#2c3e50] mb-8">
                    Discover the Beauty of Saudi Arabia
                </h2>
                <p className="text-lg text-[#34495e] mb-8">
                    From the ancient city of AlUla to the vibrant streets of Jeddah, explore the rich history and stunning landscapes of Saudi Arabia.
                </p>
                <img
                    className="w-full h-auto rounded-xl shadow-lg"
                    src="./images/5.jpg"
                    alt="Saudi Arabia Landscape"
                />
                <p className="text-lg text-[#34495e] mt-4">
                    A glimpse of the breathtaking landscapes that await you in Saudi Arabia.
                </p>
            </div>

            {/* Introduction Section */}
            <div id="how-can-we-help" className="w-full max-w-4xl bg-white rounded-xl shadow-2xl mt-12 p-8 mx-4 text-center">
                <h2 className="text-3xl font-semibold text-[#2c3e50] mb-8">
                    How Can Our Chatbot Help You?
                </h2>
                <div className="grid sm:grid-cols-2 gap-8 text-lg text-[#34495e]">
                    <div className="flex items-start">
                        <span className="text-4xl text-green-500 mr-4">🔍</span>
                        <p>
                            Ask about the best local attractions, hidden gems, or the history behind Saudi Arabia's most famous landmarks.
                        </p>
                    </div>
                    <div className="flex items-start">
                        <span className="text-4xl text-green-500 mr-4">🍽️</span>
                        <p>
                            Looking for a great place to eat? Ask about local cuisine or restaurants, and get personalized recommendations.
                        </p>
                    </div>
                    <div className="flex items-start">
                        <span className="text-4xl text-green-500 mr-4">📅</span>
                        <p>
                            Stay up to date with the latest events in the region. Get information on cultural festivals, local happenings, and more!
                        </p>
                    </div>
                    <div className="flex items-start">
                        <span className="text-4xl text-green-500 mr-4">🗺️</span>
                        <p>
                            Need help with directions? Ask about the best routes and travel advice to get around AlUla, Diriyah, or Jeddah.
                        </p>
                    </div>
                </div>
            </div>

            {/* Chatbot Section */}
            <div className="w-full">
                <Chatbot />
            </div>

            {/* Footer Section */}
            <div className="w-full bg-[#00b16a] py-8 text-center text-white mt-12 rounded-b-3xl flex items-center justify-center flex-col gap-4 shadow-lg ">
                {/* Footer Content */}
                <p className="text-lg font-semibold">© 2025 Explore Saudi Arabia</p>
                <p className="text-sm">All rights reserved.</p>
                <p className="text-sm">Developed by Hibah Sindi</p>
            </div>
        </div>
    );
};

export default Home;
