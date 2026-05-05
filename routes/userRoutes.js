import express from "express";
import { loginUser, registerUser, sendOtp, adminLogin } from "../controllers/authControllers.js";
import { protect, adminMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// OTP + user register
router.post("/send-otp", sendOtp);
router.post("/register", registerUser);

// user login
router.post("/login", loginUser);

// admin login
router.post("/admin/login", adminLogin);

// user profile
router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

// admin protected route
router.get("/admin", protect, adminMiddleware, (req,res)=>{
  res.json({
    message:"Welcome Admin",
    user:req.user
  })
});

export default router;