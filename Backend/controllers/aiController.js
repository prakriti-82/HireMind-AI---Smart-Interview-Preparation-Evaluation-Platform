import {
  generateInterviewQuestion,
  evaluateInterviewAnswer,
} from "../services/aiService.js";

import Interview from "../models/Interview.js";
import { PdfReader } from "pdfreader";

// =======================================
// START INTERVIEW
// =======================================
export const startInterview = async (req, res) => {
  try {

    let {
      jobRole,
      jobDesc,

      // ===================================
      // NEW FAANG SETTINGS
      // ===================================
      personality = "google",
      round = "technical",
      difficulty = "easy",
      mode = "faang",
      timedMode = false,
      durationMinutes = 20,
    } = req.body || {};

    let resumeText = "";

    // ===================================
    // READ PDF RESUME
    // ===================================
    if (req.file) {

      resumeText = await new Promise(
        (resolve, reject) => {

          let text = "";

          new PdfReader().parseBuffer(
            req.file.buffer,

            (err, item) => {

              if (err) {
                reject(err);
              }

              else if (!item) {
                resolve(text);
              }

              else if (item.text) {
                text += item.text + " ";
              }
            }
          );
        }
      );
    }

    // ===================================
    // VALIDATION
    // ===================================
    if (
      !jobRole &&
      !jobDesc &&
      !resumeText
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Provide role, description or resume",
      });
    }

    const finalRole =
      jobRole || "Software Engineer";

    const finalDescription =
      jobDesc ||
      resumeText.slice(0, 1000) ||
      "General mock interview preparation";

    // ===================================
    // GENERATE FIRST QUESTION
    // ===================================
    const question =
      await generateInterviewQuestion(
        finalRole,
        finalDescription,
        resumeText,
        personality,
        difficulty,
        round
      );

    // ===================================
    // CREATE INTERVIEW
    // ===================================
    const interview =
      await Interview.create({

        user: req.user.id,

        role: finalRole,

        type: "AI Mock Interview",

        mode,

        interviewerPersonality:
          personality,

        overallDifficulty:
          difficulty,

        currentRound: round,

        timedMode,

        durationMinutes,

        startedAt: new Date(),

        messages: [],
      });

    return res.status(200).json({

      success: true,

      interviewId:
        interview._id,

      question,

      personality,

      difficulty,

      round,

      mode,

      timedMode,

      durationMinutes,
    });

  } catch (error) {

    console.error(
      "Start Interview Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to start interview",
    });
  }
};

// =======================================
// EVALUATE ANSWER
// =======================================
export const evaluateAnswer = async (
  req,
  res
) => {

  try {

    const {
      interviewId,
      question,
      answer,
      questionCount,
      responseTime = 0,
    } = req.body || {};

    // ===================================
    // VALIDATION
    // ===================================
    if (
      !question ||
      !answer
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Question and answer required",
      });
    }

    if (
      answer.length > 3000
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Answer too long (max 3000 chars)",
      });
    }

    // ===================================
    // FIND INTERVIEW
    // ===================================
    const interview =
      await Interview.findById(
        interviewId
      );

    if (!interview) {

      return res.status(404).json({

        success: false,

        message:
          "Interview not found",
      });
    }

    // ===================================
    // DYNAMIC DIFFICULTY SCALING
    // ===================================
    let dynamicDifficulty =
      "easy";

    if (questionCount >= 3) {
      dynamicDifficulty =
        "medium";
    }

    if (questionCount >= 5) {
      dynamicDifficulty =
        "hard";
    }

    // ===================================
    // EVALUATE AI ANSWER
    // ===================================
    const result =
      await evaluateInterviewAnswer(

        question,

        answer,

        questionCount,

        interview.interviewerPersonality ||
          "google",

        interview.currentRound ||
          "technical"
      );

    const {
      feedback,
      score,
      nextQuestion,
    } = result;

    // ===================================
    // SAVE MESSAGE
    // ===================================
    interview.messages.push({

      question,

      answer,

      feedback:
        feedback || "",

      score:
        score || 0,

      difficulty:
        dynamicDifficulty,

      responseTime,

      round:
        interview.currentRound,

      aiMood:
        interview.interviewerPersonality,
    });

    // ===================================
    // FINAL RESULT
    // ===================================
    if (!nextQuestion) {

      const total =
        interview.messages.reduce(
          (sum, msg) =>
            sum +
            (msg.score || 0),
          0
        );

      const finalScore =
        interview.messages.length

          ? Math.round(
              total /
              interview.messages.length
            )

          : 0;

      // ===============================
      // MARK COMPLETE
      // ===============================
      interview.completed = true;

      interview.endedAt =
        new Date();

      await interview.save();

      return res.status(200).json({

        success: true,

        completed: true,

        finalScore,

        finalFeedback:
          feedback,

        nextQuestion: null,
      });
    }

    // ===================================
    // SAVE INTERVIEW
    // ===================================
    await interview.save();

    return res.status(200).json({

      success: true,

      completed: false,

      feedback,

      score,

      nextQuestion,

      difficulty:
        dynamicDifficulty,
    });

  } catch (error) {

    console.error(
      "Evaluate Answer Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to evaluate answer",
    });
  }
};

// =======================================
// GET USER INTERVIEWS
// =======================================
export const getUserInterviews =
  async (req, res) => {

    try {

      const interviews =
        await Interview.find({
          user: req.user.id,
        })

          .sort({
            createdAt: -1,
          })

          .limit(20)

          .lean();

      // ===================================
      // FORMAT INTERVIEWS
      // ===================================
      const formattedInterviews =
        interviews.map((i) => {

          const messages =
            i.messages || [];

          const total =
            messages.reduce(
              (sum, m) =>
                sum +
                (m.score || 0),
              0
            );

          const averageScore =
            messages.length > 0

              ? Math.round(
                  total /
                  messages.length
                )

              : 0;

          return {

            ...i,

            averageScore,

            totalQuestions:
              messages.length,
          };
        });

      return res.status(200).json({

        success: true,

        interviews:
          formattedInterviews,
      });

    } catch (error) {

      console.error(
        "Fetch Interviews Error:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch interviews",
      });
    }
  };
  // =======================================
// GET SINGLE INTERVIEW BY ID
// =======================================
export const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    return res.status(200).json({
      success: true,
      interview,
    });

  } catch (error) {
    console.error("Get Interview By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};