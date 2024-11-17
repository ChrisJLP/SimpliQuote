// WelcomeModal.jsx
import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import Button from "./Button";
import FormInput from "./FormInput";
import TermsModal from "./TermsModal";

const WelcomeModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  // Ensure initialData is an object even if null/undefined is passed
  const safeInitialData = initialData || {};

  const [formData, setFormData] = useState({
    companyName: safeInitialData.companyName || "",
    name: safeInitialData.name || "",
    phoneNumber: safeInitialData.phoneNumber || "",
    email: safeInitialData.email || "",
    terms:
      safeInitialData.terms ||
      `This quote is valid for 30 days from the date of issue.
Payment terms: 50% deposit required to commence work.
Final payment due upon project completion.`,
  });
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Add this useEffect to update formData when initialData changes
  useEffect(() => {
    setFormData({
      companyName: safeInitialData.companyName || "",
      name: safeInitialData.name || "",
      phoneNumber: safeInitialData.phoneNumber || "",
      email: safeInitialData.email || "",
      terms:
        safeInitialData.terms ||
        `This quote is valid for 30 days from the date of issue.
Payment terms: 50% deposit required to commence work.
Final payment due upon project completion.`,
    });
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTermsUpdate = (newTerms) => {
    setFormData((prev) => ({
      ...prev,
      terms: newTerms,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Welcome to SimpliQuote
          </h2>
          <p className="text-gray-600 mb-6">
            SimpliQuote helps you create professional project quotes quickly and
            easily. Please provide your details below to get started, or skip
            this step if you prefer.
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

            {/* Mobile layout (default) */}
            <div className="block lg:hidden flex flex-col items-center mt-6 space-y-2">
              <Button
                variant="outline"
                onClick={() => setShowTermsModal(true)}
                type="button"
                className="w-full text-gray-600 hover:text-gray-800"
              >
                Edit Terms & Conditions
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="w-full bg-[#4CAF50] hover:bg-[#45A049]"
              >
                Save and Continue
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                type="button"
                className="w-full"
              >
                Skip for now
              </Button>
            </div>

            {/* Desktop layout */}
            <div className="hidden lg:flex lg:justify-between lg:items-center lg:mt-6">
              <Button
                variant="outline"
                onClick={() => setShowTermsModal(true)}
                type="button"
                className="text-gray-600 hover:text-gray-800"
              >
                Edit Terms & Conditions
              </Button>

              <div className="flex space-x-4">
                <Button variant="outline" onClick={onClose} type="button">
                  Skip for now
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  className="bg-[#4CAF50] hover:bg-[#45A049]"
                >
                  Save and Continue
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Modal>

      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        terms={formData.terms}
        onSave={handleTermsUpdate}
      />
    </>
  );
};

export default WelcomeModal;
