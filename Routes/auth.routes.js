import express from "express";
import { register, login } from "../Controller/Auth.controller.js";

// Create a new instance of an Express router
const router = express.Router();

// Defining the routes
router.post("/register", register);
router.post("/login", login);

export default router;