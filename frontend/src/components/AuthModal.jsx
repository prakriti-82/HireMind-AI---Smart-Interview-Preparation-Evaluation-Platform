import React, {
  useState,
  useEffect,
  useRef,
} from "react";

import { useNavigate } from "react-router-dom";

import { GoogleLogin } from "@react-oauth/google";

import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineClose,
} from "react-icons/ai";

import axios from "../utils/axiosInstance";

const AuthModal = ({ isOpen, onClose }) => {

  const navigate = useNavigate();

  const modalRef = useRef();

  const [isLogin, setIsLogin] =
    useState(true);

  const [showPassword, setShowPassword] =
    useState(false);

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // =====================================
  // RESET FORM
  // =====================================
  const resetForm = () => {
    setEmail("");
    setPassword("");
    setError("");
    setShowPassword(false);
  };

  // =====================================
  // CLOSE MODAL
  // =====================================
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // =====================================
  // ESC KEY CLOSE — fixed dependency
  // =====================================
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  // =====================================
  // DISABLE BODY SCROLL
  // =====================================
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // =====================================
  // OUTSIDE CLICK CLOSE
  // =====================================
  const handleOutsideClick = (e) => {
    if (
      modalRef.current &&
      !modalRef.current.contains(e.target)
    ) {
      handleClose();
    }
  };

  // =====================================
  // FORM SUBMIT — save refreshToken + validation
  // =====================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isLogin && password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const url = isLogin ? "/auth/login" : "/auth/register";
      const res = await axios.post(url, { email, password });

      localStorage.setItem("accessToken",  res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken); // ✅ added
      localStorage.setItem("user",         JSON.stringify(res.data.user));

      handleClose();
      navigate("/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // GOOGLE LOGIN — save refreshToken
  // =====================================
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);

      const res = await axios.post("/auth/google", {
        credential: credentialResponse.credential,
      });

      localStorage.setItem("accessToken",  res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken); // ✅ added
      localStorage.setItem("user",         JSON.stringify(res.data.user));

      handleClose();
      navigate("/dashboard");

    } catch (error) {
      setError("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (

    <div
      onClick={handleOutsideClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
    >

      <div
        ref={modalRef}
        className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-white/30 bg-white/80 backdrop-blur-2xl shadow-[0_10px_60px_rgba(59,130,246,0.25)]"
      >

        {/* TOP BLUR */}
        <div className="absolute -top-20 -right-20 w-52 h-52 bg-blue-400/20 blur-[90px] rounded-full"></div>

        {/* CLOSE BUTTON */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 z-20 text-gray-500 hover:text-black transition-all"
        >
          <AiOutlineClose size={24} />
        </button>

        <div className="relative z-10 p-8">

          {/* HEADER */}
          <div className="text-center mb-6">

            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-4">
              🚀 HireMind AI
            </div>

            <h2 className="text-3xl font-black text-[#0f172a]">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>

            <p className="text-[#64748b] mt-2">
              {isLogin
                ? "Login to continue your AI interview journey"
                : "Start practicing AI interviews today"}
            </p>

          </div>

          {/* GOOGLE LOGIN */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google Login Failed")}
            />
          </div>

          {/* DIVIDER */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-[1px] bg-gray-200"></div>
            <span className="text-sm text-gray-400">OR</span>
            <div className="flex-1 h-[1px] bg-gray-200"></div>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* EMAIL */}
            <div>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white/70 px-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white/70 px-5 py-4 pr-14 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
              >
                {/* ✅ Fixed — shows eye when hidden, eye-invisible when visible */}
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-red-500 text-sm font-medium">{error}</p>
            )}

            {/* SUBMIT */}
            <button
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 text-white font-bold shadow-[0_10px_30px_rgba(59,130,246,0.30)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-70"
            >
              {loading
                ? "Please wait..."
                : isLogin
                ? "Login"
                : "Create Account"}
            </button>

          </form>

          {/* TOGGLE */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-blue-600 font-semibold hover:underline"
            >
              {isLogin
                ? "Create a new account"
                : "Already have an account?"}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AuthModal;
