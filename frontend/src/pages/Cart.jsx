import "./cart.css"; 
import { useCart } from "../components/CartContext";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, updateCart, setCart } = useCart();  // Ensure setCart is available
  const navigate = useNavigate();
  
  console.log("🛒 Cart Page Loaded:", cart);

  // ✅ Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);  // Update global cart state
  }, [setCart]);

  // ✅ Redirect to login if user is not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to access the cart!");
      navigate("/login");
    }
  }, [navigate]);

  // ✅ Increase Quantity
  const increaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item._id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // ✅ Decrease Quantity (Removes item if quantity reaches 1)
  const decreaseQuantity = (id) => {
    const updatedCart = cart
      .map((item) =>
        item._id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // ✅ Remove from Cart
  const handleRemove = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // ✅ Calculate Totals
  const subTotal = cart.reduce(
    (total, item) => total + (item.discountPrice || item.price) * item.quantity,
    0
  );
  const gstRate = 18;
  const gstAmount = (subTotal * gstRate) / 100;
  const grandTotal = subTotal + gstAmount;

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h2 className="cart-title">
          Your Cart ({cart.length} {cart.length === 1 ? "item" : "items"})
        </h2>

        {cart.length === 0 ? (
          <p className="cart-empty">Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-items cart-header">
              <p className="item-header">Item</p>
              <p>Price</p>
              <p>Quantity</p>
              <p>Total</p>
            </div>

            {cart.map((item, index) => (
  <div key={`${item._id}-${index}`} className="cart-item">
    
    {/* ✅ Product Image */}
    <div className="cart-item-info">
      <img 
        src={item.mainImage && item.mainImage.startsWith("http") ? item.mainImage : "https://via.placeholder.com/100"} 
        alt={item.name || "Product Image"} 
        className="cart-item-image"
      />
      <p className="cart-item-name">{item.name}</p>
    </div>

    {/* ✅ Product Price */}
    <p className="price">₹{item.discountPrice || item.price}</p>

    {/* ✅ Quantity */}
    <div className="quantity-control">
      <button onClick={() => decreaseQuantity(item._id)} className="qty-btn">-</button>
      <p className="quantity">{item.quantity || 1}</p>
      <button onClick={() => increaseQuantity(item._id)} className="qty-btn">+</button>
    </div>

    {/* ✅ Total Price */}
    <p className="total-price">
      ₹{item.quantity ? (item.quantity * (item.discountPrice || item.price)).toFixed(2) : (1 * (item.discountPrice || item.price)).toFixed(2)}
    </p>
                <button className="delete-btn" onClick={() => handleRemove(item._id)}>
                  <FaTrash />
                </button>
              </div>
            ))}
          </>
        )}
      </div>

      {cart.length > 0 && (
        <div className="cart-summary">
          <div className="summary-details">
            <p>Subtotal:</p>
            <span>₹{subTotal.toFixed(2)}</span>
          </div>
          <div className="summary-details">
            <p>GST ({gstRate}%):</p>
            <span>₹{gstAmount.toFixed(2)}</span>
          </div>
          <div className="summary-details">
            <p>Shipping:</p>
            <span className="shipping">After delivery</span>
          </div>
          <div className="summary-total">
            <h3>Grand Total:</h3>
            <h3>₹{grandTotal.toFixed(2)}</h3>
          </div>
          <Link to="/Checkout" className="checkout-btn">
          Check out
        </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
