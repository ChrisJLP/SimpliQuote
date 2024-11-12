import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

const CustomDropdown = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option); // Pass the selected value directly
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm">Category</label>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-4 text-base text-left border border-gray-300 rounded-md bg-[#F8F9FA] flex justify-between items-center"
        >
          <span>{value}</span>
          <svg
            className={`w-5 h-5 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {isOpen && (
          <div
            className="fixed z-50 w-auto min-w-[200px] mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
            style={{
              top:
                dropdownRef.current.getBoundingClientRect().bottom +
                window.scrollY +
                4,
              left: dropdownRef.current.getBoundingClientRect().left,
              right:
                window.innerWidth -
                dropdownRef.current.getBoundingClientRect().right,
            }}
          >
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                className={`w-full p-4 text-base text-left hover:bg-gray-100 ${
                  value === option ? "bg-gray-50" : ""
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

CustomDropdown.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CustomDropdown;
