import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const UserHomePage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const searchTerm = searchParams.get("q")?.toLowerCase() || "";
  const category = searchParams.get("category")?.toLowerCase() || "";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3001/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];
    if (category) {
      filtered = filtered.filter(
        (p) => p.category?.toLowerCase() === category
      );
    }
    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.title?.toLowerCase().includes(searchTerm)
      );
    }
    setFilteredProducts(filtered);
  }, [products, searchTerm, category]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 px-4 sm:px-6 lg:px-12 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-3">
          🛍️ Our Exclusive Products
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our collection of high-quality items curated just for you. Use
          the search bar or categories to find your perfect match!
        </p>
      </div>

      {/* Loading / No Results */}
      {loading ? (
        <div className="text-center text-blue-500 py-10 text-lg font-medium animate-pulse">
          Loading products...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center text-gray-500 py-10 text-lg">
          No products found.
          {searchTerm && ` You searched for "${searchTerm}".`}
          {category && ` In category "${category}".`}
        </div>
      ) : (
        /* ✅ Responsive Grid */
        <div className="flex justify-center">
          <div
            className="
              grid 
              gap-8 
              w-full
              max-w-7xl
              place-items-center   /* ✅ Centers cards in all breakpoints */
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              xl:grid-cols-5
            "
          >
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="
                  w-full
                  max-w-xs sm:max-w-sm md:max-w-md lg:w-full
                  mx-auto   /* ✅ Keeps card centered on small screens */
                "
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserHomePage;
