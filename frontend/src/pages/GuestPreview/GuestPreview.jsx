import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const GuestPreview = () => {

  const navigate = useNavigate();

  const liveMessages = [
    "🚀 AI generated a new frontend interview question",
    "📊 Performance analytics updated successfully",
    "🤖 Smart feedback engine evaluated an answer",
    "💼 New React Developer mock interview started",
    "🔥 AI confidence tracking improved by 12%",
    "✨ Personalized career insights generated",
  ];

  const [currentMessage, setCurrentMessage] =
    useState(0);

  useEffect(() => {

    const interval = setInterval(() => {

      setCurrentMessage((prev) =>
        prev === liveMessages.length - 1
          ? 0
          : prev + 1
      );

    }, 2500);

    return () => clearInterval(interval);

  }, []);

  const mockInterviews = [
    {
      role: "Frontend Developer",
      score: 8,
      feedback:
        "Strong React fundamentals with good UI understanding.",
      date: "2 Hours Ago",
    },

    {
      role: "Backend Developer",
      score: 7,
      feedback:
        "Good API knowledge but improve database optimization.",
      date: "Yesterday",
    },

    {
      role: "UI/UX Designer",
      score: 9,
      feedback:
        "Excellent design thinking and visual hierarchy skills.",
      date: "3 Days Ago",
    },
  ];

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

    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#dbeafe] via-[#eef4ff] to-[#c7d2fe] p-4 md:p-8">

      {/* BACKGROUND BLURS */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-400/30 blur-[120px] rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-indigo-400/30 blur-[120px] rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* HERO */}
        <section className="mb-8">

          <div className="bg-white/70 backdrop-blur-2xl border border-white/40 rounded-[32px] p-8 shadow-[0_8px_40px_rgba(59,130,246,0.12)] flex flex-col lg:flex-row items-center justify-between overflow-hidden relative">

            {/* FLOATING EFFECT */}
            <div className="absolute -top-20 -right-20 w-52 h-52 bg-blue-400/20 blur-[90px] rounded-full"></div>

            <div className="max-w-2xl relative z-10">

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-5 animate-pulse">

                👀 Guest Preview Mode

              </div>

              <h1 className="text-4xl md:text-5xl font-black text-[#0f172a] leading-tight">

                Explore HireMind AI
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {" "}Before Login
                </span>

              </h1>

              <p className="text-[#475569] text-lg mt-5 leading-relaxed">

                Experience the future of AI-powered
                interview preparation with live analytics,
                smart evaluations, and personalized insights.

              </p>

              {/* LIVE SLIDING MESSAGE */}
              <div className="mt-7 bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl px-5 py-4 shadow-md overflow-hidden">

                <div
                  key={currentMessage}
                  className="text-blue-700 font-semibold animate-pulse transition-all duration-500"
                >

                  {liveMessages[currentMessage]}

                </div>

              </div>

             {/* LOGIN / SIGNUP BUTTON */}
<div className="mt-8">

  <button
    onClick={() => navigate("/", { state: { openAuth: true } })}
    className="group relative overflow-hidden px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white font-bold shadow-[0_10px_40px_rgba(59,130,246,0.35)] hover:scale-[1.03] transition-all duration-300"
  >

    <span className="relative z-10">

      Login / Sign Up

    </span>

    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

  </button>

</div>
</div>

            {/* RIGHT ICON */}
            <div className="relative z-10 text-[120px] mt-8 lg:mt-0 animate-bounce">

              🤖

            </div>

          </div>

        </section>

        {/* STATS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white/60 backdrop-blur-2xl border border-white/40 rounded-[28px] p-6 shadow-lg hover:-translate-y-2 transition-all duration-300">

            <h3 className="text-4xl font-black text-blue-600">

              120+

            </h3>

            <p className="text-[#475569] mt-2">

              AI Interviews Practiced

            </p>

          </div>

          <div className="bg-white/60 backdrop-blur-2xl border border-white/40 rounded-[28px] p-6 shadow-lg hover:-translate-y-2 transition-all duration-300">

            <h3 className="text-4xl font-black text-indigo-600">

              95%

            </h3>

            <p className="text-[#475569] mt-2">

              User Satisfaction

            </p>

          </div>

          <div className="bg-white/60 backdrop-blur-2xl border border-white/40 rounded-[28px] p-6 shadow-lg hover:-translate-y-2 transition-all duration-300">

            <h3 className="text-4xl font-black text-emerald-600">

              24/7

            </h3>

            <p className="text-[#475569] mt-2">

              AI Interview Support

            </p>

          </div>

        </section>

        {/* DEMO INTERVIEWS */}
        <section>

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-3xl font-black text-[#0f172a]">

                Demo Interview Results

              </h2>

              <p className="text-[#64748b] mt-1">

                Sample analytics visible in guest mode

              </p>

            </div>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">

            {mockInterviews.map((item, index) => (

              <div
                key={index}
                className="bg-white/70 backdrop-blur-2xl border border-white/40 rounded-[28px] p-6 shadow-[0_8px_30px_rgba(59,130,246,0.10)] hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(59,130,246,0.18)] transition-all duration-300"
              >

                <div className="flex items-center justify-between">

                  <h3 className="text-xl font-bold text-[#0f172a]">

                    {item.role}

                  </h3>

                  <div className="text-2xl animate-pulse">

                    💼

                  </div>

                </div>

                <div className="mt-5">

                  <p className="text-sm text-[#475569] leading-relaxed">

                    {item.feedback}

                  </p>

                </div>

                <div className="mt-6 flex items-center justify-between">

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-bold ${getScoreColor(
                      item.score
                    )}`}
                  >

                    {item.score}/10

                  </span>

                  <span className="text-xs text-[#94a3b8]">

                    {item.date}

                  </span>

                </div>

              </div>

            ))}

          </div>

        </section>

      </div>

    </div>
  );
};

export default GuestPreview;