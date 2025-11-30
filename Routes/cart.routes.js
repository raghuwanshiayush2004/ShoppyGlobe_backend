// routes.js
import express from "express";
import {
  createCart,
  deleteCart,
  updateQuantityCart,
} from "../Controller/Product.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";

// Create a new instance of an Express router
const router = express.Router();

// Protected Cart Routes
router.post("/product/cart", authenticate, createCart);
router.put("/product/cart/:id", authenticate, updateQuantityCart);
router.delete("/product/cart/:id", authenticate, deleteCart);

export default router;