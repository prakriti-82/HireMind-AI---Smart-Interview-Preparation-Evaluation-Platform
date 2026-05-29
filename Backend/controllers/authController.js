import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    {
  id: user._id,
  email: user.email,
  role: user.role || "user",
}
    , process.env.JWT_SECRET,
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
// GOOGLE LOGIN
// ==============================
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: "Google credential required." });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ message: "Google account has no email." });
    }
let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ name, email, picture });
    } else {
      // only update if not already set
      if (!user.name)    user.name    = name;
      if (!user.picture) user.picture = picture;
      await user.save();
    }

    // ✅ Consistent tokens with regular login
    const tokens = generateTokens(user);
    const tokenHash = crypto
      .createHash("sha256")
      .update(tokens.refreshToken)
      .digest("hex");
    await User.findByIdAndUpdate(user._id, { refreshTokenHash: tokenHash });

    res.json({ success: true, ...tokens, user });

  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Google login failed. Please try again." });
  }
};

// ==============================
// UPDATE PROFILE
// ==============================
export const updateProfile = async (req, res) => {
  try {
    const { name, role, experience, picture } = req.body;

    // ✅ Validate inputs
    if (name && name.length > 100) {
      return res.status(400).json({ message: "Name too long." });
    }
    if (picture && !/^https?:\/\/.+/.test(picture)) {
      return res.status(400).json({ message: "Picture must be a valid URL." });
    }

    // ✅ Only update provided fields
    const updates = {};
    if (name       !== undefined) updates.name       = name;
    if (role       !== undefined) updates.role       = role;
    if (experience !== undefined) updates.experience = experience;
    if (picture    !== undefined) updates.picture    = picture;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No fields provided to update." });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ success: true, user });

  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Profile update failed. Please try again." });
  }
};