import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../../utils/axiosInstance";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    interviews: 0,
    questions: 0,
    accuracy: 0,
  });

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
          navigate("/");
          return;
        }

        setUser(storedUser);

        const res = await axios.get("/user/stats");
        setStats(res.data);

        setChartData(
          res.data.history || [
            { day: "Mon", score: 4 },
            { day: "Tue", score: 6 },
            { day: "Wed", score: 7 },
            { day: "Thu", score: 8 },
            { day: "Fri", score: 6 },
          ]
        );
      } catch {
        navigate("/");
      }
    };

    init();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isActive = (path) =>
    location.pathname === path
      ? "bg-blue-100 text-blue-600"
      : "text-gray-600 hover:text-blue-600";

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-300/20 blur-[100px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-300/20 blur-[100px] rounded-full" />

      {/* CONTENT */}
      <div className="relative z-10 p-6 md:p-10">

        {/* NAVBAR */}
        <div className="flex justify-between items-center mb-8 bg-white/70 backdrop-blur-xl px-4 py-3 rounded-xl shadow-sm">

          <h2 className="text-lg font-bold text-blue-600">
            HireMind AI
          </h2>

          <div className="flex items-center gap-3 text-sm">

            <button
              onClick={() => navigate("/dashboard")}
              className={`px-3 py-1.5 rounded-lg transition ${isActive("/dashboard")}`}
            >
              Dashboard
            </button>

            <button
              onClick={() => navigate("/interviewprep")}
              className={`px-3 py-1.5 rounded-lg transition ${isActive("/interviewprep")}`}
            >
              Interview
            </button>

            <button
              onClick={() => navigate("/profile")}
              className={`px-3 py-1.5 rounded-lg transition ${isActive("/profilepage")}`}
            >
              Profile
            </button>

            <button
              onClick={handleLogout}
              className="text-red-500 ml-2"
            >
              Logout
            </button>

          </div>
        </div>

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-gray-500 text-sm">Welcome back 👋</p>
            <h1 className="text-2xl font-semibold">
              {user?.name || "User"}
            </h1>
          </div>

          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
            {user?.email?.charAt(0)?.toUpperCase()}
          </div>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Interviews" value={stats.interviews} color="blue" />
          <StatCard title="Questions" value={stats.questions} color="green" />
          <StatCard title="Accuracy" value={`${stats.accuracy}%`} color="purple" />
        </div>

        {/* CHART */}
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-sm mb-8 hover:shadow-xl transition">
          <h2 className="text-lg font-semibold mb-4">
            Performance Trend
          </h2>

          {chartData.length === 0 ? (
            <p className="text-gray-400">No performance data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* ACTIVITY */}
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-sm hover:shadow-xl transition">
          <h2 className="text-lg font-semibold mb-4">
            Recent Activity
          </h2>

          <ul className="space-y-3 text-gray-600">
            <li>Completed interview session</li>
            <li>Answered 10 questions</li>
            <li>Improved score to 8/10</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

/* ✅ FIXED StatCard */
const colorMap = {
  blue: "text-blue-600",
  green: "text-green-600",
  purple: "text-purple-600",
};

const StatCard = ({ title, value, color }) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <p className={`text-sm ${colorMap[color]}`}>{title}</p>
      <h2 className={`text-3xl font-bold mt-2 ${colorMap[color]}`}>
        {value}
      </h2>
    </div>
  );
};

export default Dashboard;