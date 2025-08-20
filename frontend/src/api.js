import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

console.log("📡 API Base URL:", API_BASE);
console.log("🌍 Environment:", import.meta.env.MODE || "development");

const api = axios.create({ 
  baseURL: API_BASE,
  timeout: 10000, // ✅ 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// ✅ Request interceptor with enhanced debugging
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    
    console.log("🚀 Making API request:");
    console.log("  📍 URL:", `${config.baseURL}${config.url}`);
    console.log("  🎯 Method:", config.method.toUpperCase());
    console.log("  📦 Data:", config.data || "No data");
    console.log("  📋 Headers:", config.headers);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("  🔑 Token attached:", token.substring(0, 20) + "...");
    } else {
      console.log("  🔑 No token found in localStorage");
    }
    
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// ✅ Response interceptor with enhanced debugging
api.interceptors.response.use(
  (response) => {
    console.log("✅ API Response Success:");
    console.log("  📍 URL:", response.config.url);
    console.log("  📊 Status:", response.status);
    console.log("  📦 Data:", response.data);
    return response;
  },
  (error) => {
    console.log("❌ API Response Error:");
    console.log("  📍 URL:", error.config?.url || "Unknown");
    console.log("  📊 Status:", error.response?.status || "No status");
    console.log("  📦 Error Data:", error.response?.data || "No error data");
    console.log("  🌐 Network Error:", !error.response ? "Yes" : "No");
    console.log("  ⏱️ Timeout:", error.code === 'ECONNABORTED' ? "Yes" : "No");
    
    // ✅ Check for common issues
    if (!error.response) {
      console.error("🚨 Network/Connection issue - Server may be down");
    } else if (error.response.status >= 500) {
      console.error("🚨 Server error - Check backend logs");
    } else if (error.response.status === 400) {
      console.error("🚨 Bad request - Check request data format");
    } else if (error.response.status === 401) {
      console.error("🚨 Unauthorized - Check authentication");
    }
    
    return Promise.reject(error);
  }
);

// ✅ Utility function to normalize auth response structure
const normalizeAuthResponse = (responseData) => {
  console.log("🔄 Normalizing auth response:", responseData);
  
  let user, token;
  
  if (responseData.user && responseData.token) {
    // Standard structure: { user: {...}, token: "..." }
    user = responseData.user;
    token = responseData.token;
    console.log("✅ Using standard structure");
  } else if (responseData.token && (responseData.name || responseData.email || responseData._id)) {
    // Backend structure: { _id, name, email, token }
    token = responseData.token;
    user = {
      _id: responseData._id,
      id: responseData._id, // Add both _id and id for compatibility
      name: responseData.name,
      email: responseData.email,
    };
    console.log("✅ Using flattened structure");
  } else {
    console.error("❌ Unknown response structure:", responseData);
    throw new Error("Invalid response structure from server");
  }
  
  return { user, token };
};

// ✅ Auth APIs with enhanced debugging
export const signupUser = (userData) => {
  console.log("👤 Signing up user:", { ...userData, password: "***" });
  return api.post("/api/auth/signup", userData)
    .then((res) => {
      console.log("✅ Signup response received:", res.data);
      const normalized = normalizeAuthResponse(res.data);
      console.log("✅ Normalized signup data:", normalized);
      return { ...res, data: normalized };
    })
    .catch((err) => {
      console.error("❌ Signup failed:", err.response?.data || err.message);
      throw err;
    });
};

export const loginUser = (credentials) => {
  console.log("🔐 Logging in user:", { ...credentials, password: "***" });
  return api.post("/api/auth/login", credentials)
    .then((res) => {
      console.log("✅ Login response received:", res.data);
      const normalized = normalizeAuthResponse(res.data);
      console.log("✅ Normalized login data:", normalized);
      return { ...res, data: normalized };
    })
    .catch((err) => {
      console.error("❌ Login failed:", err.response?.data || err.message);
      throw err;
    });
};

// Notes APIs
export const getNotes = () => {
  console.log("📒 Fetching notes...");
  return api.get("/api/notes/get")
    .then((res) => {
      console.log("✅ Notes fetched:", res.data);
      return res;
    })
    .catch((err) => {
      console.error("❌ Error fetching notes:", err.response?.data || err.message);
      throw err;
    });
};

export const saveNote = (content) => {
  console.log("📝 Saving note:", content);
  return api.post("/api/notes/post", { content })
    .then((res) => {
      console.log("✅ Note saved:", res.data);
      return res;
    })
    .catch((err) => {
      console.error("❌ Error saving note:", err.response?.data || err.message);
      throw err;
    });
};

export const updateNote = (id, content) => {
  console.log(`✏️ Updating note ${id}:`, content);
  return api.put(`/api/notes/${id}`, { content })
    .then((res) => {
      console.log("✅ Note updated:", res.data);
      return res;
    })
    .catch((err) => {
      console.error("❌ Error updating note:", err.response?.data || err.message);
      throw err;
    });
};

export const deleteNote = (id) => {
  console.log(`🗑️ Deleting note ${id}`);
  return api.delete(`/api/notes/${id}`)
    .then((res) => {
      console.log("✅ Note deleted:", res.data);
      return res;
    })
    .catch((err) => {
      console.error("❌ Error deleting note:", err.response?.data || err.message);
      throw err;
    });
};

// Image upload
export const uploadImage = (formData) => {
  console.log("📤 Uploading image:", formData);
  return api.post("/api/upload-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then((res) => {
      console.log("✅ Image uploaded:", res.data);
      return res;
    })
    .catch((err) => {
      console.error("❌ Error uploading image:", err.response?.data || err.message);
      throw err;
    });
};

// ✅ Health check endpoint for debugging
export const healthCheck = () => {
  console.log("🏥 Performing health check...");
  return api.get("/api/health")
    .then((res) => {
      console.log("✅ Server is healthy:", res.data);
      return res;
    })
    .catch((err) => {
      console.error("❌ Health check failed:", err.response?.data || err.message);
      throw err;
    });
};

export default api;