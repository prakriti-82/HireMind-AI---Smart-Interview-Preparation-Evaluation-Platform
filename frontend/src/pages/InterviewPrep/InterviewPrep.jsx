import React, {
  useState,
  useRef,
  useEffect,
} from "react";

import axios from "../../utils/axiosInstance";

import {
  FiUploadCloud,
  FiBriefcase,
  FiFileText,
  FiSend,
  FiClock,
  FiTarget,
  FiZap,
} from "react-icons/fi";

const InterviewPrep = () => {

  const [jobRole, setJobRole] =
    useState("");

  const [jobDesc, setJobDesc] =
    useState("");

  const [resume, setResume] =
    useState(null);

  const [chat, setChat] =
    useState([]);

  const [currentQuestion, setCurrentQuestion] =
    useState(null);

  const [answer, setAnswer] =
    useState("");

  const [startLoading, setStartLoading] =
    useState(false);

  const [submitLoading, setSubmitLoading] =
    useState(false);

  const [interviewStarted, setInterviewStarted] =
    useState(false);

  const [interviewId, setInterviewId] =
    useState(null);

  const [questionCount, setQuestionCount] =
    useState(0);

  const [error, setError] =
    useState("");

  // =====================================
  // NEW STATES
  // =====================================
  const [personality, setPersonality] =
    useState("google-style");

  const [difficulty, setDifficulty] =
    useState("medium");

  const [round, setRound] =
    useState("technical");

  const [timer, setTimer] =
    useState(0);

  const [questionStartTime, setQuestionStartTime] =
    useState(Date.now());

  const chatEndRef = useRef(null);

  // =====================================
  // AUTO SCROLL
  // =====================================
  useEffect(() => {

    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [chat]);

  // =====================================
  // TIMER
  // =====================================
  useEffect(() => {

    let interval;

    if (interviewStarted) {

      interval = setInterval(() => {

        setTimer((prev) => prev + 1);

      }, 1000);
    }

    return () => clearInterval(interval);

  }, [interviewStarted]);

  // =====================================
  // FORMAT TIME
  // =====================================
  const formatTime = (seconds) => {

    const mins = Math.floor(seconds / 60);

    const secs = seconds % 60;

    return `${mins}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // =====================================
  // FILE CHANGE
  // =====================================
  const handleFileChange = (e) => {

    setResume(e.target.files[0]);
  };

  // =====================================
  // START INTERVIEW
  // =====================================
  const startInterview = async () => {

    setError("");

    if (
      !jobRole &&
      !jobDesc &&
      !resume
    ) {

      setError(
        "Provide job role, description or resume."
      );

      return;
    }

    try {

      setStartLoading(true);

      setChat([]);

      setQuestionCount(0);

      setCurrentQuestion(null);

      setTimer(0);

      const formData = new FormData();

      formData.append(
        "jobRole",
        jobRole
      );

      formData.append(
        "jobDesc",
        jobDesc
      );

      formData.append(
        "personality",
        personality
      );

      formData.append(
        "difficulty",
        difficulty
      );

      formData.append(
        "round",
        round
      );

      if (resume) {

        formData.append(
          "resume",
          resume
        );
      }

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

      setInterviewId(
        res.data.interviewId
      );

      setInterviewStarted(true);

      setCurrentQuestion(
        firstQuestion
      );

      setQuestionStartTime(Date.now());

      setChat([
        {
          type: "system",

          text:
            "🚀 ✨ Advanced AI Interview Simulator Started",
        },

        {
          type: "ai",

          text: firstQuestion,
        },
      ]);

    } catch (err) {

      console.error(err);

      setError(
        err.response?.data?.message ||
        "Failed to start interview"
      );

    } finally {

      setStartLoading(false);
    }
  };

  // =====================================
  // SUBMIT ANSWER
  // =====================================
  const submitAnswer = async () => {

    if (!answer.trim()) return;

    if (answer.trim().length < 10) {

      setError(
        "Please give a more detailed answer."
      );

      return;
    }

    if (answer.length > 2000) {

      setError(
        "Answer too long (max 2000 characters)."
      );

      return;
    }

    setError("");

    const userAnswer = answer;

    const newCount =
      questionCount + 1;

    setQuestionCount(newCount);

    const responseTime = Math.floor(
      (Date.now() - questionStartTime) /
        1000
    );

    setChat((prev) => [

      ...prev,

      {
        type: "user",

        text: userAnswer,
      },

      {
        type: "ai",

        text:
          "🤖 AI interviewer is analyzing your response...",

        loading: true,
      },
    ]);

    setAnswer("");

    try {

      setSubmitLoading(true);

      const res = await axios.post(
        "/ai/evaluate-answer",
        {
          interviewId,

          question:
            currentQuestion,

          answer: userAnswer,

          questionCount:
            newCount,

          personality,

          difficulty,

          round,

          responseTime,
        }
      );

      const {
        feedback,
        nextQuestion,
        completed,
        finalScore,
        finalFeedback,
        score,
      } = res.data;

      setChat((prev) => {

        const updated = [...prev];

        updated.pop();

        if (completed) {

          return [

            ...updated,

            {
              type: "score",

              score: finalScore,

              text:
                `🏆 Final Score: ${finalScore}/10`,
            },

            {
              type: "ai",

              text:
                `💡 Final Feedback:\n${finalFeedback}`,
            },

            {
              type: "system",

              text:
                "🎉  Interview Completed Successfully!",
            },
          ];
        }

        return [

          ...updated,

          {
            type: "score",

            score,

            text: `Score: ${score}/10`,
          },

          {
            type: "ai",

            text:
              `💡 Feedback: ${feedback}`,
          },

          {
            type: "ai",

            text: nextQuestion,
          },
        ];
      });

      if (completed) {

        setCurrentQuestion(null);

        setInterviewStarted(false);

      } else {

        setCurrentQuestion(
          nextQuestion
        );

        setQuestionStartTime(Date.now());
      }

    } catch (err) {

      console.error(err);

      setError(
        err.response?.data?.message ||
        "AI evaluation failed."
      );

    } finally {

      setSubmitLoading(false);
    }
  };

  // =====================================
  // SCORE COLORS
  // =====================================
  const getScoreColor = (score) => {

    if (score >= 8)
      return "from-emerald-500 to-green-600";

    if (score >= 5)
      return "from-yellow-500 to-orange-500";

    return "from-red-500 to-rose-600";
  };

  return (

    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#dbeafe] via-[#eef4ff] to-[#c7d2fe] p-4 md:p-8">

      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-400/30 blur-[120px] rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-indigo-400/30 blur-[120px] rounded-full"></div>

      <div className="relative z-10">

        {/* HERO */}
        <section className="w-full mb-8">

          <div className="relative overflow-hidden bg-white/70 backdrop-blur-2xl border border-white/40 shadow-[0_8px_40px_rgba(59,130,246,0.12)] rounded-[32px] p-8 flex flex-col md:flex-row items-center justify-between">

            <div className="space-y-4 relative z-10">

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold shadow-sm">
                ✨  Advanced AI Interview Simulator
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-[#0f172a] leading-tight">

                HireMind 

                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {" "}Interview AI
                </span>

              </h1>

              <p className="text-[#475569] text-lg leading-relaxed max-w-2xl">

               Practice realistic AI interviews with smart feedback and adaptive difficulty.
              </p>

            </div>

            <div className="relative z-10 text-7xl mt-8 md:mt-0 drop-shadow-lg animate-pulse">
              🤖
            </div>

          </div>

        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT */}
          <div className="bg-white/45 backdrop-blur-2xl border border-white/30 shadow-[0_8px_40px_rgba(0,0,0,0.08)] rounded-[32px] p-7">

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-2xl font-bold text-gray-800">
                  Setup Interview
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Configure your AI interview session
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
                className="w-full px-5 py-4 rounded-2xl bg-white/70 border border-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 shadow-sm"
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
                className="w-full px-5 py-4 rounded-2xl bg-white/70 border border-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 h-36 resize-none shadow-sm"
              />

            </div>

            {/* SETTINGS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">

              <select
                value={personality}
                onChange={(e) =>
                  setPersonality(e.target.value)
                }
                className="px-4 py-3 rounded-2xl bg-white/70 border border-white/50 text-sm font-medium"
              >

                <option value="friendly">
                  Friendly
                </option>

                <option value="strict">
                  Strict
                </option>

                <option value="google-style">
                  Google Style
                </option>

                <option value="challenging">
                  Challenging
                </option>

              </select>

              <select
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(e.target.value)
                }
                className="px-4 py-3 rounded-2xl bg-white/70 border border-white/50 text-sm font-medium"
              >

                <option value="easy">
                  Easy
                </option>

                <option value="medium">
                  Medium
                </option>

                <option value="hard">
                  Hard
                </option>

              </select>

              <select
                value={round}
                onChange={(e) =>
                  setRound(e.target.value)
                }
                className="px-4 py-3 rounded-2xl bg-white/70 border border-white/50 text-sm font-medium"
              >

                <option value="technical">
                  Technical
                </option>

                <option value="behavioral">
                  Behavioral
                </option>

                <option value="system-design">
                  System Design
                </option>

              </select>

            </div>

            {/* ERROR */}
            {error && (

              <p className="text-red-500 text-sm mb-4 font-medium">

                {error}

              </p>
            )}

            {/* RESUME */}
            <div className="relative overflow-hidden border-2 border-dashed border-blue-300 rounded-3xl p-8 text-center bg-gradient-to-br from-blue-50/70 to-indigo-50/70">

              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="resume"
              />

              <label
                htmlFor="resume"
                className="cursor-pointer flex flex-col items-center"
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

              </label>

            </div>

            {/* BUTTON */}
            <button
              onClick={startInterview}
              disabled={startLoading}
              className="w-full mt-7 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white font-bold text-lg shadow-xl disabled:opacity-50"
            >

              {startLoading
                ? "Starting..."
                : "Start Interview"}

            </button>

          </div>

          {/* RIGHT */}
          <div className="relative overflow-hidden bg-white/45 backdrop-blur-2xl border border-white/30 shadow-[0_8px_40px_rgba(0,0,0,0.08)] rounded-[32px] p-6 flex flex-col h-[760px]">

            {/* TOP BAR */}
            <div className="flex items-center justify-between mb-5 pb-5 border-b border-white/30">

              <div className="flex items-center gap-4">

                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/70 text-sm font-semibold text-blue-700">

                  <FiClock />

                  {formatTime(timer)}

                </div>

                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/70 text-sm font-semibold text-purple-700">

                  <FiTarget />

                  Q{questionCount}/5

                </div>

              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-lg">

                <FiZap />

                {difficulty.toUpperCase()}

              </div>

            </div>

            {/* CHAT */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-5">

              {chat.map((msg, i) => (

                <div key={i}>

                  {msg.type === "score" ? (

                    <div
                      className={`w-fit mx-auto px-5 py-3 rounded-full bg-gradient-to-r ${getScoreColor(
                        msg.score
                      )} text-white font-bold shadow-xl text-sm`}
                    >

                      ⭐ {msg.text}

                    </div>

                  ) : (

                    <div
                      className={`max-w-[85%] p-5 rounded-3xl whitespace-pre-line shadow-md ${
                        msg.type === "user"

                          ? "ml-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-md"

                          : msg.type === "system"
                          ? "mx-auto bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-center"
                          : "bg-white/70 backdrop-blur-lg border border-white/40 text-gray-700 rounded-bl-md"
                      }`}
                    >

                      <div className="text-sm leading-relaxed">

                        {msg.loading
                          ? "Typing..."
                          : msg.text}

                      </div>

                    </div>
                  )}

                </div>
              ))}

              <div ref={chatEndRef} />

            </div>

            {/* ANSWER BOX */}
            {interviewStarted &&
              currentQuestion && (

              <div className="mt-5 pt-5 border-t border-white/30">

                <textarea
                  value={answer}
                  onChange={(e) =>
                    setAnswer(e.target.value)
                  }
                  placeholder="Type your answer here..."
                  className="w-full p-5 rounded-2xl bg-white/70 border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 resize-none h-32"
                />

                <button
                  onClick={submitAnswer}
                  disabled={submitLoading}
                  className="w-full mt-4 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                >

                  <FiSend />

                  {submitLoading
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
