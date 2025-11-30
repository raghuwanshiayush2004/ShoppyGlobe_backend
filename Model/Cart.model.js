import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    productID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Reference to the Product model
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: String,
      required: true,
      min: 0,
    },
  },
  // ✅ Adds createdAt & updatedAt fields
  { timestamps: true }
);

const CartModel = mongoose.model("Cart", cartSchema);

export default CartModel;