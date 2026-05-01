import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance";

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    interviews: 0,
    questions: 0,
    accuracy: 0,
  });
  const [loading, setLoading] = useState(true);
  const [openSidebar, setOpenSidebar] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const storedUser = localStorage.getItem("user");

        if (!token) {
          navigate("/");
          return;
        }

        if (!storedUser) {
          localStorage.clear();
          navigate("/");
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        const res = await axios.get("/user/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Dashboard error:", err);
        localStorage.clear();
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">

      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-300/20 blur-[100px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-300/20 blur-[100px] rounded-full" />

      <div className="relative z-10 flex min-h-screen">

        {/* MOBILE HEADER */}
        <div className="md:hidden fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow px-4 py-3 flex justify-between items-center z-50">
          <h2 className="font-bold text-blue-600">HireMind AI</h2>
          <button onClick={() => setOpenSidebar(true)} className="text-xl">
            ☰
          </button>
        </div>

        {/* SIDEBAR */}
        <aside
          className={`
            fixed md:static top-0 left-0 h-full w-64 
            bg-white/80 backdrop-blur-xl shadow-lg p-6 z-50
            transform transition-transform duration-300
            ${openSidebar ? "translate-x-0" : "-translate-x-full"} 
            md:translate-x-0
          `}
        >
          <div className="md:hidden flex justify-end mb-4">
            <button onClick={() => setOpenSidebar(false)}>✕</button>
          </div>

          <h2 className="text-2xl font-bold text-blue-600 mb-8">
            HireMind AI
          </h2>

          <nav className="space-y-4">
            <button className="block w-full text-left text-gray-700 hover:text-blue-600">
              Dashboard
            </button>

            <button
              onClick={() => {
                navigate("/interviewprep");
                setOpenSidebar(false);
              }}
              className="block w-full text-left text-gray-700 hover:text-blue-600"
            >
              Interview Prep
            </button>

            <button className="block w-full text-left text-gray-700 hover:text-blue-600">
              Profile
            </button>

            <button
              onClick={handleLogout}
              className="block w-full text-left text-red-500 mt-6"
            >
              Logout
            </button>
          </nav>
        </aside>

        {/* OVERLAY */}
        {openSidebar && (
          <div
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
            onClick={() => setOpenSidebar(false)}
          />
        )}

        {/* MAIN */}
        <div className="flex-1 p-4 md:p-6 mt-14 md:mt-0">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              Dashboard
            </h1>

            <div className="flex items-center gap-2 md:gap-3 bg-white px-3 py-1.5 rounded-full shadow-sm">
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt="profile"
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover border"
                />
              ) : (
                <div className="w-8 h-8 md:w-9 md:h-9 bg-blue-500 text-white flex items-center justify-center rounded-full text-sm">
                  {user?.email?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}

              <span className="text-xs md:text-sm font-medium text-gray-700 max-w-[90px] md:max-w-[120px] truncate">
                {user?.name || user?.email}
              </span>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">

            <div className="relative p-5 rounded-xl bg-gradient-to-br from-blue-50 to-white shadow border 
            hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-blue-600 text-sm">Interviews</h3>
              <p className="text-2xl font-bold text-blue-700 mt-2">
                {stats.interviews}
              </p>
            </div>

            <div className="relative p-5 rounded-xl bg-gradient-to-br from-green-50 to-white shadow border 
            hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-green-600 text-sm">Questions</h3>
              <p className="text-2xl font-bold text-green-700 mt-2">
                {stats.questions}
              </p>
            </div>

            <div className="relative p-5 rounded-xl bg-gradient-to-br from-indigo-50 to-white shadow border 
            hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-indigo-600 text-sm">Accuracy</h3>
              <p className="text-2xl font-bold text-indigo-700 mt-2">
                {stats.accuracy}%
              </p>
            </div>

          </div>

          {/* ACTIVITY */}
          <div className="bg-white/80 backdrop-blur-xl p-5 md:p-6 rounded-xl shadow 
          hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <h2 className="text-lg font-semibold mb-4">
              Recent Activity
            </h2>

            <ul className="space-y-3 text-gray-600 text-sm md:text-base">
              <li className="border-b pb-2">
                Completed React Interview Practice
              </li>
              <li className="border-b pb-2">
                Solved 10 DSA Questions
              </li>
              <li className="border-b pb-2">
                Started System Design Module
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;