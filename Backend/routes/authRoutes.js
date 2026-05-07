import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { googleLogin, updateProfile } from "../controllers/authController.js";

const router = express.Router();

// ==============================
// 🔑 Generate Tokens
// ==============================
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

// ==============================
// REGISTER
// ==============================
router.post("/register", async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ email, password: hashedPassword });

    const tokens = generateTokens(user);

    res.json({
      success: true,
      ...tokens,
      user,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==============================
// LOGIN
// ==============================
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const tokens = generateTokens(user);

    res.json({
      success: true,
      ...tokens,
      user,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==============================
// 🔥 GOOGLE LOGIN (IMPORTANT)
// ==============================
router.post("/google", googleLogin);

// ==============================
// 🔥 UPDATE PROFILE (THIS FIXES YOUR ERROR)
// ==============================
router.put("/update-profile", authMiddleware, updateProfile);

// ==============================
// REFRESH TOKEN
// ==============================
router.post("/refresh", (req, res) => {
  try {
    const { refreshToken } = req.body;

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });

  } catch (err) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
});

export default router;