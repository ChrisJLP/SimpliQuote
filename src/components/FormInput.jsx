import React from "react";
import PropTypes from "prop-types";

const FormInput = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
  min,
  step,
  prefix,
  className = "",
}) => {
  const handleChange = (e) => {
    e.persist?.();
    onChange({
      ...e,
      target: {
        ...e.target,
        name,
        value: e.target.value,
      },
    });
  };

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm">
        {label} {required && "*"}
      </label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-3">{prefix}</span>}
        <input
          id={name}
          type={type}
          name={name}
          value={value || ""}
          onChange={handleChange}
          required={required}
          placeholder={placeholder}
          min={min}
          step={step}
          className={`w-full p-3 border border-gray-300 rounded-md bg-[#F8F9FA] ${
            prefix ? "pl-6" : ""
          } ${className}`}
        />
      </div>
    </div>
  );
};

FormInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  prefix: PropTypes.string,
  className: PropTypes.string,
};

export default FormInput;
