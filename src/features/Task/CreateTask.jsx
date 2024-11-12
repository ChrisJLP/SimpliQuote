import React from "react";
import PropTypes from "prop-types";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import WarningModal from "../../components/WarningModal";
import CreateCostsForm from "../Costs/CreateCosts";
import { useTaskForm } from "../../hooks/useForm";

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
    handleEditSubtask,
    handleConfirmSubtask,
    handleRemoveSubtask,
  } = useTaskForm(initialData);

  const [currentSubtask, setCurrentSubtask] = React.useState(null);
  const [subtaskError, setSubtaskError] = React.useState("");
  const [isEditing, setIsEditing] = React.useState(false);
  const [editingSubtaskIndex, setEditingSubtaskIndex] = React.useState(null);
  const [showDeleteSubtaskModal, setShowDeleteSubtaskModal] =
    React.useState(false);
  const [subtaskToDelete, setSubtaskToDelete] = React.useState(null);

  React.useEffect(() => {
    if (initialData?.subtasks?.length > 0) {
      toggleSubtasks(true);
    }
  }, [initialData, toggleSubtasks]);

  const handleAddSubtask = () => {
    setCurrentSubtask({ name: "", hoursEstimate: "" });
    setSubtaskError("");
    setIsEditing(false);
    setEditingSubtaskIndex(null);
  };

  const validateSubtask = (subtask) => {
    if (!subtask.name.trim()) {
      setSubtaskError("Subtask name is required");
      return false;
    }
    if (!subtask.hoursEstimate || parseFloat(subtask.hoursEstimate) <= 0) {
      setSubtaskError("Valid hours estimate is required");
      return false;
    }
    setSubtaskError("");
    return true;
  };

  const handleConfirmSubtaskClick = () => {
    if (currentSubtask && validateSubtask(currentSubtask)) {
      if (isEditing && editingSubtaskIndex !== null) {
        handleUpdateSubtask(editingSubtaskIndex, currentSubtask);
      } else {
        handleConfirmSubtask(currentSubtask);
      }
      setCurrentSubtask(null);
      setSubtaskError("");
      setIsEditing(false);
      setEditingSubtaskIndex(null);
    }
  };

  const handleEditSubtaskClick = (index) => {
    const subtaskToEdit = handleEditSubtask(index);
    setCurrentSubtask(subtaskToEdit);
    setSubtaskError("");
    setIsEditing(true);
    setEditingSubtaskIndex(index);
  };

  const handleUpdateSubtask = (index, updatedSubtask) => {
    const updatedSubtasks = confirmedSubtasks.map((subtask, i) =>
      i === index
        ? {
            ...updatedSubtask,
            hoursEstimate: parseFloat(updatedSubtask.hoursEstimate) || 0,
          }
        : subtask
    );
    updateSubtasks(updatedSubtasks);
  };

  const handleCancelSubtask = () => {
    setCurrentSubtask(null);
    setSubtaskError("");
    setIsEditing(false);
    setEditingSubtaskIndex(null);
  };

  const handleConfirmSubtaskDelete = () => {
    if (subtaskToDelete !== null) {
      handleRemoveSubtask(subtaskToDelete);
      setSubtaskToDelete(null);
      setShowDeleteSubtaskModal(false);
    }
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
        !window.confirm(
          "You have an unconfirmed subtask. Do you want to continue without it?"
        )
      ) {
        return;
      }
    }
    const taskData = {
      ...formData,
      subtasks: hasSubtasks ? confirmedSubtasks : [],
      hoursEstimate: hasSubtasks
        ? calculateTotalHours()
        : parseFloat(formData.hoursEstimate) || 0,
    };
    onSubmit(taskData);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-y-auto p-6 pb-24">
        <h2 className="text-2xl font-medium mb-6">
          {initialData ? "Edit Task" : "Create a Task"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Name Input */}
          <div className="space-y-2">
            <label className="block text-sm">Task name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
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
                name="hoursEstimate"
                value={formData.hoursEstimate}
                onChange={handleInputChange}
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
                onChange={(e) => toggleSubtasks(e.target.checked)}
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
                          onClick={() => handleEditSubtaskClick(index)}
                          className="text-slate-600 hover:text-slate-800"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
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
                      className={`w-full p-3 border ${
                        subtaskError && !currentSubtask.name
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
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
                      className={`w-full p-3 border ${
                        subtaskError && !currentSubtask.hoursEstimate
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                    />
                  </div>
                  {subtaskError && (
                    <p className="text-red-500 text-sm">{subtaskError}</p>
                  )}
                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={handleCancelSubtask}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <Button
                      variant="secondary"
                      onClick={handleConfirmSubtaskClick}
                    >
                      {isEditing ? "Update Subtask" : "Confirm Subtask"}
                    </Button>
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
                  onClick={() => setShowCostsModal(true)}
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
        </form>
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 mt-auto flex justify-end space-x-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {initialData ? "Update Task" : "Save Task"}
        </Button>
      </div>

      {/* Costs Creation Modal */}
      <Modal isOpen={showCostsModal} onClose={() => setShowCostsModal(false)}>
        <CreateCostsForm
          existingCosts={formData.otherCosts}
          onSubmit={handleAddCosts}
          onCancel={() => setShowCostsModal(false)}
        />
      </Modal>

      {/* Delete Subtask Warning Modal */}
      <WarningModal
        isOpen={showDeleteSubtaskModal}
        onClose={() => setShowDeleteSubtaskModal(false)}
        onConfirm={handleConfirmSubtaskDelete}
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
