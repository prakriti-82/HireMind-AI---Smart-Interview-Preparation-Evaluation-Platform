import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  startInterview,
  evaluateAnswer,
  getUserInterviews,
  getInterviewById, // ✅ ADD THIS
} from "../controllers/aiController.js";

const router = express.Router();

// =======================================
// START INTERVIEW
// =======================================
router.post(
  "/start-interview",
  authMiddleware,
  upload.single("resume"),
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
// GET ALL INTERVIEWS
// =======================================
router.get(
  "/interviews",
  authMiddleware,
  getUserInterviews
);

// =======================================
// GET SINGLE INTERVIEW (IMPORTANT FIX)
// =======================================
router.get(
  "/interviews/:id",
  authMiddleware,
  getInterviewById
);

export default router;