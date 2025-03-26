import React, { useState, useEffect } from "react";
import "./Checkout.css";
import PaymentPopup from "../components/PaymentPopup";
import { useCart } from "../components/CartContext";
import { QRCodeSVG } from 'qrcode.react';


const CheckOut = () => {
  const [saveAddress, setSaveAddress] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  // const [useBillingAsShipping, setUseBillingAsShipping] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(""); // Cash, Credit Card, UPI
  const [upiProvider, setUpiProvider] = useState(""); // PhonePe, GPay, Paytm
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const { cart } = useCart();
  const [subtotal, setSubtotal] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [step, setStep] = useState(1);
  const [showQR, setShowQR] = useState(false);
  const [orderId, setOrderId] = useState(null); // ✅ Store order ID

  
//   const [saveAddress, setSaveAddress] = useState(false);

const upiId = "yourupiid@upi"; // Replace with actual UPI ID
const upiLink = `upi://pay?pa=${upiId}&pn=FurniCart&am=${totalAmount}&cu=INR`;


const [formData, setFormData] = useState({
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  billingAddress: "",
  billingCity: "",
  billingState: "",
  billingCountry: "",
  billingZip: "",
  cardHolder: "",
  cardNumber: "",
  expiryDate: "",
  cvv: "",
});


  useEffect(() => {
    if (cart.length > 0) {
      const calculatedSubtotal = cart.reduce((acc, item) => {
        const itemTotal = (item.discountPrice || item.price || 0) * (item.quantity || 1);
        return acc + itemTotal;
      }, 0);

      const gstRate = 0.18; // 18% GST
      const calculatedGstAmount = calculatedSubtotal * gstRate;
      const calculatedTotalWithGST = calculatedSubtotal + calculatedGstAmount;

      setSubtotal(calculatedSubtotal.toFixed(2));
      setGstAmount(calculatedGstAmount.toFixed(2));
      setTotalAmount(calculatedTotalWithGST.toFixed(2));
    } else {
      setSubtotal("0.00");
      setGstAmount("0.00");
      setTotalAmount("0.00");
    }
  }, [cart]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleUseBillingAsShipping = (e) => {
  //   const checked = e.target.checked;
  //   setUseBillingAsShipping(checked);
  
  //   if (checked) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       shippingAddress: prev.billingAddress,
  //       shippingCity: prev.billingCity,
  //       shippingState: prev.billingState,
  //       shippingCountry: prev.billingCountry,
  //       shippingZip: prev.billingZip,
  //     }));
  //   } else {
  //     setFormData((prev) => ({
  //       ...prev,
  //       shippingAddress: "",
  //       shippingCity: "",
  //       shippingState: "",
  //       shippingCountry: "",
  //       shippingZip: "",
  //     }));
  //   }
  // };
  
  const handleSaveAddress = (e) => {
    setSaveAddress(e.target.checked);
  };
  
  const handleNext = () => {
    if (step === 1 && !isSubmitted) {
      alert("Please submit your address details before proceeding.");
      return;
    }
    setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const updateOrderTracking = async (orderId) => {
    try {
      const response = await fetch(
        `http://localhost:8500/api/orders/${orderId}/update-tracking`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Processing" }),
        }
      );

      if (response.ok) {
        console.log("✅ Order tracking updated successfully.");
      } else {
        console.error("❌ Failed to update order tracking.");
      }
    } catch (error) {
      console.error("❌ Error updating order tracking:", error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.phone ||
      !formData.email ||
      !formData.billingAddress ||
      !formData.billingCity ||
      !formData.billingState ||
      !formData.billingCountry ||
      !formData.billingZip
    ) {
      alert("Please fill in all required fields.");
      return;
    }
  
    const orderData = {
      name: formData.firstName + " " + formData.lastName,
      email: formData.email,
      phone: formData.phone,
      billingAddress: {
        address: formData.billingAddress,
        city: formData.billingCity,
        state: formData.billingState,
        country: formData.billingCountry,
        zipCode: formData.billingZip,
      },
      items: cart.map((item) => ({
        productId: item._id,
        productName: item.name,
        price: item.discountPrice,
        quantity: item.quantity,
        mainImage: item.mainImage || "https://via.placeholder.com/100",

      })),
      totalPrice: totalAmount,
    };
  
    try {
      const response = await fetch("http://localhost:8500/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
  
      const data = await response.json();
      if (response.ok) {
        setOrderId(data.order._id); // ✅ Store Order ID in state
        alert(`✅ Order Placed Successfully!\n🆔 Order ID: ${data.order._id}`);
        setIsSubmitted(true);
      } else {
        alert(data.message || "Order placement failed!");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Something went wrong. Please try again.");
    }
  };
  

  const handlePaymentChange = (e) => {
    if (!e || !e.target) return; // Ensure event object is valid
    const selectedMethod = e.target.value;
    setPaymentMethod(selectedMethod);
    
    // Show QR only if UPI is selected, otherwise hide
    setShowQR(selectedMethod === "UPI");
  };


  const handlePaymentSubmit = async () => {
    console.log("🔍 Selected Payment Method:", paymentMethod);
  
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }
  
    if (!orderId) { // ✅ Ensure orderId is available
      alert("❌ Order ID is missing. Please place an order first.");
      return;
    }
  
    const paymentDetails = {
      orderId, // ✅ Include orderId
      name: formData.firstName + " " + formData.lastName,
      email: formData.email,
      paymentMethod,
      amount: totalAmount,
      cardDetails: paymentMethod === "Credit Card" ? {
        cardHolder: formData.cardHolder,
        cardNumber: formData.cardNumber,
        expiryDate: formData.expiryDate,
        cvv: formData.cvv
      } : null,
      upiDetails: paymentMethod === "UPI" ? {
        provider: upiProvider || "QR Scan",
        upiId: formData.upiId || "test@upi"
      } : null,
    };
  
    try {
      const response = await fetch("http://localhost:8500/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentDetails),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert(`✅ Payment Successful using ${paymentMethod}!\n🆔 Order ID: ${orderId}`);
        updateOrderTracking(orderId); // ✅ Update tracking
        alert(`Payment Successful using ${paymentMethod}! Your order has been placed.`);
        setPopupOpen(true);
        setStep(3); // Move to Order Confirmation step
      } else {
        console.error("❌ Payment API Error:", data);
        alert(data.message || "Payment failed!");
      }
    } catch (error) {
      console.error("❌ Error processing payment:", error);
      alert("Something went wrong. Please try again.");
    }
  };
  

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        {/* Order Summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          <ul>
            {cart.map((item) => (
              <li key={item.id} className="order-item">
                <img
                  src={item.mainImage && item.mainImage.startsWith("http") ? item.mainImage : "https://via.placeholder.com/100"}
                  alt={item.name || "Product Image"}
                  className="cart-item-image"
                />
                <div className="order-details">
                  <p className="product-name">{item.name}</p>
                  <p>Qty: {item.quantity}</p>
                  <p>Price: ₹{item.discountPrice ? item.discountPrice.toFixed(2) : "N/A"}</p>
                </div>
              </li>
            ))}
          </ul>
          <h3>Subtotal: ₹{subtotal}</h3>
          <h3>GST (18%): ₹{gstAmount}</h3>
          <h2>Total: ₹{totalAmount}</h2>
        </div>

        {/* Checkout Steps */}
        <div className="checkout-details">
          <div className="stepper">
            <div className={`step ${step >= 1 ? "active" : ""}`}>1. Address</div>
            <div className={`step ${step >= 2 ? "active" : ""}`}>2. Payment</div>
            <div className={`step ${step === 3 ? "active" : ""}`}>3. Confirm Order</div>
          </div>

          {/* Address Step */}
          {step === 1 && (
            <div className="checkout-box">
              <h2>Billing Address</h2>
              <div className="input-group">
                <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} value={formData.firstName} required />
                <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} value={formData.lastName} required />
                </div>
                <input type="tel" name="phone" placeholder="Phone" onChange={handleChange} value={formData.phone} required />
              <input type="email" name="email" placeholder="Email" onChange={handleChange} value={formData.email} required />
              <input type="text" name="billingAddress" placeholder="Street Address" onChange={handleChange} value={formData.billingAddress} required />
              <div className="input-group">
                <input type="text" name="billingCity" placeholder="City" onChange={handleChange} value={formData.billingCity} required />
                <input type="text" name="billingState" placeholder="State" onChange={handleChange} value={formData.billingState} required />
                <input type="text" name="billingCountry" placeholder="Country" onChange={handleChange} value={formData.billingCountry} required />
                <input type="text" name="billingZip" placeholder="ZIP" onChange={handleChange} value={formData.billingZip} required />
                </div>
              <label className="checkbox-label">
                <input type="checkbox" checked={saveAddress} onChange={handleSaveAddress} />
                Save this address for future
              </label>

              {/* Shipping Address */}
             

              <div className="button-group">
                <button onClick={handleSubmit} className="submit-btn">Submit</button>
                <button onClick={handleNext} className="next-btn" disabled={!isSubmitted}>
                  Next
                </button>

              </div>
            </div>
          )}

          {/* Payment Step */}
          {step === 2 && (
            <div className="checkout-box">
              <h2>Payment Details</h2>
              <div className="payment-details">
                <div className="payment-option">
                  <input type="radio" value="Cash on Delivery" name="paymentMethod"   onChange={handlePaymentChange}  />
                  <label htmlFor="cod">Cash on Delivery</label>
                </div>

                <div className="payment-option">
                  <input type="radio" value="Credit Card" name="paymentMethod"    onChange={handlePaymentChange}  />
                  <label htmlFor="creditCard">Credit Card</label>
                </div>

                <div className="payment-option">
                  <input type="radio" value="UPI" name="paymentMethod"   onChange={handlePaymentChange}   />
                  {showQR && (
  <>
    <div className="qr-overlay" onClick={() => setShowQR(false)}></div>
    <div className="qr-popup">
      <h3>Scan QR Code to Pay</h3>
      <QRCodeSVG value={upiLink} size={200} />
      <button className="qr-close" onClick={() => setShowQR(false)}>Close</button>
    </div>
  </>
)}

                  <label htmlFor="upi">UPI</label>
                </div>
              </div>

              {/* Credit Card Form */}
              {paymentMethod === "Credit Card" && (
                <>
                  <input type="text" name="cardHolder" placeholder="Cardholder Name" onChange={handleChange} value={formData.cardHolder} required />
                  <input type="text" name="cardNumber" placeholder="Card Number" maxLength="16" onChange={handleChange} value={formData.cardNumber} required />
                  <input type="text" name="expiryDate" placeholder="Expiry Date (MM/YY)" maxLength="5" onChange={handleChange} value={formData.expiryDate} required />
                  <input type="text" name="cvv" placeholder="CVV" maxLength="3" onChange={handleChange} value={formData.cvv} required />
                </>
              )}

              <div className="button-group">
                <button onClick={handleBack} className="back-btn">Back</button>
                <button onClick={handlePaymentSubmit} className="submit-btn">Pay Now</button>
              </div>
            </div>
          )}

          {/* Order Confirmation Step */}
          {step === 3 && (
            <div className="checkout-box">
              <h2>Order Confirmation</h2>
              <p>Your order has been placed successfully! 🎉</p>
            </div>
            )}
          <PaymentPopup isOpen={isPopupOpen} onClose={() => setPopupOpen(false)} paymentMethod={paymentMethod} />
          
          {/* Popup Component */}
        </div>
      </div>
    </div>
  );
};

export default CheckOut;