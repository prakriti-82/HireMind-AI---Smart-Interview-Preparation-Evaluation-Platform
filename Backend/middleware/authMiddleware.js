import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    // ❌ No token provided
    if (!authHeader || !authHeader.startsWith("Bearer ")) {

      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // ✅ Extract token
    const token = authHeader.split(" ")[1];

    // ❌ Empty token edge case
    if (!token) {

      return res.status(401).json({
        success: false,
        message: "Token missing.",
      });
    }

    // ❌ JWT secret missing
    if (!process.env.JWT_SECRET) {

      console.error("JWT_SECRET is missing");

      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    // ✅ Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ❌ Invalid payload
    if (!decoded?.id) {

      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    // ✅ Attach user info
    req.user = {
      id: decoded.id,
    };

    next();

  } catch (error) {

    console.error(
      "Auth Middleware Error:",
      error.message
    );

    // ❌ Token expired
    if (error.name === "TokenExpiredError") {

      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    // ❌ Invalid token
    if (error.name === "JsonWebTokenError") {

      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    // ❌ Generic fallback
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export default authMiddleware;