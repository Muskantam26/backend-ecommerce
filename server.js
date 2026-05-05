import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoute from "./Routes/userRoutes.js";
import categoryRoute from "./Routes/categoryRoutes.js"
import productRoute from "./routes/productRoutes.js";
import cors from "cors";
import AddtoCartRoutes from "./routes/AddtoCartRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js";
import addressRoute from "./routes/addressRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import createAdmin from "./utils/createAdmin.js";

dotenv.config();

const app = express();
const allowedOrigins = [
  "http://10.219.170.182:5173",
  "http://192.168.1.8:5173",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://10.80.239.182:5174",
  "http://192.168.1.21:5173",
  "http://192.168.1.21:5174"
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); 
    if(allowedOrigins.indexOf(origin) === -1){
      return callback(new Error("Not allowed by CORS"), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB().then(() => {
  createAdmin();
});

app.use("/api/users", userRoute);
app.use("/api/categories", categoryRoute);  
app.use("/api/products", productRoute);
app.use("/api/cart",AddtoCartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/address', addressRoute);
app.use("/api/wishlist", wishlistRoutes);

// Mock package endpoint
app.get("/api/admin/package/all-packages", (req, res) => {
  res.json({ success: true, packages: [] });
});

// Local upload endpoint to bypass ImageKit
app.post("/api/auth/upload-image", (req, res) => {
  try {
    const { image, folder } = req.body;
    if (!image) return res.status(400).json({ success: false, message: "No image provided" });
    
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ success: false, message: "Invalid base64 format" });
    }
    
    const ext = matches[1].split('/')[1] || 'jpg';
    const buffer = Buffer.from(matches[2], 'base64');
    
    const uploadDir = path.join(__dirname, "uploads", folder || "general");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const fileName = `${Date.now()}-${Math.round(Math.random()*1E9)}.${ext}`;
    const filePath = path.join(uploadDir, fileName);
    
    fs.writeFileSync(filePath, buffer);
    
    const url = `http://localhost:5000/uploads/${folder || "general"}/${fileName}`;
    res.json({ success: true, url });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("API Running ");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});