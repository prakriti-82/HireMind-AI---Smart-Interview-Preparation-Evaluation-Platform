import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// ==============================
// 🔑 Generate Tokens
// ==============================
const generateTokens = (user) => {
  if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT secrets missing in .env");
  }

  const accessToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "15m" } // short life
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" } // long life
  );

  return { accessToken, refreshToken };
};

// ==============================
// ✅ REGISTER
// ==============================
router.post("/register", async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    email = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    const { accessToken, refreshToken } = generateTokens(user);

    return res.status(201).json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
      },
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
});

// ==============================
// ✅ LOGIN
// ==============================
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    return res.json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
      },
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
});

// ==============================
// 🔄 REFRESH TOKEN
// ==============================
router.post("/refresh", (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    return res.json({ accessToken: newAccessToken });

  } catch (err) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
});

export default router;