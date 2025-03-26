import { createContext, useState, useEffect, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // ✅ Load cart from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
    updateCartCount(storedCart);
  }, []);

  // ✅ Function to update cart count
  const updateCartCount = (cart) => {
    const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(totalCount);
  };

  // ✅ Add item to cart
  const addToCart = (product) => {
    const existingCart = [...cart];
    const existingItemIndex = existingCart.findIndex(item => item._id === product._id);

    if (existingItemIndex !== -1) {
      existingCart[existingItemIndex].quantity += 1;
    } else {
      existingCart.push({ ...product, quantity: 1 });
    }

    setCart(existingCart);
    localStorage.setItem("cart", JSON.stringify(existingCart));
    updateCartCount(existingCart);
  };

  // ✅ Ensure cart count updates in real-time
  useEffect(() => {
    updateCartCount(cart);
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, setCart, cartCount, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);