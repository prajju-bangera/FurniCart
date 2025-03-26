import React, { useState } from "react";
import axios from "axios";
import "./tracking.css"

const ProductTracking = () => {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");

  const handleTrack = async () => {
    try {
        console.log(`Fetching order status for: ${orderId}`);
        const response = await axios.get(`http://localhost:8500/api/track/${orderId}`); // Ensure correct API path

        console.log("Response:", response.data);
        
        if (response.data && response.data.status) {
            setStatus(response.data.status);
            setError("");
        } else {
            setStatus(null);
            setError("No status found for this order.");
        }
    } catch (err) {
        console.error("Error fetching order:", err);
        setStatus(null);
        setError("Order not found. Please check the Order ID.");
    }
  };

  const getProgressWidth = () => {
    switch (status) {
      case "Placed":
        return "33%";
      case "Shipped":
        return "66%";
      case "Delivered":
        return "100%";
      default:
        return "0%";
    }
  };

  return (
    <div className="tracking-container">
      <h2>Track Your Order</h2>
      <input
        type="text"
        placeholder="Enter Order ID"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
      />
      <button onClick={handleTrack}>Track</button>

      {status && <h3>Status: {status}</h3>}
      {error && <h3 style={{ color: "red" }}>{error}</h3>}

      {/* Progress Bar */}
      <div className="tracking-bar-container">
        <div className="tracking-bar">
          <div
            className="progress"
            style={{ width: getProgressWidth() }}
          ></div>
        </div>
        <div className="tracking-status">
          <span className={status === "Placed" ? "active" : ""}>Placed</span>
          <span className={status === "Shipped" ? "active" : ""}>Shipped</span>
          <span className={status === "Delivered" ? "active" : ""}>Delivered</span>
        </div>
      </div>

      {/* Truck Image */}
      <div className="truck-container">
        <img
          src="https://cdn-icons-png.flaticon.com/128/713/713311.png"
          alt="Truck"
          className="truck"
        />
      </div>
    </div>
  );
};

export default ProductTracking;
