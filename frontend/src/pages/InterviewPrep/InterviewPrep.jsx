import React, { useState } from "react";
import axios from "../../utils/axiosInstance";
import {
  FiUploadCloud,
  FiBriefcase,
  FiFileText,
  FiSend,
} from "react-icons/fi";

const InterviewPrep = () => {

  const [jobRole, setJobRole] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [resume, setResume] = useState(null);

  const [chat, setChat] = useState([]);
  const [currentQuestion, setCurrentQuestion] =
    useState(null);

  const [answer, setAnswer] = useState("");

  const [loading, setLoading] = useState(false);

  const [interviewStarted, setInterviewStarted] =
    useState(false);

  // ======================================
  // FILE CHANGE
  // ======================================
  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  // ======================================
  // START INTERVIEW
  // ======================================
 const startInterview = async () => {

  if (!jobRole && !jobDesc && !resume) {

    alert(
      "Provide job role, description or resume"
    );

    return;
  }

  try {

    setLoading(true);

    // ======================================
    // FORM DATA
    // ======================================
    const formData = new FormData();

    formData.append(
      "jobRole",
      jobRole
    );

    formData.append(
      "jobDesc",
      jobDesc
    );

    // ======================================
    // APPEND RESUME
    // ======================================
    if (resume) {

      formData.append(
        "resume",
        resume
      );
    }

    // ======================================
    // API CALL
    // ======================================
    const res = await axios.post(
      "/ai/start-interview",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    const firstQuestion =
      res.data.question;

    setInterviewStarted(true);

    setCurrentQuestion(
      firstQuestion
    );

    setChat([
      {
        type: "ai",

        text:
          "🚀 Interview session started successfully",
      },

      {
        type: "ai",
        text: firstQuestion,
      },
    ]);

  } catch (err) {

    console.error(err);

    alert(
      err.response?.data?.message ||
      "Failed to start interview"
    );

    } finally {

      setLoading(false);
    }
  };

  // ======================================
  // SUBMIT ANSWER
  // ======================================
  const submitAnswer = async () => {

    if (!answer.trim()) return;

    const userAnswer = answer;

    setChat((prev) => [
      ...prev,

      {
        type: "user",
        text: userAnswer,
      },

      {
        type: "ai",
        text: "🤖 Evaluating answer...",
        loading: true,
      },
    ]);

    setAnswer("");

    try {

      setLoading(true);

      const res = await axios.post(
        "/ai/evaluate-answer",
        {
          question: currentQuestion,

          answer: userAnswer,

          jobRole,
        }
      );

      const {
        feedback,
        score,
        nextQuestion,
      } = res.data;

      // ======================================
      // UPDATE CHAT
      // ======================================
      setChat((prev) => {

        const updated = [...prev];

        updated.pop();

        return [
          ...updated,

          {
            type: "ai",

            text:
              `📊 Score: ${score}/10\n\n` +
              `💡 Feedback:\n${feedback}`,
          },

          {
            type: "ai",

            text:
              nextQuestion ||
              "🎉 Interview completed!",
          },
        ];
      });

      setCurrentQuestion(nextQuestion);

    } catch (err) {

      console.error(err);

      setChat((prev) => [

        ...prev,

        {
          type: "ai",

          text:
            err.response?.data?.message ||
            "AI evaluation failed.",
        },
      ]);

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#dbeafe] via-[#eef4ff] to-[#c7d2fe] p-4 md:p-8">

      {/* BACKGROUND BLURS */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-400/30 blur-[120px] rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-indigo-400/30 blur-[120px] rounded-full"></div>

      <div className="relative z-10">

        {/* HERO HEADER */}
        <section className="w-full mb-8">

          <div className="relative overflow-hidden bg-white/70 backdrop-blur-2xl border border-white/40 shadow-[0_8px_40px_rgba(59,130,246,0.12)] rounded-[32px] p-8 flex flex-col md:flex-row items-center justify-between transition-all duration-300 hover:shadow-[0_8px_60px_rgba(59,130,246,0.18)]">

            {/* DECORATION */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-400/20 rounded-full blur-3xl"></div>

            <div className="space-y-4 relative z-10">

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold shadow-sm">

                ✨ AI Interview Assistant

              </div>

              <h1 className="text-4xl md:text-5xl font-black text-[#0f172a] leading-tight">

                Interview Preparation
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {" "}AI
                </span>

              </h1>

              <p className="text-[#475569] text-lg leading-relaxed max-w-2xl">

                Practice realistic AI-powered mock
                interviews with instant feedback,
                scoring, and personalized questions.

              </p>

              {/* STATS */}
              <div className="flex flex-wrap gap-4 pt-2">

                <div className="px-4 py-3 rounded-2xl bg-white/70 border border-white/40 shadow-sm">
                  <h4 className="text-xl font-black text-blue-600">
                    24/7
                  </h4>
                  <p className="text-xs text-gray-500">
                    AI Availability
                  </p>
                </div>

                <div className="px-4 py-3 rounded-2xl bg-white/70 border border-white/40 shadow-sm">
                  <h4 className="text-xl font-black text-indigo-600">
                    Instant
                  </h4>
                  <p className="text-xs text-gray-500">
                    Feedback
                  </p>
                </div>

              </div>

            </div>

            <div className="relative z-10 text-7xl mt-8 md:mt-0 drop-shadow-lg animate-bounce">

              🤖

            </div>

          </div>

        </section>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT PANEL */}
          <div className="bg-white/45 backdrop-blur-2xl border border-white/30 shadow-[0_8px_40px_rgba(0,0,0,0.08)] rounded-[32px] p-7">

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-2xl font-bold text-gray-800">
                  Setup Interview
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Configure your AI interview
                </p>

              </div>

              <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg">
                🚀
              </div>

            </div>

            {/* ROLE */}
            <div className="mb-5">

              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">

                <FiBriefcase />

                Job Role

              </label>

              <input
                value={jobRole}
                onChange={(e) =>
                  setJobRole(e.target.value)
                }
                placeholder="Frontend Developer"
                className="w-full px-5 py-4 rounded-2xl bg-white/70 border border-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 shadow-sm transition-all duration-300 focus:shadow-lg"
              />

            </div>

            {/* DESCRIPTION */}
            <div className="mb-5">

              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">

                <FiFileText />

                Job Description

              </label>

              <textarea
                value={jobDesc}
                onChange={(e) =>
                  setJobDesc(e.target.value)
                }
                placeholder="Paste required skills and responsibilities..."
                className="w-full px-5 py-4 rounded-2xl bg-white/70 border border-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 h-36 resize-none shadow-sm transition-all duration-300 focus:shadow-lg"
              />

            </div>

            {/* UPLOAD */}
            <div className="relative overflow-hidden border-2 border-dashed border-blue-300 rounded-3xl p-8 text-center bg-gradient-to-br from-blue-50/70 to-indigo-50/70 hover:scale-[1.01] transition-all duration-300">

              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-300/10 rounded-full blur-3xl"></div>

              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="resume"
              />

              <label
                htmlFor="resume"
                className="cursor-pointer flex flex-col items-center relative z-10"
              >

                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">

                  <FiUploadCloud
                    size={30}
                    className="text-white"
                  />

                </div>

                <span className="text-gray-700 font-semibold mt-4">

                  {resume
                    ? resume.name
                    : "Upload Resume"}

                </span>

                <span className="text-sm text-gray-500 mt-1">

                  PDF or DOC format

                </span>

              </label>

            </div>

            {/* BUTTON */}
            <button
              onClick={startInterview}
              disabled={loading}
              className="w-full mt-7 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white font-bold text-lg shadow-xl hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 disabled:opacity-50"
            >

              {loading
                ? "Starting..."
                : "Start Interview"}

            </button>

          </div>

          {/* RIGHT PANEL */}
          <div className="relative overflow-hidden bg-white/45 backdrop-blur-2xl border border-white/30 shadow-[0_8px_40px_rgba(0,0,0,0.08)] rounded-[32px] p-6 flex flex-col h-[760px]">

            {/* GLOW */}
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-400/10 rounded-full blur-3xl"></div>

            {/* TOP */}
            <div className="flex items-center justify-between mb-5 relative z-10">

              <div>

                <h2 className="text-2xl font-bold text-gray-800">
                  Interview Chat
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Real-time AI interaction
                </p>

              </div>

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-lg">
                🤖
              </div>

            </div>

            {/* CHAT */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-5 relative z-10">

              {chat.length === 0 && (

                <div className="flex flex-col items-center justify-center h-full text-center">

                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-4xl shadow-2xl mb-5 animate-pulse">
                    🤖
                  </div>

                  <h3 className="text-2xl font-bold text-gray-700">
                    Ready for your interview
                  </h3>

                  <p className="text-gray-500 mt-2 max-w-sm">
                    Fill your interview details and
                    start practicing with AI.
                  </p>

                </div>
              )}

              {chat.map((msg, i) => (

                <div
                  key={i}
                  className={`max-w-[85%] p-5 rounded-3xl whitespace-pre-line shadow-md transition-all duration-300 hover:scale-[1.01] ${
                    msg.type === "user"

                      ? "ml-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-md shadow-blue-300/40"

                      : "bg-white/70 backdrop-blur-lg border border-white/40 text-gray-700 rounded-bl-md"
                  }`}
                >

                  <div className="text-sm leading-relaxed">

                    {msg.loading
                      ? "Typing..."
                      : msg.text}

                  </div>

                </div>
              ))}
            </div>

            {/* ANSWER BOX */}
            {interviewStarted &&
              currentQuestion && (

              <div className="mt-5 pt-5 border-t border-white/30 relative z-10">

                <textarea
                  value={answer}
                  onChange={(e) =>
                    setAnswer(e.target.value)
                  }
                  placeholder="Type your answer here..."
                  className="w-full p-5 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 resize-none h-32 shadow-sm transition-all duration-300 focus:shadow-lg"
                />

                <button
                  onClick={submitAnswer}
                  disabled={loading}
                  className="w-full mt-4 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold shadow-xl hover:scale-[1.01] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                >

                  <FiSend />

                  {loading
                    ? "Submitting..."
                    : "Submit Answer"}

                </button>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default InterviewPrep;