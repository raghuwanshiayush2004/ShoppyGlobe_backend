import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import userModel from "../Model/user.model.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY;

// Register controller function
export async function register(req, res) {
  const { username, email, password } = req.body;

  try {
    // Check if the username already exists in the database
    const existingUser = await userModel.findOne({ username });
    // Return error if username is taken
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance with hashed password
    const newUser = new userModel({
      username,
      email,
      password: hashedPassword, // Store the hashed password
    });

    // Save the new user to the database
    await newUser.save();

    // Return success response with new user details
    res.status(201).json({ message: "User created successfully", newUser });
  } catch (error) {
    // Handle errors during registration
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
}

// Login controller function
export async function login(req, res) {
  const { username, password } = req.body;

  try {
    // Find the user in the database by username
    const user = await userModel.findOne({ username });
    // Return error if user is not found
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log("Found user:", user);

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password valid:", isPasswordValid);
    // Return error if password is invalid
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a JWT token for the logged-in user
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    // Return success response with the generated token
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.log("Error in login:", error);
    // Return error response in case of failure
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}