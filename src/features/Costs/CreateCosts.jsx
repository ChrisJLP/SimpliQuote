import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "../../components/Button";
import FormInput from "../../components/FormInput";
import WarningModal from "../../components/WarningModal";
import CustomDropdown from "../../components/CustomDropdown";
import QuoteNumber from "../../components/QuoteNumber";

const COST_CATEGORIES = [
  "Materials",
  "Software",
  "Hardware",
  "Services",
  "Travel",
  "Other",
];

const CreateCostsForm = ({ onSubmit, onCancel, existingCosts = [] }) => {
  const [costs, setCosts] = useState(existingCosts);
  const [showDeleteCostModal, setShowDeleteCostModal] = useState(false);
  const [costToDelete, setCostToDelete] = useState(null);

  const [currentCost, setCurrentCost] = useState({
    name: "",
    category: COST_CATEGORIES[0],
    amount: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingCostId, setEditingCostId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (value) => {
    setCurrentCost((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const handleAddCost = () => {
    if (!currentCost.name || !currentCost.amount) return;

    // Parse amount to ensure it's a number
    const parsedAmount = parseFloat(currentCost.amount);

    if (isNaN(parsedAmount)) {
      alert("Please enter a valid number for the amount.");
      return;
    }

    const newCost = {
      ...currentCost,
      id: isEditing ? editingCostId : Date.now(),
      amount: parsedAmount,
    };

    if (isEditing) {
      setCosts((prev) =>
        prev.map((c) => (c.id === editingCostId ? newCost : c))
      );
      setIsEditing(false);
      setEditingCostId(null);
    } else {
      setCosts((prev) => [...prev, newCost]);
    }

    setCurrentCost({
      name: "",
      category: COST_CATEGORIES[0],
      amount: "",
    });
  };

  const handleRemoveCost = (costId) => {
    setCostToDelete(costId);
    setShowDeleteCostModal(true);
  };

  const handleEditCost = (cost) => {
    setCurrentCost({
      name: cost.name,
      category: cost.category,
      amount: cost.amount.toString(),
    });
    setIsEditing(true);
    setEditingCostId(cost.id);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingCostId(null);
    setCurrentCost({
      name: "",
      category: COST_CATEGORIES[0],
      amount: "",
    });
  };

  const handleConfirmDeleteCost = () => {
    if (costToDelete !== null) {
      setCosts((prev) => prev.filter((cost) => cost.id !== costToDelete));
      setShowDeleteCostModal(false);
      setCostToDelete(null);
    }
  };

  const handleSave = () => {
    // Don't save if there's unsaved input
    if (currentCost.name || currentCost.amount) {
      if (
        window.confirm(
          "You have unsaved changes. Do you want to add them before saving?"
        )
      ) {
        handleAddCost();
      }
    }
    onSubmit(costs);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-y-auto p-6 pb-24">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-medium">Other Costs</h2>
          <QuoteNumber />
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Name"
              name="name"
              value={currentCost.name}
              onChange={handleInputChange}
              placeholder="Cost name"
            />

            <div className="space-y-2">
              <CustomDropdown
                options={COST_CATEGORIES}
                value={currentCost.category}
                onChange={handleCategoryChange}
              />
            </div>

            <FormInput
              label="Cost"
              name="amount"
              type="number"
              value={currentCost.amount}
              onChange={handleInputChange}
              prefix="£"
              placeholder="0.00"
              min="0"
              step="0.01"
            />

            <div className="flex items-end">
              <Button
                variant="secondary"
                onClick={handleAddCost}
                className="w-full md:w-auto"
              >
                {isEditing ? "Update Cost" : "Add cost to table"}
              </Button>
              {isEditing && (
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="w-full md:w-auto ml-2"
                >
                  Cancel Edit
                </Button>
              )}
            </div>
          </div>

          {/* Costs Table */}
          {costs.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Added Costs</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Name
                      </th>
                      <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Category
                      </th>
                      <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Cost
                      </th>
                      <th className="px-2 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {costs.map((cost) => (
                      <tr key={cost.id}>
                        <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                          {cost.name}
                          <div className="sm:hidden text-xs text-gray-500 mt-1">
                            {cost.category}
                          </div>
                        </td>
                        <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                          {cost.category}
                        </td>
                        <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                          £{cost.amount.toFixed(2)}
                        </td>
                        <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleEditCost(cost)}
                            className="text-slate-600 hover:text-slate-800 mr-2 sm:mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleRemoveCost(cost.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 mt-auto flex justify-end space-x-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Costs
        </Button>
      </div>

      <WarningModal
        isOpen={showDeleteCostModal}
        onClose={() => setShowDeleteCostModal(false)}
        onConfirm={handleConfirmDeleteCost}
        title="Delete Cost"
        message="Are you sure you want to delete this cost? This action cannot be undone."
        confirmText="Delete Cost"
        cancelText="Cancel"
      />
    </div>
  );
};

CreateCostsForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  existingCosts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      category: PropTypes.string,
      amount: PropTypes.number,
    })
  ),
};

export default CreateCostsForm;
