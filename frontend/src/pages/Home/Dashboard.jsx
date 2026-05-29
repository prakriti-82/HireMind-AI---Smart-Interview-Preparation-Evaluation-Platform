import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import InterviewDetails from "../InterviewPrep/components/InterviewDetails";

const Dashboard = () => {

  const navigate = useNavigate();

  const [interviews, setInterviews] =
    useState([]);

  const [selectedInterview, setSelectedInterview] =
    useState(null);

  const [showModal, setShowModal] =
    useState(false);

  const [liveMessages] = useState([
    "🚀 AI analyzing interview performance...",
    "💡 Smart feedback generated successfully...",
    "🎯 Confidence score improved by 12%...",
    "🤖 New interview insights available...",
    "📊 Performance analytics updated...",
  ]);

  const [currentMessage, setCurrentMessage] =
    useState(0);

  // =====================================
  // LOAD INTERVIEWS
  // =====================================
useEffect(() => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    navigate("/preview");
    return;
  }

  const fetchInterviews = async () => {
    try {
      const res = await axios.get("/interviews/my-interviews");

      setInterviews(res.data.interviews || []);
    } catch (error) {
      console.error(error);
    }
  };

  fetchInterviews();
}, [navigate]);

  // =====================================
  // LIVE MESSAGE ANIMATION
  // =====================================
  useEffect(() => {

    const interval =
      setInterval(() => {

        setCurrentMessage((prev) =>
          prev ===
          liveMessages.length - 1
            ? 0
            : prev + 1
        );

      }, 2500);

    return () =>
      clearInterval(interval);

  }, [liveMessages.length]);

  // =====================================
  // SCORE COLOR
  // =====================================
  const getScoreColor = (
    score
  ) => {

    if (score >= 8) {
      return "bg-emerald-100 text-emerald-700";
    }

    if (score >= 5) {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-red-100 text-red-700";
  };

  // =====================================
  // FIXED AVERAGE SCORE LOGIC
  // =====================================

  const safeInterviews = interviews.map((item) => ({
    ...item,
    averageScore: item.averageScore ?? 0,
  }));

  const completedInterviews =
    safeInterviews.filter(
      (item) =>
        item.averageScore > 0
    );

  const averageScore =
    completedInterviews.length

      ? (
          completedInterviews.reduce(
            (acc, item) =>
              acc +
              item.averageScore,
            0
          ) /
          completedInterviews.length
        ).toFixed(1)

      : "0";

  return (

    <div className="relative w-full min-h-screen overflow-hidden">

      {/* BACKGROUND EFFECTS */}
      <div className="absolute top-[-100px] left-[-100px] w-[350px] h-[350px] bg-blue-400/20 blur-[140px] rounded-full"></div>

      <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-indigo-400/20 blur-[140px] rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-8">

        {/* HERO */}
        <section>

          <div className="relative overflow-hidden bg-white/65 backdrop-blur-2xl border border-white/40 shadow-[0_8px_50px_rgba(59,130,246,0.15)] rounded-[36px] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between">

            <div className="absolute top-0 right-0 w-60 h-60 bg-blue-400/10 blur-[120px] rounded-full"></div>

            <div className="space-y-5 relative z-10">

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold shadow-sm">

                🚀 AI Powered Platform

              </div>

              <h2 className="text-4xl md:text-5xl font-black text-[#0f172a] leading-tight">

                Welcome Back 👋

              </h2>

              <p className="text-[#475569] text-lg leading-relaxed max-w-2xl">

                Practice AI-powered mock interviews,
                improve communication skills,
                and track your performance growth.

              </p>

              {/* LIVE TEXT */}
              <div className="h-12 overflow-hidden">

                <div
                  key={currentMessage}
                  className="bg-white/80 backdrop-blur-xl border border-white/40 text-[#1554e8] px-5 py-3 rounded-2xl shadow-lg animate-pulse text-sm font-semibold transition-all duration-500"
                >

                  {liveMessages[currentMessage]}

                </div>

              </div>

              <button
                onClick={() =>
                  navigate("/interviewprep")
                }
                className="mt-2 px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-xl hover:shadow-blue-400/40 hover:scale-[1.03] transition-all duration-300"
              >

                Start Interview

              </button>

            </div>

            <div className="relative z-10 text-[120px] mt-8 md:mt-0 drop-shadow-xl animate-pulse">

              🤖

            </div>

          </div>

        </section>

        {/* STATS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

          <div className="bg-white/60 backdrop-blur-2xl border border-white/40 rounded-[28px] p-6 shadow-[0_8px_30px_rgba(59,130,246,0.08)]">

            <p className="text-sm text-gray-500 font-medium">

              Total Interviews

            </p>

            <h2 className="text-4xl font-black text-[#0f172a] mt-3">

              {interviews.length}

            </h2>

          </div>

          <div className="bg-white/60 backdrop-blur-2xl border border-white/40 rounded-[28px] p-6 shadow-[0_8px_30px_rgba(59,130,246,0.08)]">

            <p className="text-sm text-gray-500 font-medium">

              Average Score

            </p>

            <h2 className="text-4xl font-black text-[#0f172a] mt-3">

              {averageScore}/10

            </h2>

          </div>

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[28px] p-6 shadow-[0_8px_30px_rgba(59,130,246,0.20)] text-white">

            <p className="text-sm font-medium opacity-90">

              AI Performance Tracking

            </p>

            <h2 className="text-3xl font-black mt-3">

              Smart Analytics

            </h2>

          </div>

        </section>

        {/* TITLE */}
        <div className="mt-10 mb-6">

          <h2 className="text-3xl font-black text-[#0f172a]">

            Previous Interviews

          </h2>

          <p className="text-[#64748b] mt-2 text-lg">

            Track your interview history and progress

          </p>

        </div>

        {/* GRID */}
        <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">

          {interviews.length === 0 ? (

            <div className="col-span-full bg-white/60 backdrop-blur-2xl border border-white/40 rounded-[32px] p-14 text-center shadow-[0_8px_40px_rgba(59,130,246,0.10)]">

              <div className="text-7xl mb-6">

                📄

              </div>

              <h3 className="text-3xl font-black text-[#0f172a]">

                No Interviews Yet

              </h3>

              <p className="text-[#64748b] mt-4 text-lg max-w-lg mx-auto">

                Start your first AI interview session
                and your performance analytics will appear here.

              </p>

            </div>

          ) : (

            interviews.map((item) => (

              <div
                key={item._id}
                onClick={() => {
                  setSelectedInterview(item);
                  setShowModal(true);
                }}
                className="group cursor-pointer relative overflow-hidden bg-white/65 backdrop-blur-2xl border border-white/40 shadow-[0_8px_30px_rgba(59,130,246,0.08)] rounded-[30px] p-6 hover:-translate-y-2 hover:shadow-[0_12px_50px_rgba(59,130,246,0.18)] transition-all duration-300"
              >

                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 blur-[80px] rounded-full"></div>

                <div className="relative z-10">

                  {/* HEADER */}
                  <div className="flex items-center justify-between">

                    <h3 className="text-2xl font-black text-[#0f172a]">

                      {item.role || "Unknown Role"}

                    </h3>

                    <div className="text-3xl">

                      💼

                    </div>

                  </div>

                  {/* TYPE */}
                  <div className="mt-4 inline-flex px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">

                    {item.type || "AI Interview"}

                  </div>

                  {/* SETTINGS */}
                  <div className="flex flex-wrap gap-2 mt-4">

                    <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">

                      {item.interviewerPersonality || "friendly"}

                    </span>

                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">

                      {item.overallDifficulty || "medium"}

                    </span>

                    <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">

                      {item.currentRound || "technical"}

                    </span>

                  </div>

                  {/* FEEDBACK */}
                  {item.messages?.length > 0 && (

                    <div className="mt-6">

                      <p className="text-sm text-[#475569] leading-relaxed line-clamp-4">

                        {
                          item.messages[
                            item.messages.length - 1
                          ]?.feedback
                        }

                      </p>

                    </div>
                  )}

                  {/* SCORE */}
                  <div className="mt-6 flex items-center justify-between">

                    <span className="text-sm font-semibold text-[#64748b]">

                      Performance

                    </span>

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm ${getScoreColor(
                        item.averageScore || 0
                      )}`}
                    >

                      {(item.averageScore ?? 0) > 0
                        ? `${item.averageScore}/10`
                        : "N/A"}

                    </span>

                  </div>

                  {/* QUESTIONS */}
                  <div className="mt-4 text-sm text-[#64748b]">

                    Questions Answered:
                    {" "}

                    <span className="font-bold text-[#0f172a]">

                      {item.messages?.length || 0}

                    </span>

                  </div>

                  {/* DATE */}
                  <div className="mt-6 text-xs text-[#94a3b8]">

                    {new Date(
                      item.createdAt
                    ).toLocaleDateString()}

                  </div>

                  {/* BUTTON */}
                  <button
                    className="mt-5 w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:scale-[1.02] transition-all"
                  >

                    View Full Interview

                  </button>

                </div>

              </div>

            ))
          )}

        </section>

      </div>

      {/* INTERVIEW DETAILS MODAL */}
      {showModal && selectedInterview && (

        <InterviewDetails
          interview={selectedInterview}
          onClose={() => {
            setShowModal(false);
            setSelectedInterview(null);
          }}
        />

      )}

    </div>
  );
};

export default Dashboard;