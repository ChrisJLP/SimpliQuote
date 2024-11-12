// components/FloatingActionButton.jsx
import React from "react";
import PropTypes from "prop-types";
import { Settings } from "lucide-react";

const FloatingActionButton = ({ onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 w-12 h-12 rounded-full bg-slate-600 
        text-white shadow-lg flex items-center justify-center 
        hover:bg-slate-700 transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2
        lg:hidden ${className}`}
      aria-label="Edit user details"
    >
      <Settings className="w-6 h-6" />
    </button>
  );
};

FloatingActionButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default FloatingActionButton;
