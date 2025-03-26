const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  billingAddress: {
    address: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
  },
  items: [
    {
      productId: String,
      productName: String,
      price: Number,
      quantity: Number, // ✅ Ensuring quantity is included
      mainImage: String, // ✅ Storing image URL for future use
    },
  ],
  totalPrice: Number,
  status: {
    type: String,
    enum: ["Placed", "Shipped", "Delivered"], // ✅ Restrict values
    default: "Placed", // ✅ Default status
  },
}, { timestamps: true }); // ✅ Adds createdAt & updatedAt timestamps

module.exports = mongoose.model("Order", OrderSchema);
