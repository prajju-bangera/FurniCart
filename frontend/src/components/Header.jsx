import React, { useState, useEffect } from "react";
import "./Header.css";
import { FaShoppingCart, FaTruck, FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext"; // ✅ Fix path

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", password: "", rememberMe: false });
  const [registerData, setRegisterData] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [sidebarDropdown, setSidebarDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const { cartCount } = useCart();



  // Close modal & sidebar when clicking outside
  useEffect(() => {
    const closeOnOutsideClick = (e) => {
      if (
        sidebar && !e.target.closest(".sidebar") && !e.target.closest(".menu-icon")
      ) {
        setSidebar(false);
      }
  
      if (
        showAuthModal && !e.target.closest(".auth-box") && !e.target.closest(".login-btn")
      ) {
        setShowAuthModal(false);
      }
    };
  
    document.addEventListener("click", closeOnOutsideClick);
    return () => document.removeEventListener("click", closeOnOutsideClick);
  }, [sidebar, showAuthModal]);
  

  // Form validation for registration
  const validateRegister = () => {
    let newErrors = {};
    if (!registerData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!registerData.email.includes("@")) newErrors.email = "Invalid email";
    if (registerData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (registerData.password !== registerData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handles login form submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch("http://localhost:8500/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginData),
        });

        const data = await response.json();
        console.log("Response:", response.status, data);  // Debugging log

        if (response.ok) {
            setUser(data.user); // Store logged-in user data
            alert("Login successful");
        } else {
            alert(`Login failed: ${data.message}`);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Login failed. Server not responding.");
    }
};


  // Handles registration form submission
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateRegister()) {
      return; // Stop if validation fails
    }
  
    try {
      const response = await fetch("http://localhost:8500/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Registration successful");
      } else {
        alert(`Registration failed: ${data.message}`);
      }
    } catch (error) {
      alert("Registration failed. Server not responding.");
      console.error("Error:", error);
    }
  };
  

  return (
    <>
      {/* Overlay for Sidebar & Modal */}
      {(sidebar || showAuthModal) && <div className="overlay" onClick={() => { setSidebar(false); setShowAuthModal(false); }}></div>}

      <header className="navbar">
      <div className="logo" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <img src="https://cdn-icons-png.flaticon.com/128/3512/3512754.png" alt="Cart Logo" width="40" height="40" />
      <Link to="/" style={{ textDecoration: "none", fontSize: "24px", fontWeight: "bold", color: "#333" }}>
        urniCart
      </Link>
    </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
            <ul className="nav-links">
              <li><Link to="/products/Sofa">Sofas</Link></li>
              <li><Link to="/products/BeanBags">Bean Bags</Link></li>
              <li><Link to="/products/Chair">Chairs</Link></li>
              <li><Link to="/products/Shoe">Shoe Racks</Link></li>
              <li><Link to="/products/Bedroom">Bedroom Sets</Link></li>
              <li><Link to="/products/Dining">Dining Sets</Link></li>
              <li><Link to="/products/Table">Study Tables</Link></li>
              <li><Link to="/products/Wardrobes">Wardrobes</Link></li>
              <li><Link to="/products/Book">Book Shelves</Link></li>
            </ul>
          </nav>

        {/* Icons & Login Button */}
        <div className="icons">
        <button className="login-btn">
  <Link to="/login" className="login-link">Login/Register</Link>
</button>
<div className="cartIcon">
  <a href="/cart" className="cart-icon">
    <FaShoppingCart />
    {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
  </a>
</div>


      

          <a href="/tracking" className="track-icon"><FaTruck /></a>
        </div>

        {/* Sidebar Toggle Button for Mobile */}
        <div className="menu-icon" onClick={() => setSidebar(true)}>
          <FaBars />
        </div>
      </header>

      {/* Sidebar for Mobile */}
      <div className={`sidebar ${sidebar ? "show" : ""}`}>
        <div className="close-btn" onClick={() => setSidebar(false)}>
          <FaTimes />
        </div>
        <Link to="/products/Sofa" onClick={() => setSidebar(false)}>Sofa</Link>
        <Link to="/products/BeanBags" onClick={() => setSidebar(false)}>BeanBags</Link>
        <Link to="/products/Chair" onClick={() => setSidebar(false)}>Chair</Link>
        <Link to="/products/Shoe"onClick={() => setSidebar(false)}>Shoe</Link>
        <Link to= "/products/Bedroom" onClick={() => setSidebar(false)}>Bedroom</Link>
        <Link to="/products/Dining" onClick={() => setSidebar(false)}>Dining</Link>
        <Link to= "/products/Table" onClick={() => setSidebar(false)}>Study Table </Link>
        <Link to="/products/Wardrobes"    onClick={() => setSidebar(false)}>Wardrobes </Link>
        <Link to="/products/Book"    onClick={() => setSidebar(false)}>Book Shelfs </Link>
        
      </div>
    

      {/* Login/Register Modal */}
      {showAuthModal && (
        <div className="auth-modal">
          <div className="auth-box">
            <button className="close-auth" onClick={() => setShowAuthModal(false)}>
              <FaTimes />
            </button>
            
            {/* Tabs */}
            <div className="auth-tabs">
              <button 
                className={activeTab === "login" ? "active" : ""} 
                onClick={() => setActiveTab("login")}
              >
                Login
              </button>
              <button 
                className={activeTab === "register" ? "active" : ""} 
                onClick={() => setActiveTab("register")}
              >
                Register
              </button>
            </div>

            Form Content
            {activeTab === "login" ? (
              <div className="auth-content">
                <h2>Login</h2>
                <form onSubmit={handleLoginSubmit}>
                  <input type="email" placeholder="Email" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} required />
                  <input type="password" placeholder="Password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} required />
                  <button type="submit">Login</button>
                </form>
              </div>
            ) : (
              <div className="auth-content">
                <h2>Register</h2>
                <form onSubmit={handleRegisterSubmit}>
                  <input type="text" placeholder="Full Name" value={registerData.fullName} onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })} required />
                  <input type="email" placeholder="Email" value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} required />
                  <input type="password" placeholder="Password" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} required />
                  <input 
                      type="password" 
                      placeholder="Confirm Password" 
                      value={registerData.confirmPassword} 
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })} 
                      required 
                    />
                    {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

                  <button type="submit">Register</button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
