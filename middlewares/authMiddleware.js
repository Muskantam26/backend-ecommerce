import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {

      // Get token
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "secretkey"
      );

      // Attach user to request
      req.user = await User.findById(decoded.id).select("-password");

      next();

    } catch (error) {

      console.error("Auth Middleware Error:", error);

      return res.status(401).json({
        message: "Not authorized, token failed"
      });

    }
  }

  if (!token) {
    return res.status(401).json({
      message: "Not authorized, no token"
    });
  }
};



//  Admin Middleware

export const adminMiddleware = (req, res, next) => {

  if (req.user && req.user.role === "SUPER-ADMIN") {
    next();
  } else {
    return res.status(403).json({
      message: "Admin access only"
    });
  }

};