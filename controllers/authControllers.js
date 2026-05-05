import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Otp from "../models/otpModel.js";
import { validatePassword } from "../utils/validation.js";

export const registerUser = async (req, res) => {
  const { name, email,password, otp } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  if (!otp) {
    return res.status(400).json({ message: "OTP is required" });
  }

  const validOtp = await Otp.findOne({ email, otp });

  if (!validOtp) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and include uppercase, lowercase, number and special character"
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  
  });

  res.status(201).json({
    message: "User registered successfully",
    user
  });
};
export const sendOtp = async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Generate a 6-digit OTP
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Delete any existing OTPs for this email to avoid confusion
    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp: generatedOtp,
    });

   const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "developermuskan26@gmail.com",
    pass: "snrapjddpdkgunwg", 
  },
  tls: {
    rejectUnauthorized: false
  }
});

    const mailOptions = {
      from: 'developermuskan26@gmail.com',
      to: email,
      subject: 'Verification Code for Registration',
      text: `Your verification code is: ${generatedOtp}. It is valid for 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    try {
      const fs = await import('fs');
      fs.writeFileSync('otp_error.log', error.stack || error.toString());
    } catch (e) {}
    res.status(500).json({ message: "Error sending OTP: " + error.message });
  }
};
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET || "secretkey",
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email
    }
  });
};


export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if(!user) return res.status(404).json({ message: "User not found" });
    if(user.role !== "SUPER-ADMIN") return res.status(403).json({ message: "Access denied" });

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,        
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};