import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  console.log("Auth Middleware Invoked");
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Invalid authorization format",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decoded;
    next();
  } catch (error) {
    console.log("JWT Error:", error.message);

    return res.status(403).json({
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};
