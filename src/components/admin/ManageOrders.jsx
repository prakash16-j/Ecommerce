import React, { useEffect, useState } from "react";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  // 🔹 Replace with your Render backend URL
  const BASE_URL = "https://ecommercebackend-7avx.onrender.com";

  // ✅ Fetch all orders
  useEffect(() => {
    fetch(`${BASE_URL}/orders`)
      .then((res) => res.json())
      .then(setOrders)
      .catch(console.error);
  }, []);

  // ✅ Pagination Logic
  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  // ✅ Page navigation handlers
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // ✅ Update order status
  const updateStatus = (id, newStatus) => {
    fetch(`${BASE_URL}/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
      .then(() =>
        setOrders((prev) =>
          prev.map((ord) =>
            ord.id === id ? { ...ord, status: newStatus } : ord
          )
        )
      )
      .catch(console.error);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-md shadow-md text-sm sm:text-base">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 border">Order ID</th>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              currentOrders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="p-2 border">#{o.id}</td>
                  <td className="p-2 border">{o.userName || "Guest"}</td>
                  <td className="p-2 border">₹{o.total || o.price}</td>
                  <td className="p-2 border">
                    {new Date(o.date).toLocaleDateString()}
                  </td>
                  <td className="p-2 border text-center">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="border p-1 rounded"
                    >
                      <option>Pending</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination Controls */}
      <div className="flex justify-center items-center mt-6 gap-4 flex-wrap">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md text-white ${
            currentPage === 1
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Previous
        </button>

        <span className="text-gray-700 font-medium">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-md text-white ${
            currentPage === totalPages
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ManageOrders;
