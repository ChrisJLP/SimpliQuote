import React, { useState } from "react";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import CreateTaskForm from "../Task/CreateTask";

const CreateProjectForm = ({ onSubmit, onCancel }) => {
  const [projectData, setProjectData] = useState({
    name: "",
    hourlyRate: "",
    hoursEstimate: "",
    tasks: [],
    otherCosts: [],
    totalCost: 0,
  });
  const [includeTasks, setIncludeTasks] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [savedTasks, setSavedTasks] = useState([]);
  const [previousHoursEstimate, setPreviousHoursEstimate] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prev) => {
      const updatedData = {
        ...prev,
        [name]: value,
      };
      if (name === "hourlyRate" || name === "hoursEstimate") {
        return {
          ...updatedData,
          totalCost: !includeTasks
            ? (parseFloat(updatedData.hourlyRate) || 0) *
              (parseFloat(updatedData.hoursEstimate) || 0)
            : calculateTotalCost(
                prev.tasks,
                prev.otherCosts,
                updatedData.hourlyRate
              ),
        };
      }
      return updatedData;
    });
  };

  const handleAddTask = (taskData) => {
    setProjectData((prev) => {
      const newTask = {
        ...taskData,
        hoursEstimate: parseFloat(taskData.hoursEstimate) || 0,
        subtasks: taskData.subtasks.map((st) => ({
          ...st,
          hoursEstimate: parseFloat(st.hoursEstimate) || 0,
        })),
      };

      const updatedTasks = [...prev.tasks, newTask];
      const newTotalCost = calculateTotalCost(
        updatedTasks,
        prev.otherCosts,
        prev.hourlyRate
      );

      return {
        ...prev,
        tasks: updatedTasks,
        totalCost: newTotalCost,
      };
    });
    setShowTaskModal(false);
  };

  const calculateTotalCost = (tasks, otherCosts, hourlyRate) => {
    const rate = parseFloat(hourlyRate) || 0;

    const tasksCost = tasks.reduce((sum, task) => {
      const taskHours = parseFloat(task.hoursEstimate) || 0;
      const subtaskHours =
        task.subtasks?.reduce(
          (subtaskSum, subtask) =>
            subtaskSum + (parseFloat(subtask.hoursEstimate) || 0),
          0
        ) || 0;
      return sum + (taskHours + subtaskHours) * rate;
    }, 0);

    const additionalCosts = otherCosts.reduce(
      (sum, cost) => sum + (parseFloat(cost.amount) || 0),
      0
    );

    return tasksCost + additionalCosts;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalProjectData = {
      ...projectData,
      tasks: includeTasks ? projectData.tasks : savedTasks,
    };
    onSubmit(finalProjectData);
  };

  return (
    <div className="p-6 min-h-0">
      <h2 className="text-2xl font-medium mb-6">Create a Project</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Name Input */}
        <div className="space-y-2">
          <label className="block text-sm">Project name *</label>
          <input
            type="text"
            name="name"
            value={projectData.name}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md bg-[#F8F9FA]"
            required
          />
        </div>

        {/* Hourly Rate Input */}
        <div className="space-y-2">
          <label className="block text-sm">Your hourly rate *</label>
          <div className="relative">
            <span className="absolute left-3 top-3">£</span>
            <input
              type="number"
              name="hourlyRate"
              value={projectData.hourlyRate}
              onChange={handleInputChange}
              className="w-full p-3 pl-6 border border-gray-300 rounded-md bg-[#F8F9FA]"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        {/* Hours Estimate - Only shown when no tasks */}
        {!includeTasks && (
          <div className="space-y-2">
            <label className="block text-sm">Hours estimate *</label>
            <input
              type="number"
              name="hoursEstimate"
              value={projectData.hoursEstimate}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md bg-[#F8F9FA]"
              placeholder="0.0"
              min="0"
              step="0.5"
              required
            />
          </div>
        )}

        {/* Tasks Checkbox */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={includeTasks}
              onChange={(e) => {
                setIncludeTasks(e.target.checked);
                if (e.target.checked) {
                  // Save current hours estimate and restore tasks
                  setPreviousHoursEstimate(projectData.hoursEstimate);
                  setProjectData((prev) => ({
                    ...prev,
                    tasks: savedTasks,
                    hoursEstimate: "", // Clear hours estimate when switching to tasks
                  }));
                } else {
                  // Save tasks and restore previous hours estimate
                  setSavedTasks(projectData.tasks);
                  setProjectData((prev) => ({
                    ...prev,
                    tasks: [],
                    hoursEstimate: previousHoursEstimate,
                  }));
                }
              }}
              className="rounded border-gray-300"
            />
            <span>Do you want to add tasks to your project?</span>
          </label>
        </div>

        {includeTasks && (
          <>
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => setShowTaskModal(true)}
                className="w-[220px] bg-slate-600 text-white p-3 rounded hover:bg-slate-700 transition-colors"
              >
                Add new task
              </button>
              <button
                type="button"
                className="w-[220px] bg-slate-600 text-white p-3 rounded hover:bg-slate-700 transition-colors"
              >
                Add other costs
              </button>
            </div>

            {/* Display Tasks */}
            {projectData.tasks.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-base font-medium mb-2">Tasks</h3>
                <div className="space-y-2">
                  {projectData.tasks.map((task, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-md">
                      <p className="font-medium">{task.name}</p>
                      <p className="text-sm text-gray-600">
                        {task.hoursEstimate} hours estimated
                      </p>
                      {task.subtasks && task.subtasks.length > 0 && (
                        <div className="mt-2 ml-4">
                          {task.subtasks.map((subtask, idx) => (
                            <p key={idx} className="text-sm text-gray-600">
                              - {subtask.name}: {subtask.hoursEstimate} hours
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Total Cost */}
        <div className="text-center">
          Total cost: £{projectData.totalCost.toFixed(2)}
        </div>

        {/* View Summary Button */}
        <div className="flex justify-center">
          <button
            type="button"
            className="bg-slate-600 text-white px-6 py-3 rounded hover:bg-slate-700 transition-colors"
          >
            View project summary
          </button>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#4CAF50] text-white px-4 py-2 rounded hover:bg-[#45A049] transition-colors"
          >
            Create Project
          </button>
        </div>
      </form>

      {/* Task Creation Modal */}
      <Modal isOpen={showTaskModal} onClose={() => setShowTaskModal(false)}>
        <CreateTaskForm
          projectId={projectData.id}
          onSubmit={handleAddTask}
          onCancel={() => setShowTaskModal(false)}
        />
      </Modal>
    </div>
  );
};

export default CreateProjectForm;
