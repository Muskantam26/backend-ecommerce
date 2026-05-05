import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from "../controllers/AddToCartController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, addToCart);
router.get("/", protect, getCart);
router.put("/update", protect, updateCartItem);
router.delete("/remove", protect, removeCartItem);
router.delete("/clear", protect, clearCart);

export default router;