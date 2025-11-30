
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables from.env file

dotenv.config();

// Define a secret key for JWT signing and verification
const JWT_SECRET = process.env.JWT_SECRET_KEY;

// Middleware function to authenticate users based on JWT token
export function authenticate(req, res, next) {
  // Get the token from the 'Authorization' header
  const token = req.headers.authorization?.split(" ")[1];

  // If the token is not provided in the request
  if (!token) {
    return res.status(401).json({ error: "Access Denied. No Token Provided." });
  }

  try {
    // Verify the JWT token using the secret key and decode the payload
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach the decoded user data to the 'req.user' object for access in subsequent middleware or routes
    req.user = decoded;

    // Call next() to proceed to the next middleware or route handler
    next();
    // Handle If the token verification fails
  } catch (error) {
    res.status(401).json({ error: "Invalid Token" });
  }
}
