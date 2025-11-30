import mongoose from "mongoose";

// Define the product schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    stockquantity: {
      type: String,
      required: true,
    },
  },
  // ✅ Adds createdAt & updatedAt fields
  { timestamps: true }
);

// Create a model from the schema
const ProductModel = mongoose.model("products", productSchema);

export default ProductModel;