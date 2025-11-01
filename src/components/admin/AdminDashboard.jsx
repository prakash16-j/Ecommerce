import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { useAuth } from "../../context/AuthContext";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [ordersByDay, setOrdersByDay] = useState([]);
  const [loading, setLoading] = useState(true);

  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          fetch("http://localhost:3001/products"),
          fetch("http://localhost:3001/orders"),
        ]);

        const products = await productsRes.json();
        const orders = await ordersRes.json();

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
        });

        const sortedOrders = orders
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);
        setRecentOrders(sortedOrders);

        // Pie Chart Data
        const categoryCount = {};
        orders.forEach((order) => {
          const product = products.find((p) => p.id == order.productId);
          const category = product?.category || "Other";
          categoryCount[category] = (categoryCount[category] || 0) + 1;
        });
        setCategoryData(
          Object.entries(categoryCount).map(([name, value]) => ({
            name,
            value,
          }))
        );

        // Line Chart Data
        const dailyCount = {};
        orders.forEach((order) => {
          const date = new Date(order.date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
          });
          dailyCount[date] = (dailyCount[date] || 0) + 1;
        });

        setOrdersByDay(
          Object.entries(dailyCount).map(([date, count]) => ({ date, count }))
        );
      } catch (err) {
        console.error("Failed to fetch admin data:", err);
      } finally {
        // ✅ Delay shimmer disappearance for smoother UX
        setTimeout(() => setLoading(false), 1000);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ✅ Shimmer Loader Component (Blue Gradient)
  const Shimmer = () => (
    <div className="animate-pulse space-y-6 p-6">
      <style>
        {`
          .gradient-shimmer {
            background: linear-gradient(90deg, #0ea5e9 25%, #3b82f6 50%, #0ea5e9 75%);
            background-size: 200% 100%;
            animation: shimmerMove 1.5s infinite linear;
          }
          @keyframes shimmerMove {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}
      </style>

      {/* Header shimmer */}
      <div className="flex justify-between">
        <div className="h-8 gradient-shimmer rounded w-1/3"></div>
        <div className="h-8 gradient-shimmer rounded w-24"></div>
      </div>

      {/* Stats shimmer */}
      <div className="grid grid-cols-2 gap-6">
        <div className="h-24 gradient-shimmer rounded"></div>
        <div className="h-24 gradient-shimmer rounded"></div>
      </div>

      {/* Charts shimmer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 gradient-shimmer rounded"></div>
        <div className="h-64 gradient-shimmer rounded"></div>
      </div>

      {/* Table shimmer */}
      <div className="h-64 gradient-shimmer rounded"></div>
    </div>
  );

  if (loading) return <Shimmer />;

  return (
    <div className="p-4 sm:p-6 space-y-10 relative">
      {/* Header with Logout */}
      <div className="flex justify-between items-center flex-wrap mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
          Admin Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
        >
          🚪 Logout
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-blue-100 p-4 sm:p-6 rounded-lg shadow-md text-center sm:text-left">
          <h2 className="text-lg sm:text-xl font-semibold text-blue-700">
            Total Products
          </h2>
          <p className="text-3xl sm:text-4xl font-bold mt-1 sm:mt-2">
            {stats.totalProducts}
          </p>
        </div>
        <div className="bg-green-100 p-4 sm:p-6 rounded-lg shadow-md text-center sm:text-left">
          <h2 className="text-lg sm:text-xl font-semibold text-green-700">
            Total Orders
          </h2>
          <p className="text-3xl sm:text-4xl font-bold mt-1 sm:mt-2">
            {stats.totalOrders}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
            📈 Orders per Day
          </h2>
          {ordersByDay.length > 0 ? (
            <div className="w-full h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ordersByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#0088FE"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-gray-500">No order data yet.</p>
          )}
        </div>

        {/* Pie Chart */}
        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
            🥧 Most Ordered Categories
          </h2>
          {categoryData.length > 0 ? (
            <div className="w-full h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius="80%"
                    label
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-gray-500">No category data yet.</p>
          )}
        </div>
      </div>

      {/* Manage Links */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-6 sm:mt-8">
        <Link
          to="/admin/manage-products"
          className="bg-blue-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-md text-center hover:bg-blue-700 transition"
        >
          🛍️ Manage Products
        </Link>
        <Link
          to="/admin/manage-orders"
          className="bg-green-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-md text-center hover:bg-green-700 transition"
        >
          📦 Manage Orders
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 overflow-x-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-0">
            Recent Orders
          </h2>
          <Link
            to="/admin/manage-orders"
            className="text-blue-600 hover:underline text-sm"
          >
            View All
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-gray-500">No recent orders.</p>
        ) : (
          <table className="min-w-full border border-gray-200 text-sm sm:text-base">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Order ID</th>
                <th className="p-2 border">Product</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition duration-200"
                >
                  <td className="p-2 border whitespace-nowrap text-xs sm:text-sm">
                    #{order.id}
                  </td>
                  <td className="p-2 border">{order.title}</td>
                  <td className="p-2 border">₹{order.price}</td>
                  <td className="p-2 border">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
