import React from "react";

function Button({
  children,
  onClick,
  type = "button",
  loading = false,
  variant = "primary",
  className = "",
  disabled = false,
}) {
  const baseStyles =
    "px-5 py-2.5 rounded-xl font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md hover:shadow-lg hover:scale-[1.03]",

    secondary:
      "bg-white/60 dark:bg-white/10 text-slate-800 dark:text-white border border-slate-200/50 dark:border-white/10",

    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}

export default Button;