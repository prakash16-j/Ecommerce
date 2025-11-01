import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState("email");
  const [emailStatus, setEmailStatus] = useState("idle");
  const [emailLoading, setEmailLoading] = useState(false);

  const { email, password } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const verifyEmail = useCallback((emailToVerify) => {
    setEmailLoading(true);
    setEmailStatus("checking");

    const delay = setTimeout(async () => {
      try {
        const response = await fetch(`http://localhost:3001/users?email=${emailToVerify}`);
        const data = await response.json();
        if (data.length > 0) {
          setStep("password");
          setEmailStatus("valid");
        } else {
          setStep("email");
          setEmailStatus("invalid");
        }
      } catch (err) {
        setError("Failed to connect to server.");
        setEmailStatus("idle");
      } finally {
        setEmailLoading(false);
      }
    }, 700);

    return () => clearTimeout(delay);
  }, []);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setStep("email");
      setEmailStatus("idle");
      return;
    }
    if (!emailRegex.test(email)) {
      setStep("email");
      setEmailStatus("format_error");
      return;
    }
    if (step === "email" || emailStatus === "format_error") {
      const handler = verifyEmail(email);
      return () => handler();
    }
  }, [email, verifyEmail, step, emailStatus]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (step !== "password") return;
    setError("");

    try {
      const user = await login(email, password);
      if (user.role === "admin") navigate("/admin");
      else navigate("/user");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
    setEmailStatus("idle");
    setFormData((prev) => ({ ...prev, password: "" }));
    setError("");
  };

  const EmailStatusMessage = () => {
    switch (emailStatus) {
      case "checking":
        return <p className="text-xs text-gray-300 pl-1">Checking email...</p>;
      case "valid":
        return <p className="text-xs text-blue-400 mt-1 pl-1">Email verified! Please enter password.</p>;
      case "invalid":
        return <p className="text-xs text-red-400 mt-1 pl-1">Email not registered.</p>;
      case "format_error":
        return <p className="text-xs text-yellow-400 mt-1 pl-1">Invalid email format.</p>;
      default:
        return null;
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        
backgroundImage: "url('/login.jpg')"
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* Login Card */}
      <div
        className="relative w-full max-w-md p-8 space-y-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl z-10 animate-fadeIn"
        style={{
          boxShadow: "0 0 40px rgba(59, 130, 246, 0.3)",
          transition: "transform 0.3s ease",
        }}
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Welcome Back 👋</h1>
          <p className="text-blue-200 mt-2">Login to continue your journey</p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
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
                disabled={step === "password"}
              />
            </div>
            {step === "password" && (
              <button
                type="button"
                onClick={handleBackToEmail}
                className="text-xs text-blue-400 hover:underline mt-1"
              >
                Change Email
              </button>
            )}
            <EmailStatusMessage />
          </div>

          {/* Password Field */}
          {step === "password" && (
            <>
              <div>
                <label className="text-sm font-medium text-gray-200">Password</label>
                <div className="relative mt-1">
                  <FaLock className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2 bg-gray-900/40 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
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

              {error && (
                <div className="text-red-400 text-sm text-center p-2 bg-red-900/30 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !password}
                className="w-full py-3 font-semibold text-gray-900 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-blue-500/30"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </>
          )}
        </form>

        {step === "email" && (
          <div className="text-center text-gray-400 text-sm">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="font-medium text-blue-400 hover:underline cursor-pointer"
            >
              Sign up
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
