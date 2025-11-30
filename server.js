import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import productRoutes from "./Routes/product.routes.js";
import authRoutes from "./Routes/auth.routes.js";
import cartRoute from "./Routes/cart.routes.js";

// config dotenv
dotenv.config();

// define port number and mongodb url from.env file
const PORT = process.env.PORT;
const MONGOSE_URL = process.env.MONGODB_URL;
const JWT_SECRET= process.env.JWT_SECRET_KEY

// Connect to MongoDB
mongoose.connect(MONGOSE_URL);
const db = mongoose.connection;

// express app setup
const app = new express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Define routes for authentication
app.use("/api/auth", authRoutes);
//Define routes for product management
app.use("/api", productRoutes);
// Define routes for cart management
app.use("/api", cartRoute);

//listen on port 8000 request and response
app.listen(PORT, () => {
  console.log(`Server is runnig on port ${PORT}`);
});

// console if db connects
db.on("open", () => {
  console.log("Mongoose is Connected Successfully");
});

// error handling if db connection fails
db.on("error", () => {
  console.log("Mongosse is not Connect");
});