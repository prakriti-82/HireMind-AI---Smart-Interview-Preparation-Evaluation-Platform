import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);

  // =====================================
  // LOAD INTERVIEWS
  // =====================================
  useEffect(() => {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user) {
      navigate("/");
      return;
    }

    const savedInterviews = JSON.parse(
      localStorage.getItem("interviews") || "[]"
    );

    setInterviews(savedInterviews);

  }, [navigate]);

  // =====================================
  // SCORE COLOR
  // =====================================
  const getScoreColor = (score) => {

    if (score >= 8) {
      return "bg-green-100 text-green-700";
    }

    if (score >= 5) {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-red-100 text-red-700";
  };

  return (

    <div className="w-full min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 p-6">

      {/* HERO */}
      <section className="max-w-6xl mx-auto">

        <div className="bg-white/60 backdrop-blur-xl border border-white/30 shadow-xl rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between">

          <div className="space-y-3">

            <h2 className="text-3xl font-bold text-gray-800">
              AI Mock Interviews 🤖
            </h2>

            <p className="text-gray-600 text-lg">
              Practice interviews with
              AI-generated questions and
              real-time feedback.
            </p>

            <button
              onClick={() =>
                navigate("/interviewprep")
              }
              className="mt-4 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-md hover:scale-105 transition"
            >
              Start Interview
            </button>

          </div>

          <div className="text-6xl mt-6 md:mt-0">
            🚀
          </div>

        </div>
      </section>

      {/* TITLE */}
      <div className="max-w-6xl mx-auto mt-10 mb-4">

        <h2 className="text-xl font-semibold text-gray-700">
          Your Previous Interviews
        </h2>

      </div>

      {/* INTERVIEW GRID */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">

        {interviews.length === 0 ? (

          <div className="col-span-full bg-white/60 backdrop-blur-xl rounded-2xl p-10 text-center shadow-lg">

            <div className="text-5xl mb-4">
              📄
            </div>

            <h3 className="text-xl font-semibold text-gray-700">
              No Interviews Yet
            </h3>

            <p className="text-gray-500 mt-2">
              Start your first AI interview
              to track your progress.
            </p>

          </div>

        ) : (

          interviews.map((item, index) => (

            <div
              key={index}
              className="bg-white/60 backdrop-blur-xl border border-white/30 shadow-lg rounded-2xl p-5 hover:shadow-2xl hover:-translate-y-1 transition"
            >

              {/* ROLE */}
              <h3 className="text-lg font-semibold text-gray-800">

                {item.role || "Unknown Role"}

              </h3>

              {/* TYPE */}
              <p className="text-sm text-gray-500 mt-1">

                Type:
                {" "}
                {item.type || "AI Interview"}

              </p>

              {/* FEEDBACK */}
              {item.feedback && (

                <div className="mt-4">

                  <p className="text-sm text-gray-600 line-clamp-4">

                    {item.feedback}

                  </p>

                </div>
              )}

              {/* SCORE */}
              <div className="mt-5 flex items-center justify-between">

                <span className="text-sm font-medium text-gray-600">
                  Score
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(
                    item.score || 0
                  )}`}
                >

                  {item.score
                    ? `${item.score}/10`
                    : "N/A"}

                </span>

              </div>

              {/* DATE */}
              {item.date && (

                <div className="mt-3 text-xs text-gray-400">

                  {item.date}

                </div>
              )}

            </div>
          ))
        )}

      </section>

    </div>
  );
};

export default Dashboard;