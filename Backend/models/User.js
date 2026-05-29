import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
      trim: true,
      maxlength: 100,
    },

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
      default: null,
    },

    picture: {
      type: String,
      default: "",
      match: [/^(https?:\/\/.+)?$/, "Picture must be a valid URL"],
    },

    role: {
      type: String,
      default: "",
      trim: true,
      maxlength: 100,
    },

    experience: {
      type: String,
      default: "",
      trim: true,
      maxlength: 100,
    },

    refreshTokenHash: {
      type: String,
      default: null,
    },

    stats: {
      interviews: {
        type: Number,
        default: 0,
        min: 0,
      },

      questions: {
        type: Number,
        default: 0,
        min: 0,
      },

      accuracy: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Auto-strip sensitive fields
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.refreshTokenHash;
    return ret;
  },
});

export default mongoose.model(
  "User",
  userSchema
);
