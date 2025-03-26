const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    billingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    items: [
      {
        productId: { type: String, required: true },
        productName: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        mainImage: { type: String, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Placed", "Shipped", "Delivered"],
      default: "Placed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema); // Corrected variable name
