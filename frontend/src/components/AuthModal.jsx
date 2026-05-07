import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "../utils/axiosInstance";

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = isLogin ? "/auth/login" : "/auth/register";

      const res = await axios.post(url, {
        email,
        password,
      });

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      onClose();
      navigate("/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Error");
    }
  };

  // ✅ FIXED GOOGLE LOGIN
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("/auth/google", {
        credential: credentialResponse.credential,
      });

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      onClose();
      navigate("/dashboard");

    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">

      <div className="w-full max-w-md bg-white rounded-2xl p-8">

        <h2 className="text-xl font-bold text-center mb-4">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => console.log("Google Login Failed")}
        />

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2"
            >
              {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button className="w-full bg-blue-500 text-white p-2 rounded">
            {isLogin ? "Login" : "Sign Up"}
          </button>

        </form>

        <p
          className="text-center mt-4 cursor-pointer text-blue-500"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Create account" : "Login instead"}
        </p>

      </div>
    </div>
  );
};

export default AuthModal;