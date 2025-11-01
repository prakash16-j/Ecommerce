import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext"; // for user info

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  const currentUserId = user ? user.id : null;

  // ✅ Fetch user's cart (only when user logs in or reloads)
  const fetchCart = async () => {
    if (!currentUserId) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:3001/carts?userId=${currentUserId}&_expand=product&_t=${Date.now()}`
      );
      const data = await res.json();
      const validItems = data.filter((item) => item.product); // filter broken refs
      setCartItems(validItems);
    } catch (err) {
      console.error("❌ Failed to fetch cart:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load cart once when user logs in / changes
  useEffect(() => {
    fetchCart();
  }, [currentUserId]);

  // ✅ Add product to cart (no blinking)
  const addToCart = async (product) => {
    if (!isAuthenticated || !currentUserId) {
      alert("Please log in to add items to your cart.");
      return;
    }

    const existingItem = cartItems.find(
      (item) => Number(item.productId) === Number(product.id)
    );

    if (existingItem) {
      // ✅ Optimistic update
      const updatedCart = cartItems.map((item) =>
        item.id === existingItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCartItems(updatedCart);

      try {
        await fetch(`http://localhost:3001/carts/${existingItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: existingItem.quantity + 1 }),
        });
      } catch (err) {
        console.error("Failed to update cart item:", err);
        // rollback
        setCartItems(cartItems);
      }
    } else {
      // ✅ Add new item optimistically
      const tempItem = {
        id: Date.now(),
        userId: Number(currentUserId),
        productId: Number(product.id),
        quantity: 1,
        product,
      };
      setCartItems((prev) => [...prev, tempItem]);

      try {
        const res = await fetch("http://localhost:3001/carts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: Number(currentUserId),
            productId: Number(product.id),
            quantity: 1,
          }),
        });

        const savedItem = await res.json();
        // replace temp item with real item
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === tempItem.id ? { ...savedItem, product } : item
          )
        );
      } catch (err) {
        console.error("Failed to add new item:", err);
        // rollback
        setCartItems((prev) => prev.filter((i) => i.id !== tempItem.id));
      }
    }
  };

  // ✅ Remove item from cart
  const removeFromCart = async (cartItemId) => {
    const prevCart = [...cartItems];
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));

    try {
      await fetch(`http://localhost:3001/carts/${cartItemId}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Failed to remove from cart:", err);
      setCartItems(prevCart); // rollback
    }
  };

  // ✅ Update quantity in cart
  const updateQuantity = async (cartItemId, newQuantity) => {
    const prevCart = [...cartItems];
    const updatedCart = cartItems.map((item) =>
      item.id === cartItemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);

    try {
      await fetch(`http://localhost:3001/carts/${cartItemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });
    } catch (err) {
      console.error("Failed to update quantity:", err);
      setCartItems(prevCart); // rollback
    }
  };

  // ✅ Derived values
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemCount,
        totalPrice,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        fetchCart, // optional, for manual reloads
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
