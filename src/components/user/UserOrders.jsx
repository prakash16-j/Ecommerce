import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // ✅ correct import

const UserOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3001/orders?userId=${user.id}&_sort=date&_order=desc`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  if (loading) {
    return <div className="p-6 text-center">Loading your orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">You haven’t placed any orders yet.</h1>
        <Link to="/user" className="text-blue-600 hover:underline">
          Start Shopping →
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 pt-24">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border p-4 rounded-lg shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">{order.title}</h2>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  order.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {order.status}
              </span>
            </div>

            <p className="text-gray-600">Quantity: {order.quantity}</p>
            <p className="text-gray-600">Total: ₹{order.price.toFixed(2)}</p>
            <p className="text-gray-500 text-sm">
              Ordered on: {new Date(order.date).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserOrders;
