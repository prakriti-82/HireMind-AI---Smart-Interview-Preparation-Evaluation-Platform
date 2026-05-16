import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      default: "AI Mock Interview",
    },

    question: {
      type: String,
      default: "",
    },

    answer: {
      type: String,
      default: "",
    },

    feedback: {
      type: String,
      default: "",
    },

    score: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Interview",
  interviewSchema
);