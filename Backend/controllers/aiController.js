import {
  generateInterviewQuestion,
  evaluateInterviewAnswer,
} from "../services/aiService.js";

// =======================================
// START INTERVIEW
// =======================================
export const startInterview = async (req, res) => {
  try {

    // ✅ SAFE DESTRUCTURING (prevents crash)
    const { jobRole, jobDesc } = req.body || {};

    // ✅ FIXED CONDITION
    if (!jobRole || !jobDesc) {
      return res.status(400).json({
        success: false,
        message: "Job role or description required",
      });
    }

    const question = await generateInterviewQuestion(
      jobRole,
      jobDesc
    );

    return res.status(200).json({
      success: true,
      question,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to start interview",
    });
  }
};

// =======================================
// EVALUATE ANSWER
// =======================================
export const evaluateAnswer = async (req, res) => {
  try {

    const { question, answer } = req.body || {};

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: "Question and answer required",
      });
    }

    const result = await evaluateInterviewAnswer(
      question,
      answer
    );

    return res.status(200).json({
      success: true,
      ...result,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to evaluate answer",
    });
  }
};