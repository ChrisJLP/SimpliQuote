// features/Task/CreateTask.jsx
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import WarningModal from "../../components/WarningModal";
import CreateCostsForm from "../Costs/CreateCosts";
import { useTaskForm } from "../../hooks/useForm"; // Import useTaskForm

const CreateTaskForm = ({ onSubmit, onCancel, initialData }) => {
  const {
    formData,
    hasSubtasks,
    showCostsModal,
    setShowCostsModal,
    handleInputChange,
    handleAddCosts,
    toggleSubtasks,
    confirmedSubtasks,
    updateSubtasks,
    handleAddSubtask,
    handleEditSubtask,
    handleConfirmSubtask,
    handleUpdateSubtask, // Use this from useTaskForm
    handleRemoveSubtask,
    currentSubtask,
    setCurrentSubtask,
    subtaskError,
    setSubtaskError,
    isEditing,
    setIsEditing,
    editingSubtaskIndex,
    setEditingSubtaskIndex,
    showDeleteSubtaskModal,
    setShowDeleteSubtaskModal,
    subtaskToDelete,
    setSubtaskToDelete,
  } = useTaskForm(initialData);

  // Debugging logs to track render and state
  console.log("=== CreateTaskForm Render Start ===");
  console.log(
    "CreateTaskForm mounted/re-rendered with initialData:",
    initialData
  );
  console.log("Task Form states:", {
    hasSubtasks,
    showCostsModal,
    currentSubtask,
    editingSubtaskIndex,
    showDeleteSubtaskModal,
    subtaskToDelete,
    subtaskError,
    isEditing,
    formData,
    confirmedSubtasks,
  });

  useEffect(() => {
    // Only toggle subtasks if initialData has subtasks and hasSubtasks is false
    if (initialData?.subtasks?.length > 0 && !hasSubtasks) {
      console.log(
        "Initial data includes subtasks, toggling hasSubtasks to true."
      );
      toggleSubtasks(true);
    }
  }, [initialData, hasSubtasks, toggleSubtasks]);

  const handleConfirmDeleteSubtask = () => {
    console.log(
      "handleConfirmDeleteSubtask triggered for subtask index:",
      subtaskToDelete
    );
    if (subtaskToDelete !== null) {
      handleRemoveSubtask(subtaskToDelete);
      setSubtaskToDelete(null);
      setShowDeleteSubtaskModal(false);
      console.log("Subtask at index", subtaskToDelete, "deleted.");
    }
  };

  const validateSubtask = (subtask) => {
    console.log("validateSubtask called with:", subtask);
    if (!subtask.name.trim()) {
      setSubtaskError("Subtask name is required");
      console.log("Subtask validation failed: Missing name");
      return false;
    }
    if (!subtask.hoursEstimate || parseFloat(subtask.hoursEstimate) <= 0) {
      setSubtaskError("Valid hours estimate is required");
      console.log("Subtask validation failed: Invalid hoursEstimate");
      return false;
    }
    setSubtaskError("");
    return true;
  };

  const handleConfirmSubtaskClick = () => {
    console.log("handleConfirmSubtaskClick triggered");
    if (currentSubtask && validateSubtask(currentSubtask)) {
      if (isEditing && editingSubtaskIndex !== null) {
        console.log("Updating existing subtask at index:", editingSubtaskIndex);
        handleUpdateSubtask(editingSubtaskIndex, currentSubtask);
      } else {
        console.log("Confirming new subtask:", currentSubtask);
        handleConfirmSubtask(currentSubtask);
      }
      setCurrentSubtask(null);
      setSubtaskError("");
      setIsEditing(false);
      setEditingSubtaskIndex(null);
    }
  };

  const handleCancelSubtask = () => {
    console.log("handleCancelSubtask triggered, subtask editing cancelled");
    setCurrentSubtask(null);
    setSubtaskError("");
    setIsEditing(false);
    setEditingSubtaskIndex(null);
  };

  const calculateTotalHours = () => {
    console.log("calculateTotalHours called with subtasks:", confirmedSubtasks);
    return confirmedSubtasks.reduce(
      (sum, subtask) => sum + (parseFloat(subtask.hoursEstimate) || 0),
      0
    );
  };

  const handleTaskSubmit = () => {
    console.log("handleTaskSubmit called for CreateTaskForm");
    if (currentSubtask?.name || currentSubtask?.hoursEstimate) {
      console.log("There is an unconfirmed subtask. Prompting user...");
      if (
        !window.confirm(
          "You have an unconfirmed subtask. Do you want to continue without it?"
        )
      ) {
        return; // Stop if user doesn't want to proceed
      }
    }
    const taskData = {
      ...formData,
      subtasks: hasSubtasks ? confirmedSubtasks : [],
      hoursEstimate: hasSubtasks
        ? calculateTotalHours()
        : parseFloat(formData.hoursEstimate) || 0,
    };
    console.log("Task form action data:", taskData);
    if (onSubmit) {
      console.log(
        "Calling onSubmit callback for task form with data:",
        taskData
      );
      onSubmit(taskData);
      // We assume onSubmit updates the parent form data and closes this modal
    } else {
      console.log("No onSubmit prop provided for task form.");
    }
  };

  console.log("=== CreateTaskForm Render End ===");

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable content area */}
      <div className="overflow-y-auto p-6 flex-1">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-medium">
            {initialData ? "Edit Task" : "Create a Task"}
          </h2>
          {/* Removed QuoteNumber component as it's not needed here */}
        </div>

        {/* Main form fields */}
        <div className="space-y-6">
          {/* Task Name Input */}
          <div className="space-y-2">
            <label className="block text-sm">
              Task name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={(e) => {
                console.log("Task name changed to:", e.target.value);
                handleInputChange(e);
              }}
              required
              placeholder="Enter task name"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>

          {/* Single Hours Estimate - Only shown when no subtasks */}
          {!hasSubtasks && (
            <div className="space-y-2">
              <label className="block text-sm">
                Hours estimate <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="hoursEstimate"
                value={formData.hoursEstimate || ""}
                onChange={(e) => {
                  console.log("Hours estimate changed to:", e.target.value);
                  handleInputChange(e);
                }}
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
                  console.log("Subtasks toggled. now:", e.target.checked);
                  toggleSubtasks(e.target.checked);
                }}
                className="rounded border-gray-300"
              />
              <span>Do you want to add subtasks?</span>
            </label>
          </div>

          {/* Subtasks Section */}
          {hasSubtasks && (
            <div className="space-y-4">
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
                        {subtask.otherCosts?.length > 0 && (
                          <div className="mt-1">
                            {subtask.otherCosts.map((cost, costIdx) => (
                              <p
                                key={costIdx}
                                className="text-sm text-gray-600"
                              >
                                · {cost.name}: £{cost.amount.toFixed(2)} (
                                {cost.category})
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            console.log(`Edit subtask at index: ${index}`);
                            handleEditSubtask(index);
                          }}
                          className="text-slate-600 hover:text-slate-800"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            console.log(`Remove subtask at index: ${index}`);
                            setSubtaskToDelete(index);
                            setShowDeleteSubtaskModal(true);
                          }}
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
                    <label className="block text-sm mb-1">
                      Subtask name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={currentSubtask.name || ""}
                      onChange={(e) => {
                        const updatedValue = e.target.value;
                        console.log("Subtask name changed to:", updatedValue);
                        setCurrentSubtask((prevSubtask) => ({
                          ...prevSubtask,
                          name: updatedValue,
                        }));
                      }}
                      placeholder="Enter subtask name"
                      className={`w-full p-3 border ${
                        subtaskError && !currentSubtask.name
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">
                      Hours estimate <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={currentSubtask.hoursEstimate || ""}
                      onChange={(e) => {
                        const updatedHours = e.target.value;
                        console.log(
                          "Subtask hours estimate changed to:",
                          updatedHours
                        );
                        setCurrentSubtask((prevSubtask) => ({
                          ...prevSubtask,
                          hoursEstimate: updatedHours,
                        }));
                      }}
                      min="0"
                      step="0.5"
                      placeholder="0.0"
                      className={`w-full p-3 border ${
                        subtaskError && !currentSubtask.hoursEstimate
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                      required
                    />
                  </div>
                  {subtaskError && (
                    <p className="text-red-500 text-sm">{subtaskError}</p>
                  )}
                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        console.log("Cancel subtask editing/creation");
                        handleCancelSubtask();
                      }}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        console.log("Confirm subtask clicked");
                        handleConfirmSubtaskClick();
                      }}
                    >
                      {isEditing ? "Update Subtask" : "Confirm Subtask"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {!currentSubtask && (
                <div className="flex justify-center space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      console.log("Add new subtask button clicked");
                      handleAddSubtask();
                    }}
                    className="w-[220px] bg-slate-600 text-white p-3 rounded hover:bg-slate-700 transition-colors"
                  >
                    {confirmedSubtasks.length > 0
                      ? "Add another subtask"
                      : "Add new subtask"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      console.log(
                        "Add other costs button clicked in task form"
                      );
                      setShowCostsModal(true);
                    }}
                    className="w-[220px] bg-slate-600 text-white p-3 rounded hover:bg-slate-700 transition-colors"
                  >
                    Add other costs
                  </button>
                </div>
              )}

              {confirmedSubtasks.length > 0 && (
                <div className="text-sm text-gray-600">
                  Total hours from subtasks: {calculateTotalHours()}
                </div>
              )}
            </div>
          )}

          {/* Display Task Other Costs */}
          {formData.otherCosts?.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-base font-medium mb-2">Task Costs</h3>
              <div className="space-y-2">
                {formData.otherCosts.map((cost, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-md">
                    <p className="font-medium">{cost.name}</p>
                    <p className="text-sm text-gray-600">
                      {cost.category} - £{cost.amount.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer (Fixed and sticky at the bottom) */}
      <div className="sticky bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => {
            console.log("Task form cancel button clicked");
            onCancel();
          }}
          type="button"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            console.log("Task form (Save/Update) button clicked");
            handleTaskSubmit();
          }}
        >
          {initialData ? "Update Task" : "Save Task"}
        </Button>
      </div>

      {/* Costs Creation Modal */}
      <Modal
        isOpen={showCostsModal}
        onClose={() => {
          console.log("Costs creation modal closed in task form");
          setShowCostsModal(false);
        }}
      >
        <CreateCostsForm
          existingCosts={formData.otherCosts}
          onSubmit={(costs) => {
            console.log(
              "New costs submitted for task form from CreateCostsForm:",
              costs
            );
            handleAddCosts(costs);
            setShowCostsModal(false);
          }}
          onCancel={() => {
            console.log(
              "CreateCostsForm canceled in task form. Closing costs modal..."
            );
            setShowCostsModal(false);
          }}
        />
      </Modal>

      {/* Delete Subtask Warning Modal */}
      <WarningModal
        isOpen={showDeleteSubtaskModal}
        onClose={() => {
          console.log(
            "Delete subtask warning modal closed without confirmation"
          );
          setShowDeleteSubtaskModal(false);
        }}
        onConfirm={() => {
          console.log("Delete subtask warning modal confirm clicked");
          handleConfirmDeleteSubtask();
        }}
        title="Delete Subtask"
        message="Are you sure you want to delete this subtask? This action cannot be undone."
        confirmText="Delete Subtask"
        cancelText="Cancel"
      />
    </div>
  );
};

CreateTaskForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    name: PropTypes.string,
    hoursEstimate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    subtasks: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        hoursEstimate: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
        ]),
        otherCosts: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string,
            amount: PropTypes.number,
            category: PropTypes.string,
          })
        ),
      })
    ),
    otherCosts: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        amount: PropTypes.number,
        category: PropTypes.string,
      })
    ),
  }),
};

export default CreateTaskForm;
