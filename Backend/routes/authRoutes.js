import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { googleLogin, updateProfile } from "../controllers/authController.js";

const router = express.Router();

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

const safeUser = (user) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  delete obj.refreshTokenHash;
  return obj;
};

// ✅ REGISTER
router.post("/register", async (req, res) => {
  try {
    const { email: rawEmail, password } = req.body;
    if (!rawEmail || !password)
      return res.status(400).json({ message: "Email and password are required." });
    if (password.length < 8)
      return res.status(400).json({ message: "Password must be at least 8 characters." });

    const email = rawEmail.toLowerCase().trim();
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser)
      return res.status(400).json({ message: "User already exists." });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ email, password: hashedPassword });
    const tokens = generateTokens(user);

    const tokenHash = crypto.createHash("sha256").update(tokens.refreshToken).digest("hex");
    await User.findByIdAndUpdate(user._id, { refreshTokenHash: tokenHash });

    res.json({ success: true, ...tokens, user: safeUser(user) });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email: rawEmail, password } = req.body;
    if (!rawEmail || !password)
      return res.status(400).json({ message: "Email and password are required." });

    const email = rawEmail.toLowerCase().trim();
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password." });

    const tokens = generateTokens(user);
    const tokenHash = crypto.createHash("sha256").update(tokens.refreshToken).digest("hex");
    await User.findByIdAndUpdate(user._id, { refreshTokenHash: tokenHash });

    res.json({ success: true, ...tokens, user: safeUser(user) });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed. Please try again." });
  }
});

// ✅ REFRESH
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: "Refresh token required." });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).lean();
    if (!user) return res.status(403).json({ message: "User not found." });

    const incoming = crypto.createHash("sha256").update(refreshToken).digest("hex");
    if (incoming !== user.refreshTokenHash)
      return res.status(403).json({ message: "Refresh token revoked." });

    const newAccessToken = jwt.sign(
      { id: decoded.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired refresh token." });
  }
});

// ✅ LOGOUT
router.post("/logout", authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { refreshTokenHash: null });
    res.json({ success: true, message: "Logged out successfully." });
  } catch (err) {
    res.status(500).json({ message: "Logout failed." });
  }
});

router.post("/google", googleLogin);
router.put("/update-profile", authMiddleware, updateProfile);

export default router;