import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../../utils/axiosInstance";

import {
  FiArrowLeft,
  FiClock,
  FiTarget,
  FiTrendingUp,
} from "react-icons/fi";

const InterviewDetails = ({ interview: propInterview, onClose }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isModal = !!propInterview;

  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState(null);
  const [error, setError] = useState("");

  // =====================================
  // FETCH / SET INTERVIEW
  // =====================================
  useEffect(() => {
  if (isModal) {
    setInterview(propInterview);
    setLoading(false);
    return;
  }

  if (!id) {
    setError("Invalid interview ID");
    setLoading(false);
    return;
  }

  const fetchInterview = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/ai/interviews/${id}`);
      setInterview(res.data.interview);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load interview");
    } finally {
      setLoading(false);
    }
  };

  fetchInterview();
}, [id, propInterview, isModal]);

  // =====================================
  // LOADING
  // =====================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold text-gray-500">
        Loading Interview...
      </div>
    );
  }

  // =====================================
  // ERROR
  // =====================================
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg font-semibold">
        {error}
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg font-semibold">
        Interview not found
      </div>
    );
  }

  // =====================================
  // ANALYTICS
  // =====================================
  const messages = interview.messages || [];

  const totalQuestions = messages.length;

  const averageScore = interview.averageScore || 0;

  const totalTime = messages.reduce(
    (sum, m) => sum + (m.responseTime || 0),
    0
  );

  const averageTime = totalQuestions
    ? Math.floor(totalTime / totalQuestions)
    : 0;

  const bestScore = Math.max(
    ...messages.map((m) => m.score || 0),
    0
  );

  // =====================================
  // SCORE COLORS
  // =====================================
  const getScoreColor = (score) => {
    if (score >= 8) {
      return "from-emerald-500 to-green-600";
    }
    if (score >= 5) {
      return "from-yellow-500 to-orange-500";
    }
    return "from-red-500 to-rose-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dbeafe] via-[#eef4ff] to-[#c7d2fe] p-4 md:p-8">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto">

        <button
          onClick={() => {
            if (onClose) return onClose();
            navigate("/dashboard");
          }}
          className="mb-6 flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/70 backdrop-blur-xl shadow-md hover:scale-[1.02] transition-all"
        >
          <FiArrowLeft />
          Back to Dashboard
        </button>

        {/* HERO */}
        <div className="bg-white/60 backdrop-blur-2xl border border-white/40 rounded-[32px] p-8 shadow-[0_8px_40px_rgba(59,130,246,0.12)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">

            <div>
              <h1 className="text-4xl font-black text-[#0f172a]">
                {interview.role}
              </h1>
              <p className="text-[#64748b] mt-3 text-lg">
                AI Mock Interview Analytics
              </p>
            </div>

            <div
              className={`px-8 py-5 rounded-3xl bg-gradient-to-r ${getScoreColor(
                averageScore
              )} text-white shadow-2xl`}
            >
              <p className="text-sm opacity-90">Average Score</p>
              <h2 className="text-4xl font-black mt-1">
                {averageScore}/10
              </h2>
            </div>

          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

          <div className="bg-white/60 backdrop-blur-2xl rounded-[28px] p-6 shadow-lg flex items-center gap-3">
            <FiTarget className="text-blue-600 text-2xl" />
            <div>
              <p className="text-sm text-gray-500">Questions</p>
              <h2 className="text-3xl font-black">{totalQuestions}</h2>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-2xl rounded-[28px] p-6 shadow-lg flex items-center gap-3">
            <FiClock className="text-indigo-600 text-2xl" />
            <div>
              <p className="text-sm text-gray-500">Avg Response Time</p>
              <h2 className="text-3xl font-black">{averageTime}s</h2>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-2xl rounded-[28px] p-6 shadow-lg flex items-center gap-3">
            <FiTrendingUp className="text-emerald-600 text-2xl" />
            <div>
              <p className="text-sm text-gray-500">Best Score</p>
              <h2 className="text-3xl font-black">{bestScore}/10</h2>
            </div>
          </div>

        </div>

        {/* QUESTIONS */}
        <div className="mt-10 space-y-6">

          {messages.map((msg, index) => (
            <div
              key={index}
              className="bg-white/60 backdrop-blur-2xl border border-white/40 rounded-[28px] p-7 shadow-[0_8px_30px_rgba(59,130,246,0.08)]"
            >

              {/* TOP */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>
                  <p className="text-sm font-semibold text-blue-600">
                    Question {index + 1}
                  </p>
                  <h2 className="text-xl font-bold text-[#0f172a] mt-2">
                    {msg.question}
                  </h2>
                </div>

                <div
                  className={`px-5 py-3 rounded-2xl bg-gradient-to-r ${getScoreColor(
                    msg.score
                  )} text-white shadow-lg`}
                >
                  <span className="font-bold text-lg">
                    {msg.score}/10
                  </span>
                </div>

              </div>

              {/* ANSWER */}
              <div className="mt-6">
                <p className="text-sm font-semibold text-[#475569] mb-2">
                  Your Answer
                </p>
                <div className="bg-white/70 rounded-2xl p-5 text-gray-700">
                  {msg.answer}
                </div>
              </div>

              {/* FEEDBACK */}
              <div className="mt-6">
                <p className="text-sm font-semibold text-[#475569] mb-2">
                  AI Feedback
                </p>
                <div className="bg-blue-50 rounded-2xl p-5 text-gray-700 border border-blue-100">
                  {msg.feedback}
                </div>
              </div>

              {/* META */}
              <div className="flex flex-wrap gap-3 mt-6">
                <div className="px-4 py-2 rounded-full bg-white text-sm font-semibold shadow-sm">
                  Difficulty: {msg.difficulty}
                </div>
                <div className="px-4 py-2 rounded-full bg-white text-sm font-semibold shadow-sm">
                  Round: {msg.round}
                </div>
                <div className="px-4 py-2 rounded-full bg-white text-sm font-semibold shadow-sm">
                  Time: {msg.responseTime}s
                </div>
              </div>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
};

export default InterviewDetails;