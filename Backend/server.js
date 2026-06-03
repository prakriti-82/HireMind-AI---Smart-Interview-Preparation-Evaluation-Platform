import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";

console.log("🔥 server.js loaded");

import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import userRoutes from "./routes/user.js";
import interviewRoutes from "./routes/interviewRoutes.js";

dotenv.config();

const app = express();

// =======================================
// MIDDLEWARES
// =======================================
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "5mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "5mb",
  })
);

// =======================================
// STATIC FILES
// =======================================
app.use(
  "/uploads",
  express.static(path.join("uploads"))
);

// =======================================
// API ROUTES
// =======================================
app.use("/api/auth", authRoutes);

app.use("/api/ai", aiRoutes);

app.use("/api/user", userRoutes);

app.use(
  "/api/interviews",
  interviewRoutes
);

// =======================================
// HEALTH CHECK
// =======================================
app.get("/", (req, res) => {

  res.status(200).json({
    success: true,

    message:
      "🚀 HireMind AI Backend Running",

    environment:
      process.env.NODE_ENV || "development",

    timestamp: new Date(),
  });
});

// =======================================
// 404 HANDLER
// =======================================
app.use((req, res) => {

  res.status(404).json({
    success: false,

    message: "API Route Not Found",
  });
});

// =======================================
// GLOBAL ERROR HANDLER
// =======================================
app.use(
  (err, req, res, next) => {

    console.error(
      "Global Server Error:",
      err
    );

    return res.status(500).json({
      success: false,

      message:
        "Internal Server Error",
    });
  }
);

// =======================================
// DATABASE CONNECTION
// =======================================
const PORT = process.env.PORT || 10000;

// 1. START SERVER IMMEDIATELY
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// 2. CONNECT DB SEPARATELY
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.log("❌ MongoDB Error:", err.message);
  });