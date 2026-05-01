import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { API_PATHS } from "../utils/apiPaths";
import axios from "../utils/axiosInstance";

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  if (!isOpen) return null;

  // ✅ VALIDATION
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!emailRegex.test(email)) {
      return "Invalid email format";
    }

    if (!passwordRegex.test(password)) {
      return "Password must be 8+ chars with letters, numbers & symbol";
    }

    return null;
  };

  // 🔐 LOGIN / REGISTER
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const url = isLogin
        ? API_PATHS.AUTH.LOGIN
        : API_PATHS.AUTH.REGISTER;

      const res = await axios.post(url, {
        email,
        password,
      });
localStorage.setItem("accessToken", res.data.accessToken);
localStorage.setItem("refreshToken", res.data.refreshToken);
localStorage.setItem("user", JSON.stringify(res.data.user));

      onClose();
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  // ✅ Google Login (FIXED CLEAN VERSION)
  const handleGoogleSuccess = (credentialResponse) => {
  try {
    if (!credentialResponse?.credential) return;

    const decoded = jwtDecode(credentialResponse.credential);

    const user = {
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
    };

    // ⚠️ IMPORTANT: use SAME SYSTEM as backend
    localStorage.setItem("accessToken", credentialResponse.credential);
    localStorage.setItem("user", JSON.stringify(user));

    onClose();
    navigate("/dashboard");

  } catch (error) {
    console.error("Google login error:", error);
  }
};

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2">
          {isLogin ? "Welcome Back 👋" : "Create Account 🚀"}
        </h2>

        <p className="text-gray-500 text-center mb-6">
          {isLogin ? "Login to continue" : "Sign up to get started"}
        </p>

        {/* Google */}
        <div className="mb-5 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.log("Google Login Failed")}
          />
        </div>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-200"></div>
          <span className="mx-3 text-sm text-gray-400">OR</span>
          <div className="flex-grow h-px bg-gray-200"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          )}

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none pr-10"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <AiOutlineEye size={20} />
              ) : (
                <AiOutlineEyeInvisible size={20} />
              )}
            </button>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl hover:scale-[1.02] transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {/* Toggle */}
        <p className="text-sm text-center mt-5">
          {isLogin ? "Don’t have an account?" : "Already have an account?"}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 ml-1 cursor-pointer hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>

      </div>
    </div>
  );
};

export default AuthModal;