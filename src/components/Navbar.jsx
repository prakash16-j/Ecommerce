import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaUser,
  FaChevronDown,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const categories = [
  { value: "", label: "All Categories" },
  { value: "electronics", label: "Electronics" },
  { value: "jewelery", label: "Jewelery" },
  { value: "men's clothing", label: "Men's Clothing" },
  { value: "women's clothing", label: "Women's Clothing" },
  { value: "books", label: "Books" },
  { value: "home & kitchen", label: "Home & Kitchen" },
];

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (searchTerm.trim()) params.append("q", searchTerm.trim());
    if (selectedCategory) params.append("category", selectedCategory);

    navigate(`/user?${params.toString()}`);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  return (
    <nav
      className="
        fixed top-3 left-1/2 transform -translate-x-1/2 
        w-[95%] z-50 
        bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700
        rounded-2xl shadow-lg
        px-4 py-3
        text-white
      "
    >
      {/* TOP BAR */}
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/user"
          className="text-2xl font-extrabold tracking-wide text-white drop-shadow-sm"
        >
          E-Shop
        </Link>

        {/* Menu Toggle (Mobile) */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>

        {/* Desktop View */}
        <div className="hidden md:flex items-center flex-grow justify-between ml-6">
          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center w-full max-w-3xl"
          >
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="
                p-2 rounded-l-md bg-transparent 
                text-white placeholder-white 
                focus:outline-none
              "
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value} className="text-black">
                  {cat.label}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="
                flex-grow p-2 bg-transparent 
                text-white placeholder-white 
                focus:outline-none
              "
            />

            <button
              type="submit"
              className="
                bg-white text-blue-700 font-semibold px-4 py-2 rounded-r-md 
                hover:bg-gray-200 transition
              "
            >
              Search
            </button>
          </form>

          {/* Cart + Profile */}
          <div className="flex items-center space-x-6 relative ml-6">
            {/* Cart */}
            <Link
              to="/user/cart"
              className="relative hover:text-gray-200 transition"
            >
              <FaShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-white text-blue-700 rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Profile */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center space-x-2 hover:text-gray-200 transition"
                >
                  <FaUser size={22} />
                  <span>{user?.name || "Profile"}</span>
                  <FaChevronDown size={12} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white text-gray-700 shadow-lg rounded-md border border-gray-200 z-50">
                    <Link
                      to="/user/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      View Profile
                    </Link>
                    <Link
                      to="/user/profile/edit"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Edit Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hover:text-gray-200 transition">
                <FaUser size={24} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-3 bg-white rounded-lg shadow-md p-4 space-y-4 text-gray-700">
          <form onSubmit={handleSearchSubmit} className="flex flex-col space-y-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <div className="flex">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="flex-grow p-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
              >
                Search
              </button>
            </div>
          </form>

          <Link
            to="/user/cart"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center gap-2 hover:text-blue-600"
          >
            <FaShoppingCart size={20} />
            <span>Cart ({itemCount})</span>
          </Link>

          {isAuthenticated ? (
            <div className="flex flex-col items-center space-y-2">
              <Link
                to="/user/profile"
                onClick={() => setMenuOpen(false)}
                className="hover:text-blue-600"
              >
                View Profile
              </Link>
              <Link
                to="/user/profile/edit"
                onClick={() => setMenuOpen(false)}
                className="hover:text-blue-600"
              >
                Edit Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 hover:text-blue-600"
            >
              <FaUser size={20} />
              <span>Login</span>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
