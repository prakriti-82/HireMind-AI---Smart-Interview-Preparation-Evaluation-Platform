import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET missing in environment variables");
}

const tokenCache = new Map();

// Cache cleanup every 10 minutes
setInterval(() => {
  const now = Date.now();

  for (const [key, value] of tokenCache.entries()) {
    if (now >= value.expiresAt) {
      tokenCache.delete(key);
    }
  }
}, 10 * 60 * 1000);

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing.",
      });
    }

    // =======================================
    // CHECK CACHE
    // =======================================
    const cached = tokenCache.get(token);

    if (cached && Date.now() < cached.expiresAt) {
      req.user = cached.user;
      return next();
    }

    // =======================================
    // VERIFY TOKEN
    // =======================================
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload.",
      });
    }

    const userData = {
      id: decoded.id,
      email: decoded.email || null,
      role: decoded.role || "user",
    };

    // =======================================
    // SAVE TO CACHE
    // =======================================
    tokenCache.set(token, {
      user: userData,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    req.user = userData;

    next();

  } catch (error) {

    const token =
      req.headers.authorization?.split(" ")[1];

    if (token) {
      tokenCache.delete(token);
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message:
          "Session expired. Please login again.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Authentication failed.",
    });
  }
};

export default authMiddleware;