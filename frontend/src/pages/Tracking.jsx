import React, { useState } from "react";
import axios from "axios";

const ProductTracking = () => {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");

  const handleTrack = async () => {
    try {
        console.log(`Fetching order status for: ${orderId}`);
        const response = await axios.get(`http://localhost:8500/api/track/${orderId}`); // ✅ Ensure correct API path

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
    </div>
  );
};

export default ProductTracking;
