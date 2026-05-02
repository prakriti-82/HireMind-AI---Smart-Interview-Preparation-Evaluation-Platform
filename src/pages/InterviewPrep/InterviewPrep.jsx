import React, { useState } from "react";
import axios from "../../utils/axiosInstance";
import { FiUploadCloud } from "react-icons/fi";

const InterviewPrep = () => {
  const [jobRole, setJobRole] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [resume, setResume] = useState(null);

  const [chat, setChat] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  // 🚀 START INTERVIEW
  const startInterview = async () => {
    if (!jobRole && !jobDesc && !resume) {
      alert("Provide job role, description or resume");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("jobRole", jobRole);
      formData.append("jobDesc", jobDesc);
      if (resume) formData.append("resume", resume);

      const res = await axios.post("/ai/start-interview", formData);

      const firstQuestion = res.data.question;

      setInterviewStarted(true);
      setCurrentQuestion(firstQuestion);

      setChat([
        {
          type: "ai",
          text: `Let's start your interview 🚀`,
        },
        {
          type: "ai",
          text: firstQuestion,
        },
      ]);
    } catch (err) {
      console.error(err);
      alert("Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  // 🚀 SUBMIT ANSWER
  const submitAnswer = async () => {
    if (!answer) return;

    const userAnswer = answer;

    setChat((prev) => [
      ...prev,
      { type: "user", text: userAnswer },
      { type: "ai", text: "Evaluating...", loading: true },
    ]);

    setAnswer("");

    try {
      const res = await axios.post("/ai/evaluate-answer", {
        question: currentQuestion,
        answer: userAnswer,
      });

      const { feedback, score, nextQuestion } = res.data;

      setChat((prev) => {
        const updated = [...prev];
        updated.pop(); // remove loading

        return [
          ...updated,
          {
            type: "ai",
            text: `Score: ${score}/10\n${feedback}`,
          },
          {
            type: "ai",
            text: nextQuestion || "🎉 Interview completed!",
          },
        ];
      });

      setCurrentQuestion(nextQuestion);
    } catch (err) {
      console.error(err);
      setChat((prev) => [
        ...prev,
        { type: "ai", text: "Error evaluating answer." },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 p-4 md:p-6">

        {/* HEADER */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Interview Preparation AI
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Upload resume or paste job description to get AI interview strategy
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">


        {/* LEFT PANEL */}
        <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-6">

          <h2 className="text-lg font-semibold mb-4">
            Setup Interview
          </h2>

          <input
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            placeholder="Job Role (e.g. Frontend Developer)"
            className="w-full mb-4 px-4 py-3 rounded-xl bg-gray-50 border focus:ring-2 focus:ring-blue-400"
          />

          <textarea
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste Job Description"
            className="w-full mb-4 px-4 py-3 rounded-xl bg-gray-50 border h-28"
          />

          {/* Upload */}
          <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 text-center bg-blue-50/40 hover:bg-blue-50 transition">
            <input type="file" onChange={handleFileChange} className="hidden" id="resume" />
            <label htmlFor="resume" className="cursor-pointer flex flex-col items-center">
              <FiUploadCloud size={28} className="text-blue-500" />
              <span className="text-sm mt-2 text-gray-600">
                {resume ? resume.name : "Upload Resume"}
              </span>
            </label>
          </div>

          <button
            onClick={startInterview}
            disabled={loading}
            className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-md hover:scale-[1.02] transition"
          >
            {loading ? "Starting..." : "Start Interview"}
          </button>
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-5 flex flex-col h-[600px]">

          <h2 className="font-semibold mb-4">Interview Chat</h2>

          <div className="flex-1 overflow-y-auto space-y-3">

            {chat.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <p className="text-lg">🚀 Ready for your interview</p>
                <p className="text-sm mt-1">Fill details and start</p>
              </div>
            )}

            {chat.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg max-w-[80%] whitespace-pre-line ${
                  msg.type === "user"
                    ? "bg-blue-600 text-white ml-auto"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {msg.loading ? "Typing..." : msg.text}
              </div>
            ))}
          </div>

          {/* Answer Box */}
          {interviewStarted && currentQuestion && (
            <div className="mt-4">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer..."
                className="w-full p-3 border rounded-lg mb-2"
              />

              <button
                onClick={submitAnswer}
                className="w-full bg-green-600 text-white py-2 rounded-lg"
              >
                Submit Answer
              </button>
            </div>
          )}

        </div>
      </div>
    </div>

  );
};

export default InterviewPrep;