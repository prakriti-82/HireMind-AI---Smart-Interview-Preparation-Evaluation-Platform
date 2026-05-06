import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ❌ No token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
      });
    }

    // ✅ Extract token
    const token = authHeader.split(" ")[1];

    // ❌ Missing secret (rare but critical)
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not defined");
      return res.status(500).json({
        message: "Server configuration error",
      });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach only required data
    req.user = {
      id: decoded.id,
    };

    next();

  } catch (error) {
    console.error("Auth Error:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;