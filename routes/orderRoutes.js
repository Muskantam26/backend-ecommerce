import express from 'express'
import {
  createOrder,
  getUserOrders,
  getOrderById,
} from "../controllers/orderController.js";
import { protect } from "../middlewares/authMiddleware.js";


const router = express.Router();


// Create Order
router.post("/create", protect, createOrder);

// Get all orders of a user
router.get("/myorders", protect, getUserOrders);

// Get single order details
router.get("/:id", protect, getOrderById);

export default router;
