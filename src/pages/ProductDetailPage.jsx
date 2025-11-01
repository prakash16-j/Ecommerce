import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // to get logged-in user
import { useCart } from "../context/CartContext";

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3001/products/${productId}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  // Handle Buy Now
  const handleBuyNow = async () => {
    if (!user) {
      alert("Please log in to place an order");
      navigate("/login");
      return;
    }

    const orderData = {
      userId: user.id,
      productId: product.id,
      title: product.title,
      price: product.price,
      status: "Pending",
      date: new Date().toISOString(),
    };

    try {
      const response = await fetch("http://localhost:3001/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        alert("Order placed successfully!");
        navigate("/user/orders"); // redirect to My Orders
      } else {
        alert("Failed to place order.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Something went wrong while placing the order.");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!product) return <p className="p-6">Product not found</p>;

  return (
    <div className="p-6 flex flex-col md:flex-row pt-24 items-center gap-6">
      <img
        src={product.image}
        alt={product.title}
        className="w-80 h-80 object-contain border rounded-md shadow-md"
      />
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">{product.title}</h2>
        <p className="text-gray-700">{product.description}</p>
        <p className="text-xl font-semibold text-blue-600">₹{product.price}</p>
        <div className="flex gap-4">
          <button
            onClick={() => addToCart(product)}
            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
          >
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
