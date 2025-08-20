import { createContext, useState, useEffect } from "react";
import api from "../api"; // ✅ axios instance

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Add loading state

  useEffect(() => {
    console.log("🔄 AuthContext initializing...");
    
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      console.log("💾 LocalStorage check:");
      console.log("  👤 User:", storedUser ? "Found" : "Not found");
      console.log("  🔑 Token:", storedToken ? "Found" : "Not found");

      if (storedUser && storedUser !== "undefined" && storedToken) {
        const parsedUser = JSON.parse(storedUser);
        
        console.log("✅ Restoring user session:");
        console.log("  👤 User data:", parsedUser);
        console.log("  🔑 Token:", storedToken.substring(0, 20) + "...");
        
        setUser(parsedUser);
        setToken(storedToken);

        // ✅ Set default authorization header
        api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        console.log("🔑 Authorization header set in api defaults");
      } else {
        console.log("❌ No valid user session found");
      }
    } catch (e) {
      console.error("❌ Failed to parse user from localStorage:", e);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const loginUser = (userData, jwtToken) => {
    console.log("🔐 Logging in user:");
    console.log("  👤 User data:", userData);
    console.log("  🔑 Token:", jwtToken ? "Received" : "Missing");

    if (!userData || !jwtToken) {
      console.error("❌ Invalid login data provided");
      throw new Error("Invalid user data or token");
    }

    try {
      // ✅ Save to localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", jwtToken);
      console.log("💾 User data saved to localStorage");

      // ✅ Update state
      setUser(userData);
      setToken(jwtToken);
      console.log("📱 State updated");

      // ✅ Set authorization header
      api.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;
      console.log("🔑 Authorization header set");

      console.log("✅ User login completed successfully");
    } catch (error) {
      console.error("❌ Error during login:", error);
      throw error;
    }
  };

  const logoutUser = () => {
    console.log("🚪 Logging out user...");

    try {
      // ✅ Clear localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      console.log("💾 LocalStorage cleared");

      // ✅ Clear state
      setUser(null);
      setToken(null);
      console.log("📱 State cleared");

      // ✅ Remove authorization header
      delete api.defaults.headers.common["Authorization"];
      console.log("🔑 Authorization header removed");

      console.log("✅ User logout completed successfully");
    } catch (error) {
      console.error("❌ Error during logout:", error);
    }
  };

  // ✅ Debug current auth state
  useEffect(() => {
    console.log("🔍 Auth state changed:");
    console.log("  👤 User:", user ? user.name || user.email : "Not logged in");
    console.log("  🔑 Token:", token ? "Present" : "Absent");
    console.log("  ⏳ Loading:", loading);
  }, [user, token, loading]);

  const contextValue = {
    user,
    token,
    loading, // ✅ Expose loading state
    loginUser,
    logoutUser,
    isAuthenticated: !!user && !!token, // ✅ Helper property
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};