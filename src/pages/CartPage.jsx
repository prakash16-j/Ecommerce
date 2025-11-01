import React from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CartPage = () => {
  const { cartItems, removeFromCart, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div className="p-6 text-center">Loading cart...</div>;
  }

  const validCartItems = cartItems.filter((item) => item.product);
  const totalPrice = validCartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  if (validCartItems.length === 0) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <Link to="/user" className="text-blue-600 hover:underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  // 🟢 Handle Checkout
  const handleCheckout = async () => {
    if (!user) {
      alert("Please log in to place an order.");
      navigate("/login");
      return;
    }

    try {
      // Create orders for each product
      for (const item of validCartItems) {
        const order = {
          userId: user.id,
          productId: item.product.id,
          title: item.product.title,
          price: item.product.price * item.quantity,
          quantity: item.quantity,
          status: "Pending",
          date: new Date().toISOString(),
        };

        await fetch("http://localhost:3001/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(order),
        });

        // Remove item from cart after order
        await fetch(`http://localhost:3001/carts/${item.id}`, {
          method: "DELETE",
        });
      }

      alert("✅ Order placed successfully!");
      navigate("/user/orders");
    } catch (err) {
      console.error("Failed to complete checkout:", err);
      alert("Something went wrong during checkout. Try again.");
    }
  };

  return (
    <div className="p-6 pt-24">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {validCartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b pb-4"
          >
            <div className="flex items-center space-x-4">
              <img
                src={item.product.image}
                alt={item.product.title}
                className="w-20 h-20 object-contain rounded"
              />
              <div>
                <h2 className="text-lg font-semibold">{item.product.title}</h2>
                <p className="text-gray-600">
                  ₹{item.product.price.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-semibold">Qty: {item.quantity}</span>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="text-right">
        <h2 className="text-2xl font-bold">Total: ₹{totalPrice.toFixed(2)}</h2>
        <button
          onClick={handleCheckout}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
