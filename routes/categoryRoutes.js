import { Router } from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from "../controllers/categoryController.js";

const router = Router();

// Admin-only routes
router.post("/admin/category/create",  createCategory);
router.put("/admin/category/update/:id", updateCategory);
router.delete("/admin/category/delete/:id",  deleteCategory);

// Public / user routes
router.get("/admin/category/get/:id",  getCategoryById);
router.get("/admin/category/get-all",  getCategories);

// Standard REST routes for frontend
router.get("/", getCategories);
router.get("/:id", getCategoryById);

export default router;