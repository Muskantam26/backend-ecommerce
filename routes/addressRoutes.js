import express from "express";
import {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/addressController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
  .post(protect, addAddress)
  .get(protect, getAddresses);

router.route("/:id")
  .put(protect, updateAddress)
  .delete(protect, deleteAddress);

router.route("/default/:id")
  .patch(protect, setDefaultAddress);

export default router;
