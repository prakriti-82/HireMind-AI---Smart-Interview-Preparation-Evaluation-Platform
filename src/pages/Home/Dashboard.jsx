import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const Dashboard = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return navigate("/");

    const data = JSON.parse(localStorage.getItem("interviews") || "[]");
    setInterviews(data);
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 p-6">

      {/* 🔹 HERO CARD */}
      <section className="max-w-6xl mx-auto">
        <div className="bg-white/60 backdrop-blur-xl border border-white/30 shadow-xl rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-gray-800">
              AI Mock Interviews 🤖
            </h2>

            <p className="text-gray-600 text-lg">
              Practice interviews with AI feedback and improve your skills
            </p>

            <button
              onClick={() => navigate("/interviewprep")}
              className="mt-4 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-md hover:scale-105 transition"
            >
              Start Interview
            </button>
          </div>

          <div className="text-6xl mt-6 md:mt-0">🚀</div>
        </div>
      </section>

      {/* 🔹 SECTION TITLE */}
      <div className="max-w-6xl mx-auto mt-10 mb-4">
        <h2 className="text-xl font-semibold text-gray-700">
          Your Interviews
        </h2>
      </div>

      {/* 🔹 GRID */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">

        {interviews.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 mt-10">
            No interviews yet
          </div>
        ) : (
          interviews.map((item) => (
            <div
              key={item.id}
              className="bg-white/60 backdrop-blur-xl border border-white/30 shadow-lg rounded-2xl p-5 hover:shadow-2xl hover:-translate-y-1 transition"
            >

              <h3 className="text-lg font-semibold text-gray-800">
                {item.role}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Type: {item.type}
              </p>

              <div className="mt-4 flex items-center justify-between">

                <span className="text-sm font-medium text-gray-600">
                  Score:
                </span>

                <span className={`px-3 py-1 rounded-full text-sm font-bold
                  ${item.score >= 80
                    ? "bg-green-100 text-green-700"
                    : item.score >= 50
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                  {item.score ?? "N/A"}
                </span>

              </div>

            </div>
          ))
        )}

      </section>

    </div>
  );
};

export default Dashboard;