import {
  generateInterviewQuestion,
  evaluateInterviewAnswer,
} from "../services/aiService.js";

import Interview from "../models/Interview.js";

import pdfParse from "pdf-parse";

// =======================================
// START INTERVIEW
// =======================================
export const startInterview = async (req, res) => {
  try {

    let { jobRole, jobDesc } = req.body || {};

    let resumeText = "";

    // =======================================
    // READ RESUME PDF
    // =======================================
    if (req.file) {

      const parsedResume =
        await pdfParse(req.file.buffer);

      resumeText = parsedResume.text;
    }

    // =======================================
    // VALIDATION
    // =======================================
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

    // =======================================
    // FALLBACKS
    // =======================================
    const finalRole =
      jobRole || "General Interview";

    const finalDescription =
      jobDesc ||
      resumeText ||
      "General mock interview preparation";

    // =======================================
    // GENERATE QUESTION
    // =======================================
    const question =
      await generateInterviewQuestion(
        finalRole,
        finalDescription
      );

    return res.status(200).json({
      success: true,
      question,
    });

  } catch (error) {

    console.error(
      "Start Interview Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to start interview",
    });
  }
};

// =======================================
// EVALUATE ANSWER + SAVE TO MONGODB
// =======================================
export const evaluateAnswer = async (
  req,
  res
) => {
  try {

    const {
      question,
      answer,
      jobRole,
    } = req.body || {};

    // =======================================
    // VALIDATION
    // =======================================
    if (!question || !answer) {

      return res.status(400).json({
        success: false,
        message:
          "Question and answer required",
      });
    }

    // =======================================
    // AI EVALUATION
    // =======================================
    const result =
      await evaluateInterviewAnswer(
        question,
        answer
      );

    const {
      feedback,
      score,
      nextQuestion,
    } = result;

    // =======================================
    // SAVE INTERVIEW
    // =======================================
    const newInterview =
      await Interview.create({

        user: req.user.id,

        role:
          jobRole ||
          "General Interview",

        type: "AI Mock Interview",

        question,

        answer,

        feedback,

        score,

        date: new Date(),
      });

    // =======================================
    // RESPONSE
    // =======================================
    return res.status(200).json({
      success: true,

      feedback,

      score,

      nextQuestion,

      interview: newInterview,
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
export const getUserInterviews = async (
  req,
  res
) => {
  try {

    const interviews =
      await Interview.find({
        user: req.user.id,
      }).sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      interviews,
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