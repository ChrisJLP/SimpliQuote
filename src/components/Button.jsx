// components/Button.jsx
const Button = ({
  children,
  variant = "primary", // primary, secondary, outline
  onClick,
  type = "button",
  className = "",
}) => {
  const baseStyles = "px-6 py-2 rounded transition-colors duration-300";
  const variantStyles = {
    primary: "bg-[#4CAF50] text-white hover:bg-[#45A049]",
    secondary: "bg-slate-600 text-white hover:bg-slate-700",
    outline: "border hover:bg-gray-100",
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
