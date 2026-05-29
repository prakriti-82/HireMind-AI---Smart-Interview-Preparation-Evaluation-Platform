import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { APP_FEATURES } from '../utils/data.js';
import HERO_IMAGE from "../assets/hero-img.jpeg";
import AuthModal from "../components/AuthModal";

const isTokenValid = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return exp * 1000 > Date.now();
  } catch { return false; }
};

const LandingPage = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [openAuthModal, setOpenAuthModal] = useState(false);

  // ✅ Redirect logged-in users away from landing page
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token && isTokenValid(token)) navigate("/dashboard", { replace: true });
  }, []);

  // Auto-open auth modal from router state
  useEffect(() => {
    if (location.state?.openAuth) {
      setOpenAuthModal(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // ✅ CTA checks token validity
  const handleCTA = () => {
    const token = localStorage.getItem("accessToken");
    if (token && isTokenValid(token)) {
      navigate("/dashboard");
    } else {
      navigate("/preview");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 relative overflow-hidden">

      {/* BACKGROUND BLURS */}
      <div className="w-[500px] h-[500px] bg-blue-300/30 blur-[80px] absolute top-0 left-0 rounded-full" />
      <div className="w-[400px] h-[400px] bg-blue-200/30 blur-[80px] absolute bottom-0 right-0 rounded-full" />

      <div className="container mx-auto px-6 pt-6 pb-[200px] relative z-10">

        {/* HEADER */}
        <header className="flex justify-between items-center mb-16">
          <div className="text-lg font-semibold text-gray-800">HireMind AI</div>
          <button
            className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
            onClick={() => setOpenAuthModal(true)}
          >
            Login / Sign Up
          </button>
        </header>

        {/* HERO */}
        <div className="grid md:grid-cols-2 gap-14 items-center">
          <div>
            <div className="text-blue-600 font-medium mb-3">
              AI-Powered Interview Preparation
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-5 leading-tight">
              Unlock Your Interview Potential with HireMind AI
            </h1>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              AI-driven interview preparation platform.
            </p>
            <button
              className="px-7 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-all duration-300"
              onClick={handleCTA}
            >
              Get Started
            </button>
          </div>

          <div>
            <img
              src={HERO_IMAGE}
              alt="AI Interview Preparation"
              loading="lazy"
              className="w-full max-w-lg mx-auto rounded-2xl shadow-lg"
            />
          </div>
        </div>

        {/* FEATURES */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Features</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {APP_FEATURES?.map((feature, index) => (
              <div
                key={feature.id || index}
                className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      <AuthModal isOpen={openAuthModal} onClose={() => setOpenAuthModal(false)} />
    </div>
  );
};

export default LandingPage;