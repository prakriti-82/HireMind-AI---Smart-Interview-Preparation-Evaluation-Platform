import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_FEATURES } from '../utils/data.js';
import HERO_IMAGE from "../assets/hero-img.jpeg";
import AuthModal from "../components/AuthModal";

const LandingPage = () => {
    const navigate = useNavigate();

    const [openAuthModal, setOpenAuthModal] = useState(false);
 
   const handleCTA = () => {
  const token = localStorage.getItem("token");

  if (token) {
    navigate("/dashboard");
  } else {
    alert("Please login or sign up to continue");
    setOpenAuthModal(true);
  }
};
    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 relative overflow-hidden">

            {/* Blur Background */}
            <div className="w-[500px] h-[500px] bg-blue-300/30 blur-[80px] absolute top-0 left-0 rounded-full" />
            <div className="w-[400px] h-[400px] bg-blue-200/30 blur-[80px] absolute bottom-0 right-0 rounded-full" />

            <div className="container mx-auto px-6 pt-6 pb-[200px] relative z-10">
                
                {/* Header */}
                <header className="flex justify-between items-center mb-16">
                    <div className="text-lg font-semibold text-gray-800">
                        HireMind AI
                    </div>

                    <button  
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:scale-105 hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                        onClick={() => setOpenAuthModal(true)}
                    >
                        Login / Sign Up
                    </button>
                </header>

                {/* Hero Section */}
                <div className="grid md:grid-cols-2 gap-14 items-center">

                    {/* Left Content */}
                    <div>
                        <div className="text-blue-600 font-medium mb-3">
                            AI-Powered Interview Preparation
                        </div>

                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
                            Unlock Your Interview Potential with HireMind AI <br />
                            <span className="text-blue-600">
                                Personalized, AI-Driven Interview Preparation for Your Success
                            </span>
                        </h1>

                        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                            Get role-specific questions, expanded answers when you need them,
                            dive deeper into concepts, and organize everything your way.
                            From preparation to practice and beyond, HireMind AI is your all-in-one interview companion.
                        </p>

                        <button 
                            className="px-7 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 hover:from-blue-600 hover:to-indigo-600 transition-all duration-300"
                            onClick={handleCTA}
                        >
                            Get Started 
                        </button>
                    </div>

                    {/* Right Image */}
                    <div>
                        <img 
                            src={HERO_IMAGE} 
                            alt="Hero"
                            className="w-full max-w-lg mx-auto drop-shadow-2xl hover:scale-105 transition duration-500"
                        />
                    </div>
                </div>

                {/* Features Section */}
                <div className="mt-24">

                    {/* Heading */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                            Powerful Features to Boost Your Preparation 
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Everything you need to crack interviews — from AI-generated questions 
                            to deep concept explanations and organized learning.
                        </p>
                    </div>

                    {/* Feature Cards */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.isArray(APP_FEATURES) &&
                            APP_FEATURES.map((feature, index) => (
                                <div 
                                    key={feature.id || index}
                                    className="relative p-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100"
                                >

                                    <h3 className="text-lg font-semibold text-gray-800 mb-2 mt-2">
                                        {feature.title}
                                    </h3>

                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                    </div>
                </div>

            </div> {/* END container */}

         <AuthModal 
    isOpen={openAuthModal} 
    onClose={() => setOpenAuthModal(false)} 
/>

        </div> 
        /* END main wrapper */
    );
};

export default LandingPage;