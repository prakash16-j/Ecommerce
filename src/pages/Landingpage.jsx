import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const Landingpage = () => {
  const slides = ["/Slider1.jpeg", "/Slider2.webp", "/Slider3.jpg"];
  const [current, setCurrent] = useState(0);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // --- Auto-slide every 4 seconds ---
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // --- Fetch products from Fake Store API ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://fakestoreapi.com/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // --- Filter products based on search ---
  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Handle Buy Now Button ---
  const handleBuyNow = () => {
    // Redirect to login
    navigate("/login");
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-[Plus Jakarta Sans]">
      {/* --- Navbar --- */}
      <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-500 to-indigo-700 shadow-lg rounded-b-3xl text-white z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4 py-3 gap-3 sm:gap-0">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl sm:text-3xl font-extrabold tracking-tight"
          >
            🛍️ Ms Tech-Hive
          </Link>

          {/* Search Bar */}
          <div className="flex items-center bg-white/20 rounded-full px-3 py-1 w-full sm:w-1/2 max-w-md">
            <FaSearch className="text-white mr-2" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-white placeholder-white/70 outline-none w-full"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 bg-white/20 rounded-full hover:bg-white/30 transition text-sm sm:text-base"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-white text-blue-700 rounded-full font-semibold hover:bg-gray-100 transition text-sm sm:text-base"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* --- Carousel Section --- */}
      <section className="pt-28 sm:pt-32 relative w-full overflow-hidden">
        <div className="relative w-full h-[300px] sm:h-[450px] rounded-2xl shadow-lg">
          <img
            src={slides[current]}
            alt="Slide"
            className="absolute inset-0 w-full h-full object-fill transition-all duration-700 rounded-2xl"
          />
          {/* Slide Controls */}
          <button
            onClick={() =>
              setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
            }
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white/60 p-2 rounded-full text-blue-800"
          >
            ‹
          </button>
          <button
            onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white/60 p-2 rounded-full text-blue-800"
          >
            ›
          </button>
        </div>
      </section>

      {/* --- Featured Products --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">
          Featured Products
        </h2>

        {products.length === 0 ? (
          <div className="text-center text-blue-600 text-lg py-20 animate-pulse">
            Loading products...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all"
              >
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-48 object-contain p-4"
                />
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-lg text-slate-800 line-clamp-2">
                    {p.title}
                  </h3>
                  <p className="text-blue-600 font-bold mt-1">${p.price}</p>
                  <button
                    onClick={handleBuyNow}
                    className="mt-4 w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-full hover:opacity-90 transition"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- Footer --- */}
      <footer className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-6 mt-auto rounded-t-3xl">
        <div className="max-w-7xl mx-auto text-center px-4">
          <p className="text-sm sm:text-base">
            © {new Date().getFullYear()} Ms Tech Hive. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 mt-3 text-sm">
            <Link to="/about" className="hover:underline">
              About
            </Link>
            <Link to="/contact" className="hover:underline">
              Contact
            </Link>
            <Link to="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landingpage;
