import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    // ✅ FIXED: properly inside schema
    stats: {
      interviews: { type: Number, default: 0 },
      questions: { type: Number, default: 0 },
      accuracy: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);