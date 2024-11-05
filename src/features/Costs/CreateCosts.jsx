import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "../../components/Button";
import FormInput from "../../components/FormInput";

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
  const [currentCost, setCurrentCost] = useState({
    name: "",
    category: COST_CATEGORIES[0],
    amount: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCost = () => {
    if (!currentCost.name || !currentCost.amount) return;

    setCosts((prev) => [
      ...prev,
      {
        ...currentCost,
        id: Date.now(),
        amount: parseFloat(currentCost.amount),
      },
    ]);

    setCurrentCost({
      name: "",
      category: COST_CATEGORIES[0],
      amount: "",
    });
  };

  const handleRemoveCost = (costId) => {
    setCosts((prev) => prev.filter((cost) => cost.id !== costId));
  };

  const handleEditCost = (cost) => {
    setCurrentCost(cost);
    handleRemoveCost(cost.id);
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
        <h2 className="text-2xl font-medium mb-6">Other Costs</h2>

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
              <label className="block text-sm">Category</label>
              <select
                name="category"
                value={currentCost.category}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md bg-[#F8F9FA]"
              >
                {COST_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
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
                Add cost to table
              </Button>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Cost
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {costs.map((cost) => (
                      <tr key={cost.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {cost.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {cost.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          £{cost.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleEditCost(cost)}
                            className="text-blue-600 hover:text-blue-800 mr-4"
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
