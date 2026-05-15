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

    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-[#eef4ff] via-[#f8fbff] to-[#dfefff] p-6">

      {/* BACKGROUND BLUR EFFECTS */}
      <div className="absolute top-0 left-0 w-[350px] h-[350px] bg-blue-300/20 blur-[120px] rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-indigo-300/20 blur-[120px] rounded-full"></div>

      <div className="relative z-10">

        {/* HERO */}
        <section className="max-w-6xl mx-auto">

          <div className="bg-white/70 backdrop-blur-2xl border border-white/40 shadow-[0_8px_40px_rgba(59,130,246,0.12)] rounded-[32px] p-8 flex flex-col md:flex-row items-center justify-between transition-all duration-300 hover:shadow-[0_8px_60px_rgba(59,130,246,0.18)]">

            <div className="space-y-4">

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">

                🚀 AI Powered Platform

              </div>

              <h2 className="text-4xl font-black text-[#0f172a] leading-tight">

                AI Mock Interviews 🤖

              </h2>

              <p className="text-[#475569] text-lg leading-relaxed max-w-xl">

                Practice interviews with
                AI-generated questions and
                real-time feedback to improve
                your confidence and skills.

              </p>

              <button
                onClick={() =>
                  navigate("/interviewprep")
                }
                className="mt-4 px-7 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-lg hover:shadow-blue-300/40 hover:scale-105 transition-all duration-300"
              >

                Start Interview

              </button>

            </div>

            <div className="text-7xl mt-8 md:mt-0 drop-shadow-lg animate-pulse">

              🚀

            </div>

          </div>

        </section>

        {/* TITLE */}
        <div className="relative z-10 w-full h-full px-6 py-8">

          <h2 className="text-2xl font-bold text-[#0f172a]">

            Your Previous Interviews

          </h2>

          <p className="text-[#64748b] mt-1">

            Track your AI interview progress

          </p>

        </div>

        {/* INTERVIEW GRID */}
        <section className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-7">

          {interviews.length === 0 ? (

            <div className="col-span-full bg-white/70 backdrop-blur-2xl border border-white/40 rounded-[30px] p-12 text-center shadow-[0_8px_40px_rgba(59,130,246,0.10)]">

              <div className="text-6xl mb-5">
                📄
              </div>

              <h3 className="text-2xl font-bold text-[#0f172a]">

                No Interviews Yet

              </h3>

              <p className="text-[#64748b] mt-3 text-lg">

                Start your first AI interview
                and track your progress here.

              </p>

            </div>

          ) : (

            interviews.map((item, index) => (

              <div
                key={index}
                className="group bg-white/70 backdrop-blur-2xl border border-white/40 shadow-[0_8px_30px_rgba(59,130,246,0.10)] rounded-[28px] p-6 hover:-translate-y-2 hover:shadow-[0_12px_50px_rgba(59,130,246,0.18)] transition-all duration-300"
              >

                {/* ROLE */}
                <div className="flex items-center justify-between">

                  <h3 className="text-xl font-bold text-[#0f172a]">

                    {item.role || "Unknown Role"}

                  </h3>

                  <div className="text-2xl">

                    💼

                  </div>

                </div>

                {/* TYPE */}
                <div className="mt-3 inline-flex px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">

                  {item.type || "AI Interview"}

                </div>

                {/* FEEDBACK */}
                {item.feedback && (

                  <div className="mt-5">

                    <p className="text-sm text-[#475569] leading-relaxed line-clamp-4">

                      {item.feedback}

                    </p>

                  </div>
                )}

                {/* SCORE */}
             <div className="relative z-10 w-full h-full px-6 py-8">

                  <span className="text-sm font-semibold text-[#64748b]">

                    Performance

                  </span>

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm ${getScoreColor(
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

                  <div className="mt-5 text-xs text-[#94a3b8]">

                    {item.date}

                  </div>
                )}

              </div>

            ))
          )}

        </section>

      </div>

    </div>
  );
};

export default Dashboard;