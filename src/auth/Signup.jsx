import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { name, email, password } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(name, email, password);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        
backgroundImage: "url('/sign up.webp')"
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* Glassmorphic Card */}
      <div
        className="relative w-full max-w-md p-8 space-y-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl z-10 animate-fadeIn"
        style={{
          boxShadow: "0 0 40px rgba(59, 130, 246, 0.3)",
          transition: "transform 0.3s ease",
        }}
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Create an Account ✨</h1>
          <p className="text-blue-200 mt-2">Join MS Tech Hive today</p>
        </div>

        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="text-sm font-medium text-gray-200">Full Name</label>
            <div className="relative mt-1">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="name"
                value={name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full pl-10 pr-4 py-2 bg-gray-900/40 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="text-sm font-medium text-gray-200">Email Address</label>
            <div className="relative mt-1">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-2 bg-gray-900/40 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="text-sm font-medium text-gray-200">Password</label>
            <div className="relative mt-1">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Create a password"
                className="w-full pl-10 pr-10 py-2 bg-gray-900/40 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={4}
              />
              <span
                className="absolute right-3 top-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-400" />
                ) : (
                  <FaEye className="text-gray-400" />
                )}
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-400 text-sm text-center p-2 bg-red-900/30 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold text-gray-900 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Already have account */}
        <div className="text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-400 hover:underline cursor-pointer"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
