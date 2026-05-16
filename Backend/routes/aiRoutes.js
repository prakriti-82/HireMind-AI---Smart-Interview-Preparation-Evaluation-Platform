import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  startInterview,
  evaluateAnswer,
  getUserInterviews,
} from "../controllers/aiController.js";

const router = express.Router();

// =======================================
// START INTERVIEW
// =======================================
router.post(
  "/start-interview",
  authMiddleware,
  startInterview
);

// =======================================
// EVALUATE ANSWER
// =======================================
router.post(
  "/evaluate-answer",
  authMiddleware,
  evaluateAnswer
);

// =======================================
// GET INTERVIEWS
// =======================================
router.get(
  "/interviews",
  authMiddleware,
  getUserInterviews
);

export default router;