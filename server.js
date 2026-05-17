import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoute from "./routes/userRoutes.js";
import categoryRoute from "./routes/categoryRoutes.js";
import productRoute from "./routes/productRoutes.js";
import cors from "cors";
import AddtoCartRoutes from "./routes/AddtoCartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import addressRoute from "./routes/addressRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import createAdmin from "./utils/createAdmin.js";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= CORS =================

app.use(
  cors({
    origin: function (origin, callback) {

      // Postman ya mobile requests
      if (!origin) {
        return callback(null, true);
      }

      // Localhost allow
      if (
        origin.startsWith("http://localhost") ||
        origin.startsWith("http://127.0.0.1")
      ) {
        return callback(null, true);
      }

      // Local network IPs allow automatically
      if (
        origin.startsWith("http://192.168.") ||
        origin.startsWith("http://10.")
      ) {
        return callback(null, true);
      }

      console.log("Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,
  })
);

// ================= BODY LIMIT =================

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ================= STATIC FILES =================

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= DATABASE =================

connectDB().then(() => {
  createAdmin();
});

// ================= ROUTES =================

app.use("/api/users", userRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", AddtoCartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/address", addressRoute);
app.use("/api/wishlist", wishlistRoutes);

// ================= MOCK PACKAGE API =================

app.get("/api/admin/package/all-packages", (req, res) => {
  res.json({
    success: true,
    packages: [],
  });
});

// ================= IMAGE UPLOAD =================

app.post("/api/auth/upload-image", (req, res) => {
  try {
    const { image, folder } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "No image provided",
      });
    }

    const matches = image.match(
      /^data:([A-Za-z-+/]+);base64,(.+)$/
    );

    if (!matches || matches.length !== 3) {
      return res.status(400).json({
        success: false,
        message: "Invalid base64 format",
      });
    }

    const ext = matches[1].split("/")[1] || "jpg";

    const buffer = Buffer.from(matches[2], "base64");

    const uploadDir = path.join(
      __dirname,
      "uploads",
      folder || "general"
    );

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}.${ext}`;

    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    // Dynamic URL
    const baseUrl =
      process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

    const url = `${baseUrl}/uploads/${
      folder || "general"
    }/${fileName}`;

    res.json({
      success: true,
      url,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ================= DEFAULT ROUTE =================

app.get("/", (req, res) => {
  res.send("API Running");
});

// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});