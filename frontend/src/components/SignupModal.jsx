import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

export default function SignupModal({ close, onSuccess }) {
  const { loginUser } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    setError("");
    setLoading(true);

    // Client-side validation
    if (!name.trim()) {
      setError("Name is required");
      setLoading(false);
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    console.log("🚀 Starting signup process...");

    try {
      const res = await api.post("/api/auth/signup", {
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
      });

      console.log("✅ Signup response:", res.data);

      // ✅ Your backend returns: { _id, name, email, token }
      const responseData = res.data;
      
      if (!responseData.token) {
        throw new Error("No token received from server");
      }

      // ✅ Create user object from response
      const user = {
        _id: responseData._id,
        id: responseData._id, // Add both for compatibility
        name: responseData.name,
        email: responseData.email,
      };

      const token = responseData.token;

      console.log("👤 User data:", user);
      console.log("🔑 Token received:", token ? "✅ Yes" : "❌ No");

      // ✅ Use AuthContext to login user after signup
      loginUser(user, token);

      console.log("✅ Signup completed successfully");

      // Close modal and navigate
      close();
      onSuccess?.();
      navigate("/");

    } catch (err) {
      console.error("❌ Signup error:", err);
      console.error("❌ Error details:", {
        response: err.response?.data,
        status: err.response?.status,
        message: err.message
      });
      
      if (err.response) {
        const errorMessage = err.response.data?.message || 
                            err.response.data?.error || 
                            `Signup failed (${err.response.status})`;
        setError(errorMessage);
      } else if (err.request) {
        setError("Network error. Please check your connection.");
      } else {
        setError(err.message || "Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSignup();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-200 bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-96 border border-pink-300">
        <h2 className="text-2xl font-bold mb-4 text-pink-600">Signup</h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {loading && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 p-3 rounded-lg mb-4">
            <p className="text-sm">Creating your account...</p>
          </div>
        )}

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          className="border border-pink-300 p-2 w-full mb-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:bg-gray-100"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          className="border border-pink-300 p-2 w-full mb-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:bg-gray-100"
        />

        <div className="relative w-full mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="border border-pink-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-pink-400 pr-10 disabled:bg-gray-100"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-pink-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          onClick={handleSignup}
          disabled={loading}
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg w-full mb-2 transition-colors duration-200 disabled:bg-gray-400"
        >
          {loading ? "Creating Account..." : "Signup"}
        </button>

        <p className="text-sm text-gray-600 mb-2 text-center">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            disabled={loading}
            className="text-pink-500 hover:text-pink-600 font-medium disabled:text-gray-400"
          >
            Login
          </button>
        </p>

        <button
          onClick={close}
          disabled={loading}
          className="text-gray-500 hover:text-gray-700 text-sm w-full mt-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}