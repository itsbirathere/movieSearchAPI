import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const isLoggedIn = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(401).json({
      message: "Authorization header is missing",
    });
  }

  const token = auth.startsWith("Bearer ") ? auth.split(" ")[1] : auth;
  if (!token) {
    return res.status(401).json({
      message: "Token is missing or invalid format",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (error, result) => {
    if (error) {
      console.error("JWT verification failed:", error.message);
      return res.status(401).json({
        message: "JWT verification failed",
      });
    }

    req.user = {
      id: result.userId,
    };
    next();
  });
};