import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import Button from "./Button";
import WarningModal from "./WarningModal";

const TermsModal = ({ isOpen, onClose, terms, onSave }) => {
  const [currentTerms, setCurrentTerms] = useState(terms);
  const [originalTerms, setOriginalTerms] = useState(terms);
  const [showWarningModal, setShowWarningModal] = useState(false);

  const hasChanges = currentTerms !== originalTerms;

  useEffect(() => {
    if (isOpen) {
      setCurrentTerms(terms);
      setOriginalTerms(terms);
    }
  }, [isOpen, terms]);

  const handleSave = () => {
    onSave(currentTerms);
    onClose();
  };

  const handleCancel = () => {
    if (hasChanges) {
      setShowWarningModal(true);
    } else {
      confirmCancel();
    }
  };

  const confirmCancel = () => {
    setCurrentTerms(originalTerms);
    setShowWarningModal(false);
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleCancel}>
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Terms & Conditions</h2>
          <p className="text-gray-600 mb-4">
            Enter your terms and conditions below. These will appear at the
            bottom of your quotes.
          </p>

          <textarea
            value={currentTerms}
            onChange={(e) => setCurrentTerms(e.target.value)}
            className="w-full h-64 p-3 border border-gray-300 rounded-md bg-white resize-none"
            placeholder="Enter your terms and conditions here..."
          />

          <div className="flex justify-end space-x-4 mt-6">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              className="bg-[#4CAF50] hover:bg-[#45A049]"
            >
              Save and Close
            </Button>
          </div>
        </div>
      </Modal>

      <WarningModal
        isOpen={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        onConfirm={confirmCancel}
        title="Discard Changes"
        message="You have unsaved changes. Are you sure you want to discard them?"
        confirmText="Discard Changes"
        cancelText="Keep Editing"
      />
    </>
  );
};

export default TermsModal;
