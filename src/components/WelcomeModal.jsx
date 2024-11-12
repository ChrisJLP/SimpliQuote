// components/WelcomeModal.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";
import Button from "./Button";
import FormInput from "./FormInput";

const WelcomeModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    name: "",
    phoneNumber: "",
    email: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Welcome to SimpliQuote</h2>
        <p className="text-gray-600 mb-6">
          SimpliQuote helps you create professional project quotes quickly and
          easily. Please provide your details below to get started, or skip this
          step if you prefer.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Company Name"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            placeholder="Optional"
          />

          <FormInput
            label="Your Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />

          <FormInput
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            type="tel"
            required
          />

          <FormInput
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            type="email"
            required
          />

          <div className="flex justify-end space-x-4 mt-6">
            <Button variant="outline" onClick={handleSkip} type="button">
              Skip for now
            </Button>
            <Button variant="primary" type="submit">
              Save and Continue
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

WelcomeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default WelcomeModal;
