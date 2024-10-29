// features/Project/CreateProject.jsx
import { useState, useEffect } from "react";

const CreateProjectForm = ({ onCancel, onSubmit }) => {
  const [formData, setFormData] = useState({
    projectName: "",
    hourlyRate: "",
    includeTasks: false,
    tasks: [],
    additionalCosts: [],
    totalHours: "",
  });

  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    if (!formData.includeTasks && formData.hourlyRate && formData.totalHours) {
      const cost =
        parseFloat(formData.hourlyRate) * parseFloat(formData.totalHours);
      setTotalCost(cost);
    } else {
      setTotalCost(0);
    }
  }, [formData.hourlyRate, formData.totalHours, formData.includeTasks]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddTask = () => {
    // We'll implement this later - for now just log
    console.log("Add task clicked");
  };

  const handleAddOtherCosts = () => {
    // We'll implement this later - for now just log
    console.log("Add other costs clicked");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Create a Project</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Name */}
        <div className="space-y-2">
          <label htmlFor="projectName" className="block font-medium">
            Project name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="projectName"
            name="projectName"
            value={formData.projectName}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Hourly Rate */}
        <div className="space-y-2">
          <label htmlFor="hourlyRate" className="block font-medium">
            Your hourly rate <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2">£</span>
            <input
              type="number"
              id="hourlyRate"
              name="hourlyRate"
              value={formData.hourlyRate}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="w-full p-2 pl-7 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Include Tasks Option */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="includeTasks"
              checked={formData.includeTasks}
              onChange={handleInputChange}
              className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="font-medium">
              Do you want to add tasks to your project?
            </span>
          </label>
        </div>

        {/* Task and Cost Buttons - shown when includeTasks is true */}
        {formData.includeTasks && (
          <div className="space-y-4">
            {formData.tasks.length > 0 && (
              <div className="mt-4">{/* Task list will go here */}</div>
            )}

            <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-center">
              <button
                type="button"
                onClick={handleAddTask}
                className="w-64 px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition-colors"
              >
                Add new task
              </button>
              <button
                type="button"
                onClick={handleAddOtherCosts}
                className="w-64 px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition-colors"
              >
                Add other costs
              </button>
            </div>
          </div>
        )}

        {/* Conditional Total Hours (moved up, before action buttons) */}
        {!formData.includeTasks && (
          <div className="space-y-2">
            <label htmlFor="totalHours" className="block font-medium">
              Total hours estimated
            </label>
            <input
              type="number"
              id="totalHours"
              name="totalHours"
              value={formData.totalHours}
              onChange={handleInputChange}
              min="0"
              step="0.5"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        )}

        <div className="mt-8 border-t pt-4">
          <div className="flex justify-end items-center text-lg font-semibold">
            <span>
              Total cost: £
              {totalCost.toLocaleString("en-GB", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end space-x-4 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#4CAF50] text-white rounded hover:bg-[#45A049]"
          >
            Create Project
          </button>
        </div>
      </form>
    </div>
  );
};
export default CreateProjectForm;
