import ProductModel from "../Model/product.model.js";
import CartModel from "../Model/Cart.model.js";
import mongoose from "mongoose";

// Controller functions for product and cart operations

// Get all products
export const getProduct = async (req, res) => {
  try {
    // Fetch all products
    const productData = await ProductModel.find();
    // Send the data as a JSON response
    res.status(200).json({ data: productData });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

// Get a product by its ID
export const getProductById = async (req, res) => {
  try {
    // Get the product ID from the request parameters
    const { id } = req.params;
    // Fetch the product by ID
    const product = await ProductModel.findById(id);
    // If no product is found
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    // Return the found product
    res.status(200).json({ data: product });
    // Handle any server errors
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

// Add a new product to the database
export const addProducts = async (req, res) => {
  try {
    const { name, stockquantity, description, price } = req.body;

    // Create a new product instance
    const newProduct = new ProductModel({
      name,
      price,
      description,
      stockquantity,
    });

    // Save the new product to the database
    const savedProduct = await newProduct.save();

    res
      .status(201)
      .json({ message: "Product added successfully", data: savedProduct });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

// Update an existing product
export const updateProduct = async (req, res) => {
  try {
    // Get the product ID from the request parameters
    const { id } = req.params;
    // Get the product detaails from the request body
    const { name, stockquantity, description, price } = req.body;

    // Find the product and update it
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      { name, stockquantity, description, price },
      { new: true, runValidators: true } // Returns updated product & applies validation
    );
    // If no product is found
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    // Return the updated product
    res
      .status(200)
      .json({ message: "Product updated successfully", data: updatedProduct });
    // Handle any server errors
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    // Get the product ID from the request parameters
    const { id } = req.params;

    // Find and delete the product by ID
    const deletedProduct = await ProductModel.findByIdAndDelete(id);
    // If no product is found
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    // Return the deleted product
    res
      .status(200)
      .json({ message: "Product deleted successfully", data: deletedProduct });
    // Handle any server errors
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

// Add a product to the cart
export const createCart = async (req, res) => {
  try {
    // Get the product detail from the request body
    const { productID, quantity, name, price, description } = req.body;

    // Validate product ID format
    if (!mongoose.Types.ObjectId.isValid(productID)) {
      return res.status(400).json({ error: "Invalid product ID format" });
    }

    // Validate product existence
    const product = await ProductModel.findById(productID);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Validate quantity
    if (!quantity || quantity <= 0 || isNaN(quantity)) {
      return res
        .status(400)
        .json({ error: "Quantity must be a positive number" });
    }

    // Check if the product already exists in the cart
    const existingCartItem = await CartModel.findOne({ productID });

    if (existingCartItem) {
      // If product exists, update its quantity
      existingCartItem.quantity += quantity;
      const updatedItem = await existingCartItem.save();
      return res
        .status(200)
        .json({ message: "Cart updated", data: updatedItem });
    }

    // If product does not exist, add new item to cart
    const cartItem = new CartModel({
      productID: product._id,
      quantity,
      name,
      price,
      description,
    });
    // Save the new cart item to the database
    const savedItem = await cartItem.save();
    res.status(201).json({ message: "Product added to cart", data: savedItem });
    // Handle any server errors
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

// Update the quantity of an item in the cart
export const updateQuantityCart = async (req, res) => {
  try {
    // Get cart ID from request parameters
    const cartId = req.params.id;
    // Get the new quantity from the request body
    const { quantity } = req.body;

    // Validate cart ID format
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      return res.status(400).json({ message: "Invalid cart item ID format" });
    }

    // Find the cart item by ID
    const cartItem = await CartModel.findById(cartId);
    // If the cart item does not exist
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    // Update the quantity
    cartItem.quantity = quantity;

    // Save the updated cart item
    const updatedCart = await cartItem.save();
    // Return the updated cart item
    res
      .status(200)
      .json({ message: "Cart updated successfully", data: updatedCart });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

// Delete an item from the cart
export const deleteCart = async (req, res) => {
  try {
    // Get cart ID from request parameters
    const cartId = req.params.id;

    // Validate cart ID format
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      return res.status(400).json({ message: "Invalid cart item ID format" });
    }

    // Find and delete the cart item
    const deletedCart = await CartModel.findByIdAndDelete(cartId);

    // If the cart item does not exist
    if (!deletedCart) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    // Return the deleted cart item
    res.status(200).json({ message: "Cart item deleted successfully" });
    // Handle any server errors
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", details: error.message });
  }
};