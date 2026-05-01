import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">

      {/* Background */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-300/20 blur-[100px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-300/20 blur-[100px] rounded-full" />

      <div className="relative z-10 flex min-h-screen">

        {/* 📱 MOBILE TOP BAR */}
        <div className="fixed top-0 left-0 right-0 md:hidden flex justify-between items-center px-4 py-3 bg-white/80 backdrop-blur shadow z-50">
          <h2 className="text-lg font-bold text-blue-600">HireMind</h2>
          <button onClick={() => setMenuOpen(true)}>☰</button>
        </div>

        {/* 📱 MOBILE DRAWER */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setMenuOpen(false)}
            />

            <div className="relative w-64 bg-white p-6 shadow-lg">
              <h2 className="text-xl font-bold text-blue-600 mb-6">
                HireMind AI
              </h2>

              <nav className="space-y-4">
                <button onClick={() => {navigate("/dashboard"); setMenuOpen(false);}}>Dashboard</button>
                <button onClick={() => {navigate("/interviewprep"); setMenuOpen(false);}}>Interview Prep</button>
                <button>Profile</button>
                <button onClick={handleLogout} className="text-red-500">
                  Logout
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* 💻 DESKTOP SIDEBAR */}
        <aside className="hidden md:block w-64 bg-white/70 backdrop-blur-xl shadow-lg p-6 border-r">
          <h2 className="text-2xl font-bold text-blue-600 mb-8">
            HireMind AI
          </h2>

          <nav className="space-y-4">
            <button onClick={() => navigate("/dashboard")}>Dashboard</button>
            <button onClick={() => navigate("/interviewprep")}>Interview Prep</button>
            <button>Profile</button>
            <button onClick={handleLogout} className="text-red-500 mt-6">
              Logout
            </button>
          </nav>
        </aside>

        {/* 📦 MAIN CONTENT */}
        <main className="flex-1 p-4 md:p-6 mt-14 md:mt-0">
          {children}
        </main>

      </div>
    </div>
  );
};

export default Layout;