import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ REAL STATS FROM DATABASE
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("stats");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ fallback safety (for old users)
    const stats = user.stats || {
      interviews: 0,
      questions: 0,
      accuracy: 0,
    };

    res.json(stats);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;