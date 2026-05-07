import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_FEATURES } from '../utils/data.js';
import HERO_IMAGE from "../assets/hero-img.jpeg";
import AuthModal from "../components/AuthModal";

const LandingPage = () => {
    const navigate = useNavigate();

    const [openAuthModal, setOpenAuthModal] = useState(false);

    const handleCTA = () => {
         // ✅ IMPORTANT FIX: ONLY ONE TOKEN SYSTEM
        const token = localStorage.getItem("accessToken");

        if (token) {
            navigate("/dashboard");
        } else {
            alert("Please login or sign up to continue");
            setOpenAuthModal(true);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 relative overflow-hidden">

            <div className="w-[500px] h-[500px] bg-blue-300/30 blur-[80px] absolute top-0 left-0 rounded-full" />
            <div className="w-[400px] h-[400px] bg-blue-200/30 blur-[80px] absolute bottom-0 right-0 rounded-full" />

            <div className="container mx-auto px-6 pt-6 pb-[200px] relative z-10">

                <header className="flex justify-between items-center mb-16">
                    <div className="text-lg font-semibold text-gray-800">
                        HireMind AI
                    </div>

                    <button
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                        onClick={() => setOpenAuthModal(true)}
                    >
                        Login / Sign Up
                    </button>
                </header>

                <div className="grid md:grid-cols-2 gap-14 items-center">

                    <div>
                        <div className="text-blue-600 font-medium mb-3">
                            AI-Powered Interview Preparation
                        </div>

                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-5">
                            Unlock Your Interview Potential with HireMind AI
                        </h1>

                        <p className="text-gray-600 text-lg mb-8">
                            AI-driven interview preparation platform.
                        </p>

                        <button
                            className="px-7 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl shadow-lg"
                            onClick={handleCTA}
                        >
                            Get Started
                        </button>
                    </div>

                    <div>
                        <img src={HERO_IMAGE} alt="Hero" className="w-full max-w-lg mx-auto" />
                    </div>
                </div>

                <div className="mt-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold">Features</h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {APP_FEATURES.map((feature, index) => (
                            <div key={feature.id || index} className="p-6 bg-white rounded-2xl shadow-md">
                                <h3 className="font-semibold">{feature.title}</h3>
                                <p className="text-gray-600 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            <AuthModal
                isOpen={openAuthModal}
                onClose={() => setOpenAuthModal(false)}
            />
        </div>
    );
};

export default LandingPage;