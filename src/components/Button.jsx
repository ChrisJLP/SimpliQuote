// src/components/Button.jsx
const Button = ({
  children,
  variant = "primary", // primary, secondary, outline, subtle
  onClick,
  type = "button",
  className = "",
}) => {
  const baseStyles =
    "px-6 py-2 rounded transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantStyles = {
    primary: "bg-[#4CAF50] text-white hover:bg-[#45A049] focus:ring-[#4CAF50]",
    secondary:
      "bg-slate-600 text-white hover:bg-slate-700 focus:ring-slate-600",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
    subtle:
      "bg-transparent border border-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-200", // New subtle variant
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
