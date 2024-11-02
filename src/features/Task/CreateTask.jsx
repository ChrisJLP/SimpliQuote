import React, { useState } from "react";
import Button from "../../components/Button";
const CreateTaskForm = ({ projectId, onSubmit, onCancel }) => {
  const [taskName, setTaskName] = useState("");
  const [hasSubtasks, setHasSubtasks] = useState(false);
  const [subtasks, setSubtasks] = useState([]);

  const calculateTotalHours = () => {
    return subtasks.reduce(
      (sum, subtask) => sum + (parseFloat(subtask.hoursEstimate) || 0),
      0
    );
  };

  const handleAddSubtask = () => {
    setSubtasks([...subtasks, { name: "", hoursEstimate: "" }]);
  };

  const handleSubtaskChange = (index, field, value) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index] = { ...updatedSubtasks[index], [field]: value };
    setSubtasks(updatedSubtasks);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const taskData = {
      projectId,
      name: taskName,
      hoursEstimate: calculateTotalHours(),
      subtasks: hasSubtasks ? subtasks : [],
    };
    onSubmit(taskData);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-y-auto p-6 pb-24">
        <h2 className="text-2xl font-medium mb-6">Create a Task</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Name Input */}
          <div className="space-y-2">
            <label className="block text-sm">Task name *</label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
              placeholder="Enter task name"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>

          {/* Subtasks Checkbox */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={hasSubtasks}
                onChange={(e) => {
                  setHasSubtasks(e.target.checked);
                  if (!e.target.checked) setSubtasks([]);
                }}
                className="rounded border-gray-300"
              />
              <span>Do you want to add subtasks?</span>
            </label>
          </div>

          {/* Subtasks Section */}
          {hasSubtasks && (
            <div className="space-y-4">
              {subtasks.map((subtask, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-md space-y-3"
                >
                  <div>
                    <label className="block text-sm mb-1">
                      Subtask {index + 1} name
                    </label>
                    <input
                      type="text"
                      value={subtask.name}
                      onChange={(e) =>
                        handleSubtaskChange(index, "name", e.target.value)
                      }
                      required
                      placeholder="Enter subtask name"
                      className="w-full p-3 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Hours estimate</label>
                    <input
                      type="number"
                      value={subtask.hoursEstimate}
                      onChange={(e) =>
                        handleSubtaskChange(
                          index,
                          "hoursEstimate",
                          e.target.value
                        )
                      }
                      required
                      min="0"
                      step="0.5"
                      placeholder="0.0"
                      className="w-full p-3 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddSubtask}
                className="w-full bg-slate-600 text-white p-3 rounded hover:bg-slate-700 transition-colors"
              >
                Add new subtask
              </button>

              {subtasks.length > 0 && (
                <div className="text-sm text-gray-600">
                  Total hours from subtasks: {calculateTotalHours()}
                </div>
              )}
            </div>
          )}
        </form>
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 mt-auto flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-[#4CAF50] text-white px-4 py-2 rounded hover:bg-[#45A049] transition-colors"
        >
          Save Task
        </button>
      </div>
    </div>
  );
};

export default CreateTaskForm;
