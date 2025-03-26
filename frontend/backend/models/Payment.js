const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  paymentId: { type: String, unique: true }, // ✅ Unique Payment ID
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true }, // ✅ Linking Order
  name: { type: String, required: true },
  email: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  amount: { type: Number, required: true },
  cardDetails: {
    cardHolder: String,
    cardNumber: String,
    expiryDate: String,
    cvv: String,
  },
  upiDetails: {
    provider: String,
    upiId: String,
  },
  status: { type: String, default: "Completed" },
}, { timestamps: true });

module.exports = mongoose.model("Payment", PaymentSchema);
