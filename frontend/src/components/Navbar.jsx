import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

export default function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <nav className="bg-pink-50 border-b border-pink-200 p-4 flex justify-between items-center shadow-sm">
      {/* App Title */}
      <h1 className="font-bold text-2xl text-pink-600 flex items-center gap-2">
        💖 Notes App
      </h1>

      {/* Right side buttons */}
      <div className="flex gap-3">
        {user ? (
          <>
            <span className="text-pink-700 font-medium">
              Hello, {user.name}
            </span>
            <button
              onClick={logoutUser}
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setShowLogin(true)}
              className="bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Login
            </button>
            <button
              onClick={() => setShowSignup(true)}
              className="bg-pink-200 hover:bg-pink-300 text-pink-700 px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Signup
            </button>
          </>
        )}
      </div>

      {/* Modals */}
      {showLogin && <LoginModal close={() => setShowLogin(false)} />}
      {showSignup && <SignupModal close={() => setShowSignup(false)} />}
    </nav>
  );
}
