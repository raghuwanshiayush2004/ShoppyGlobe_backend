// routes.js
import express from "express";
import {
  addProducts,
  deleteProduct,
  getProduct,
  getProductById,
  updateProduct,
} from "../Controller/Product.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";

// Create a new instance of an Express router
const router = express.Router();

// Public Product Routes
router.get("/", getProduct);
router.get("/product/:id", getProductById);

// Private Product Routes (Auth required)
router.post("/addproduct", authenticate, addProducts);
router.put("/updateproduct/:id", authenticate, updateProduct);
router.delete("/deleteproduct/:id", authenticate, deleteProduct);

export default router;