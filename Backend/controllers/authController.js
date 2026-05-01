import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    // Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.VITE_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { email, name, picture } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        picture,
      });
    }

    // Create JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });

  } catch (error) {
    res.status(500).json({ message: "Google login failed" });
  }
};