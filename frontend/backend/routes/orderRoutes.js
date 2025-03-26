const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const OrderModel = require("../models/Order");

router.post("/orders", async (req, res) => {
    console.log("Received Order Data:", req.body); // Debugging

    const { name, email, phone, billingAddress, items, totalPrice } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !billingAddress || !billingAddress.address) {
        return res.status(400).json({ message: "Billing address is required" });
    }

    try {
        const order = new OrderModel({
            name,
            email,
            phone,
            billingAddress,
            items,
            totalPrice
        });

        await order.save();
        res.status(201).json({ message: "Order placed successfully", order });
    } catch (error) {
        console.error("Order Save Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/track/:orderId", async (req, res) => {
    try {
        let { orderId } = req.params;
        orderId = orderId.trim(); // ✅ Remove any spaces

        console.log("🔍 Searching for Order ID:", orderId);

        // ✅ Check if orderId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            console.log("❌ Invalid Order ID format");
            return res.status(400).json({ message: "Invalid Order ID" });
        }

        const order = await OrderModel.findById(orderId);
        if (!order) {
            console.log("❌ Order not found in DB");
            return res.status(404).json({ message: "Order not found" });
        }

        console.log("✅ Order found:", order);
        res.json({ orderId: order._id, status: order.status });
    } catch (error) {
        console.error("❌ Error fetching order:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// router.post("/accept-order/:orderId", async (req, res) => {
//     try {
//       const { orderId } = req.params;
//       console.log("🔄 Received request to update order:", orderId);
  
//       if (!mongoose.Types.ObjectId.isValid(orderId)) {
//         return res.status(400).json({ error: "Invalid order ID" });
//       }
  
//       const updatedOrder = await Order.findByIdAndUpdate(
//         orderId,
//         { status: "Shipped" },
//         { new: true }
//       );
  
//       if (!updatedOrder) {
//         console.log("❌ Order not found:", orderId);
//         return res.status(404).json({ error: "Order not found" });
//       }
  
//       console.log("✅ Order updated successfully:", updatedOrder);
//       res.json({ message: "Order marked as Shipped", order: updatedOrder });
  
//     } catch (error) {
//       console.error("❌ Error updating order status:", error);
//       res.status(500).json({ error: error.message || "Internal Server Error" });
//     }
//   });
  

module.exports = router;
