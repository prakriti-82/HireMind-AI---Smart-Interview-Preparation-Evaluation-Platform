import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ==============================
// GOOGLE LOGIN
// ==============================
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        picture,
        role: "",
        experience: "",
      });
    } else {
      user.name = user.name || name;
      user.picture = user.picture || picture;
      await user.save();
    }

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        role: user.role,
        experience: user.experience,
        stats: user.stats,
      },
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Google login failed" });
  }
};

// ==============================
// UPDATE PROFILE
// ==============================
export const updateProfile = async (req, res) => {
  try {
    const { name, role, experience, picture } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, role, experience, picture },
      { new: true }
    );

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        role: user.role,
        experience: user.experience,
        stats: user.stats,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};