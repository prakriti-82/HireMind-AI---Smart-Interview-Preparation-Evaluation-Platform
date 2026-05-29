import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      default: "",
      maxlength: 3000,
    },

    answer: {
      type: String,
      default: "",
      maxlength: 5000,
    },

    feedback: {
      type: String,
      default: "",
      maxlength: 5000,
    },

    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },

    responseTime: {
      type: Number,
      default: 0,
    },

    round: {
      type: String,
      default: "technical",
    },

    aiMood: {
      type: String,
      default: "friendly",
    },
  },
  { _id: false }
);

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
      trim: true,
      maxlength: 100,
    },

    type: {
      type: String,
      default: "AI Mock Interview",
    },

    // ===================================
    // FAANG SIMULATOR SETTINGS
    // ===================================
    mode: {
      type: String,
      enum: [
        "standard",
        "faang",
        "google",
        "amazon",
        "meta",
      ],
      default: "standard",
    },

    personality: {
      type: String,
      enum: [
        "friendly",
        "strict",
        "google-style",
        "challenging",
      ],
      default: "friendly",
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },

    round: {
      type: String,
      enum: [
        "introduction",
        "technical",
        "behavioral",
        "system-design",
        "final",
      ],
      default: "technical",
    },

    timedMode: {
      type: Boolean,
      default: false,
    },

    durationMinutes: {
      type: Number,
      default: 20,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    endedAt: {
      type: Date,
    },

    messages: {
      type: [messageSchema],

      validate: {
        validator: (val) => val.length <= 20,

        message:
          "Interview cannot exceed 20 questions",
      },
    },
  },
  {
    timestamps: true,
  }
);

// ===================================
// INDEXES
// ===================================
interviewSchema.index({
  user: 1,
  createdAt: -1,
});

interviewSchema.index({
  user: 1,
  mode: 1,
});

interviewSchema.index({
  user: 1,
  completed: 1,
});

// ===================================
// VIRTUAL SCORE
// ===================================
interviewSchema.virtual(
  "averageScore"
).get(function () {

  if (!this.messages.length) {
    return 0;
  }

  const total =
    this.messages.reduce(
      (sum, m) =>
        sum + (m.score || 0),
      0
    );

  return +(
    total / this.messages.length
  ).toFixed(2);
});

// ===================================
// TOTAL QUESTIONS
// ===================================
interviewSchema.virtual(
  "totalQuestions"
).get(function () {

  return this.messages.length;
});

// ===================================
// TOTAL DURATION
// ===================================
interviewSchema.virtual(
  "totalDuration"
).get(function () {

  if (!this.endedAt) return 0;

  return Math.floor(
    (this.endedAt - this.startedAt) /
      1000
  );
});

interviewSchema.set("toJSON", {
  virtuals: true,
});

interviewSchema.set("toObject", {
  virtuals: true,
});

export default mongoose.model(
  "Interview",
  interviewSchema
);