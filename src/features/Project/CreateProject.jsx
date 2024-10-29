// features/Project/CreateProject.jsx
import { useState } from "react";

const CreateProjectForm = ({ onCancel, onSubmit }) => {
  const [formData, setFormData] = useState({
    projectName: "",
    hourlyRate: "",
    includeTasks: false,
    tasks: [],
    totalHours: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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

        {/* Conditional Total Hours (shown if tasks not included) */}
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

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#4CAF50] text-white rounded hover:bg-[#45A049]"
          >
            Create Project
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProjectForm;
