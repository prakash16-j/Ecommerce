import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [addProduct, setAddProduct] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    description: "",
    image: "",
    rating: { rate: "", count: "" },
  });

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;
  const navigate = useNavigate();

  // 🔹 Your live backend base URL
  const BASE_URL = "https://ecommercebackend-7avx.onrender.com";

  // ✅ Fetch Products
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Handle Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "rate" || name === "count") {
      setFormData({
        ...formData,
        rating: { ...formData.rating, [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ✅ Delete Product
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await fetch(`${BASE_URL}/products/${id}`, { method: "DELETE" });
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  // ✅ Edit Product
  const handleEditClick = (product) => {
    setEditProduct(product);
    setFormData({
      title: product.title,
      category: product.category,
      price: product.price,
      description: product.description || "",
      image: product.image || "",
      rating: product.rating || { rate: "", count: "" },
    });
  };

  // ✅ Add Product
  const handleAddClick = () => {
    setAddProduct(true);
    setFormData({
      title: "",
      category: "",
      price: "",
      description: "",
      image: "",
      rating: { rate: "", count: "" },
    });
  };

  // ✅ Save Edited Product
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${BASE_URL}/products/${editProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editProduct, ...formData }),
      });
      setEditProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // ✅ Save New Product
  const handleSaveAdd = async (e) => {
    e.preventDefault();
    try {
      const newProduct = {
        id: Date.now().toString(),
        ...formData,
        price: parseFloat(formData.price),
        rating: {
          rate: parseFloat(formData.rating.rate) || 0,
          count: parseInt(formData.rating.count) || 0,
        },
      };

      await fetch(`${BASE_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      setAddProduct(false);
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // ✅ Pagination
  const totalPages = Math.ceil(products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + productsPerPage);

  const handleCancel = () => {
    setEditProduct(null);
    setAddProduct(false);
  };

  return (
    <div className="p-6">
      {/* Navigation & Add */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            ⬅️ Back
          </button>
          <button
            onClick={() => navigate(1)}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            ➡️ Forward
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleAddClick}
            className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700"
          >
            ➕ Add Product
          </button>
          <button
            onClick={() => navigate("/admin")}
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
          >
            🏠 Admin Dashboard
          </button>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>

      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full border border-gray-200 rounded-md">
          <thead className="bg-blue-50 text-left">
            <tr>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Rating</th>
              <th className="p-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              currentProducts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-2 border text-center">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-16 h-16 object-cover rounded-md mx-auto"
                    />
                  </td>
                  <td className="p-2 border">{p.title}</td>
                  <td className="p-2 border">{p.category}</td>
                  <td className="p-2 border">₹{p.price}</td>
                  <td className="p-2 border text-center">
                    ⭐ {p.rating?.rate || 0} ({p.rating?.count || 0})
                  </td>
                  <td className="p-2 border text-center space-x-3">
                    <button
                      onClick={() => handleEditClick(p)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-3">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className={`px-3 py-1 rounded-md ${
              currentPage === 1
                ? "bg-gray-200"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-md ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className={`px-3 py-1 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-200"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(editProduct || addProduct) && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editProduct ? "Edit Product" : "Add Product"}
            </h2>
            <form
              onSubmit={editProduct ? handleSaveEdit : handleSaveAdd}
              className="space-y-4"
            >
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <input
                type="text"
                name="image"
                placeholder="Image URL"
                value={formData.image}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                rows="3"
              ></textarea>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  name="rate"
                  placeholder="Rating"
                  value={formData.rating.rate}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-2"
                  step="0.1"
                />
                <input
                  type="number"
                  name="count"
                  placeholder="Review Count"
                  value={formData.rating.count}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-2"
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  {editProduct ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
v