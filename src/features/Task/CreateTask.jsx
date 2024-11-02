import React, { useState } from "react";
import Button from "../../components/Button";

const CreateTaskForm = ({ projectId, onSubmit, onCancel }) => {
  const [taskName, setTaskName] = useState("");
  const [hasSubtasks, setHasSubtasks] = useState(false);
  const [confirmedSubtasks, setConfirmedSubtasks] = useState([]);
  const [currentSubtask, setCurrentSubtask] = useState(null);
  const [singleHoursEstimate, setSingleHoursEstimate] = useState("");
  const [previousSingleHoursEstimate, setPreviousSingleHoursEstimate] =
    useState("");

  const handleAddSubtask = () => {
    setCurrentSubtask({ name: "", hoursEstimate: "" });
  };

  const handleConfirmSubtask = () => {
    if (currentSubtask && currentSubtask.name && currentSubtask.hoursEstimate) {
      setConfirmedSubtasks([...confirmedSubtasks, currentSubtask]);
      setCurrentSubtask(null);
    }
  };

  const handleRemoveSubtask = (index) => {
    const newSubtasks = [...confirmedSubtasks];
    newSubtasks.splice(index, 1);
    setConfirmedSubtasks(newSubtasks);
  };

  const handleEditSubtask = (index) => {
    setCurrentSubtask(confirmedSubtasks[index]);
    handleRemoveSubtask(index);
  };

  const calculateTotalHours = () => {
    return confirmedSubtasks.reduce(
      (sum, subtask) => sum + (parseFloat(subtask.hoursEstimate) || 0),
      0
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentSubtask?.name || currentSubtask?.hoursEstimate) {
      if (
        !confirm(
          "You have an unconfirmed subtask. Do you want to continue without it?"
        )
      ) {
        return;
      }
    }
    const taskData = {
      projectId,
      name: taskName,
      subtasks: hasSubtasks ? confirmedSubtasks : [],
      hoursEstimate: hasSubtasks
        ? calculateTotalHours()
        : parseFloat(singleHoursEstimate) || 0,
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

          {/* Single Hours Estimate - Only shown when no subtasks */}
          {!hasSubtasks && (
            <div className="space-y-2">
              <label className="block text-sm">Hours estimate *</label>
              <input
                type="number"
                value={singleHoursEstimate}
                onChange={(e) => setSingleHoursEstimate(e.target.value)}
                required
                min="0"
                step="0.5"
                placeholder="0.0"
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
          )}

          {/* Subtasks Checkbox */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={hasSubtasks}
                onChange={(e) => {
                  setHasSubtasks(e.target.checked);
                  if (e.target.checked) {
                    // Store current single estimate before switching to subtasks
                    setPreviousSingleHoursEstimate(singleHoursEstimate);
                    setSingleHoursEstimate("");
                  } else {
                    // Restore previous single estimate when disabling subtasks
                    setSingleHoursEstimate(previousSingleHoursEstimate);
                    // Clear any in-progress subtask
                    setCurrentSubtask(null);
                    // Keep confirmedSubtasks in memory
                  }
                }}
                className="rounded border-gray-300"
              />
              <span>Do you want to add subtasks?</span>
            </label>
          </div>

          {/* Subtasks Section */}
          {hasSubtasks && (
            <div className="space-y-4">
              {/* List of confirmed subtasks */}
              {confirmedSubtasks.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium">Subtasks:</h3>
                  {confirmedSubtasks.map((subtask, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-md flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{subtask.name}</p>
                        <p className="text-sm text-gray-600">
                          {subtask.hoursEstimate} hours
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEditSubtask(index)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubtask(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Current subtask form */}
              {currentSubtask && (
                <div className="bg-gray-50 p-4 rounded-md space-y-3">
                  <div>
                    <label className="block text-sm mb-1">Subtask name</label>
                    <input
                      type="text"
                      value={currentSubtask.name}
                      onChange={(e) =>
                        setCurrentSubtask({
                          ...currentSubtask,
                          name: e.target.value,
                        })
                      }
                      placeholder="Enter subtask name"
                      className="w-full p-3 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Hours estimate</label>
                    <input
                      type="number"
                      value={currentSubtask.hoursEstimate}
                      onChange={(e) =>
                        setCurrentSubtask({
                          ...currentSubtask,
                          hoursEstimate: e.target.value,
                        })
                      }
                      min="0"
                      step="0.5"
                      placeholder="0.0"
                      className="w-full p-3 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentSubtask(null)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmSubtask}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Confirm Subtask
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                {!currentSubtask && (
                  <button
                    type="button"
                    onClick={handleAddSubtask}
                    className="w-[220px] bg-slate-600 text-white p-3 rounded hover:bg-slate-700 transition-colors"
                  >
                    {confirmedSubtasks.length > 0
                      ? "Add another subtask"
                      : "Add new subtask"}
                  </button>
                )}
                <button
                  type="button"
                  className="w-[220px] bg-slate-600 text-white p-3 rounded hover:bg-slate-700 transition-colors"
                >
                  Add other costs
                </button>
              </div>

              {confirmedSubtasks.length > 0 && (
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
