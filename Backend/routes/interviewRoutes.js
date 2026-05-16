import express from "express";

import authMiddleware
from "../middleware/authMiddleware.js";

import Interview
from "../models/Interview.js";

const router = express.Router();

// =====================================
// GET USER INTERVIEWS
// =====================================
router.get(
  "/my-interviews",
  authMiddleware,
  async (req, res) => {

    try {

      const interviews =
        await Interview.find({
          user: req.user.id,
        })
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        interviews,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch interviews",
      });
    }
  }
);

export default router;