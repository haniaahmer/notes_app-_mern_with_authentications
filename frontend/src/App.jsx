import React, { useContext } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import NotesApp from "./components/NotesApp";
import SignupModal from "./components/SignupModal";
import LoginModal from "./components/LoginModal";
// import DebugPanel from "./components/DebugPanel"; // ✅ Temporary debug panel
import { AuthContext } from "./context/AuthContext";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function App() {
  const { user, loading } = useContext(AuthContext);

  // ✅ Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          {/* Protected Route → NotesApp */}
          <Route
            path="/"
            element={user ? <NotesApp /> : <Navigate to="/login" replace />}
          />

          {/* Signup Page */}
          <Route 
            path="/signup" 
            element={
              user ? (
                <Navigate to="/" replace />
              ) : (
                <SignupModal 
                  close={() => window.history.back()} 
                  onSuccess={() => console.log("Signup successful!")}
                />
              )
            } 
          />

          {/* Login Page */}
          <Route 
            path="/login" 
            element={
              user ? (
                <Navigate to="/" replace />
              ) : (
                <LoginModal 
                  close={() => window.history.back()}
                  onSuccess={() => console.log("Login successful!")}
                />
              )
            } 
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* ✅ Temporary Debug Panel - Remove after fixing issues
        <DebugPanel /> */}
      </div>
    </Router>
  );
}

export default App;