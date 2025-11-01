import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  useCallback,
  useEffect,
} from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (err) {
      console.error("Failed to parse stored user:", err);
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // 🟢 LOGIN
  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/users?email=${email}`
      );
      if (!response.ok) throw new Error("Server error");
      const data = await response.json();
      if (data.length === 0) throw new Error("Invalid email or password");

      const foundUser = data[0];
      if (foundUser.password !== password)
        throw new Error("Invalid email or password");

      const token = `fake-jwt-token-for-user-${foundUser.id}`;
      const userWithToken = { ...foundUser, token };

      setUser(userWithToken);
      alert("Login successful!");
    if (foundUser.role === "admin") {
      window.location.href = "/admin"; // if you have admin routes
    } else {
      window.location.href = "/user"; // your user dashboard page
    }// ✅ simple redirect works safely
      return userWithToken;
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 🟢 REGISTER
  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    try {
      const checkRes = await fetch(
        `http://localhost:3001/users?email=${email}`
      );
      const existing = await checkRes.json();
      if (existing.length > 0) {
        throw new Error("Email is already registered");
      }

      const newUser = { name, email, password, role: "user" };
      const createRes = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!createRes.ok) throw new Error("Registration failed on server");

      await createRes.json();
      alert("Registration successful! Please log in.");
      window.location.href = "/login"; // ✅ navigate safely
    } catch (err) {
      console.error("Registration failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 🟢 LOGOUT
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
    window.location.href = "/login";
  }, []);

  const value = useMemo(
    () => ({
      user,
      token: user?.token || null,
      isAuthenticated: !!user,
      loading,
      login,
      register,
      logout,
    }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
