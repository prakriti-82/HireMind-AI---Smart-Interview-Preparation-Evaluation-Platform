import React, { useState } from "react";
import axios from "../../utils/axiosInstance";
import { FiUploadCloud } from "react-icons/fi";

const InterviewPrep = () => {
  const [jobRole, setJobRole] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState([]);

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!jobRole && !jobDesc && !resume) {
      alert("Please provide job role, description or resume");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("jobRole", jobRole);
      formData.append("jobDesc", jobDesc);
      if (resume) formData.append("resume", resume);

      const res = await axios.post("/ai/interview-prep", formData);

      setChat((prev) => [
        ...prev,
        { type: "user", text: jobRole || "Uploaded Resume + JD" },
        { type: "ai", text: res.data.reply },
      ]);
    } catch (err) {
      console.error(err);
      alert("AI request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-100 via-white to-blue-50">

      {/* Background blobs */}
      <div className="w-[400px] h-[400px] md:w-[500px] md:h-[500px] bg-blue-300/30 blur-[90px] absolute top-0 left-0 rounded-full" />
      <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-indigo-300/30 blur-[90px] absolute bottom-0 right-0 rounded-full" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">

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
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl p-4 md:p-6">

            {/* Job Role */}
            <label className="text-sm text-gray-600">Job Role</label>
            <input
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              placeholder="e.g. Frontend Developer"
              className="w-full mt-2 mb-4 px-4 py-2.5 text-sm md:text-base rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
            />

            {/* Job Description */}
            <label className="text-sm text-gray-600">Job Description</label>
            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Paste job description here..."
              className="w-full mt-2 mb-4 px-4 py-2.5 h-28 md:h-32 text-sm md:text-base rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none"
            />

            {/* Resume Upload */}
            <label className="text-sm text-gray-600">Resume Upload</label>
            <div className="mt-2 border-2 border-dashed border-blue-300 rounded-xl p-5 md:p-6 text-center bg-blue-50/40 hover:bg-blue-50 transition">
              <input type="file" onChange={handleFileChange} className="hidden" id="resume" />
              <label htmlFor="resume" className="cursor-pointer flex flex-col items-center">
                <FiUploadCloud size={24} className="text-blue-500" />
                <span className="text-xs md:text-sm text-gray-600 mt-2 text-center">
                  {resume ? resume.name : "Click to upload resume (PDF)"}
                </span>
              </label>
            </div>

            {/* Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-5 md:mt-6 py-2.5 md:py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm md:text-base font-semibold hover:scale-[1.02] transition"
            >
              {loading ? "Analyzing..." : "Generate Interview Plan"}
            </button>
          </div>

          {/* RIGHT PANEL (CHAT) */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl p-4 md:p-6 flex flex-col h-[400px] md:h-[600px]">

            <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-gray-700">
              AI Response
            </h2>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">

              {chat.length === 0 && (
                <p className="text-gray-400 text-xs md:text-sm">
                  Your AI interview strategy will appear here...
                </p>
              )}

              {chat.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg text-xs md:text-sm max-w-[85%] ${
                    msg.type === "user"
                      ? "bg-blue-500 text-white ml-auto"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {msg.text}
                </div>
              ))}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default InterviewPrep;