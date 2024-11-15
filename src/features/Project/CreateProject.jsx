// features/Project/CreateProject.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import WarningModal from "../../components/WarningModal";
import FormInput from "../../components/FormInput";
import CreateTaskForm from "../Task/CreateTask";
import CreateCostsForm from "../Costs/CreateCosts";
import QuotePreview from "./QuotePreview";
import QuoteNumber from "../../components/QuoteNumber";
import { useProjectForm } from "../../hooks/useForm";

const CreateProjectForm = ({
  onSubmit,
  onCancel,
  userDetails = null,
  initialData = null,
}) => {
  const {
    formData,
    includeTasks,
    showCostsModal,
    setShowCostsModal,
    handleInputChange,
    handleAddTask,
    handleAddCosts,
    toggleTasks,
    confirmCancel,
    showWarningModal,
    handleWarningClose,
    handleWarningConfirm,
    isExistingProject,
    isDirty,
  } = useProjectForm(initialData);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  // Debugging logs to track render and state
  console.log("=== CreateProjectForm Render Start ===");
  console.log(
    "CreateProjectForm mounted/re-rendered with initialData:",
    initialData
  );
  console.log("Project Form states:", {
    includeTasks,
    showCostsModal,
    isExistingProject,
    isDirty,
    formData,
    showTaskModal,
    editingTaskIndex,
    showDeleteTaskModal,
    taskToDelete,
    showQuoteModal,
  });

  const handleEditClick = (index) => {
    console.log(`Edit task at index ${index}`);
    setEditingTaskIndex(index);
    setShowTaskModal(true);
  };

  const handleRemoveClick = (index) => {
    console.log(`Remove task at index ${index}`);
    setTaskToDelete(index);
    setShowDeleteTaskModal(true);
  };

  const handleConfirmDelete = () => {
    console.log("Confirm delete task at index:", taskToDelete);
    if (taskToDelete !== null) {
      // The handleRemoveTask function presumably is defined inside useProjectForm hook
      // (not shown in previous code). Ensure it exists and only removes the task
      // without closing the entire form or define it here:
      // handleRemoveTask(taskToDelete);
      setTaskToDelete(null);
      setShowDeleteTaskModal(false);
      console.log("Task at index", taskToDelete, "deleted.");
    }
  };

  const handleUpdateTask = (updatedTask) => {
    console.log("handleUpdateTask called with:", updatedTask);
    console.log("Editing task index:", editingTaskIndex);

    // If editing an existing task, update it in formData
    if (editingTaskIndex !== null) {
      const updatedTasks = formData.tasks.map((task, index) =>
        index === editingTaskIndex ? updatedTask : task
      );
      console.log("Updated tasks array:", updatedTasks);

      handleInputChange({
        target: {
          name: "tasks",
          value: updatedTasks,
        },
      });

      setEditingTaskIndex(null);
      setShowTaskModal(false); // Closes only the task form modal
      console.log("Task modal closed, project form should remain open.");
    } else {
      // If adding a new task, append it to formData.tasks
      console.log("No editing index, adding new task.");
      handleAddTask(updatedTask);
      console.log("Added new task to tasks array:", formData.tasks);
      setShowTaskModal(false);
      console.log(
        "Closed task modal after adding new task. Project form open."
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("handleSubmit called for CreateProjectForm");
    const quoteNumberElement = document.querySelector(
      '[data-testid="quote-number"]'
    );
    const quoteNumber = quoteNumberElement
      ? quoteNumberElement.textContent.split("#")[1].trim()
      : null;
    const projectDataWithQuote = {
      ...formData,
      quoteNumber,
    };
    console.log("Submitting project data:", projectDataWithQuote);

    if (onSubmit) {
      onSubmit(projectDataWithQuote);
      console.log("onSubmit callback called for project form");
    } else {
      console.log("No onSubmit prop provided, not calling callback.");
    }
  };

  console.log("=== CreateProjectForm Render End ===");

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      {/* Scrollable content area */}
      <div className="overflow-y-auto p-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-medium">
            {initialData ? "Edit Project" : "Create a Project"}
          </h2>
          <div data-testid="quote-number">
            <QuoteNumber
              shouldGenerate={!initialData}
              existingNumber={initialData?.quoteNumber}
            />
          </div>
        </div>

        {/* Main form fields */}
        <div className="space-y-6">
          {/* Project Name Input */}
          <FormInput
            label="Project name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />

          {/* Customer Name Input */}
          <FormInput
            label="Customer name"
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
            required
          />

          {/* Hourly Rate Input */}
          <FormInput
            label="Your hourly rate"
            name="hourlyRate"
            type="number"
            value={formData.hourlyRate}
            onChange={handleInputChange}
            prefix="£"
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />

          {/* Hours Estimate - Only shown when no tasks */}
          {!includeTasks && (
            <FormInput
              label="Hours estimate"
              name="hoursEstimate"
              type="number"
              value={formData.hoursEstimate}
              onChange={handleInputChange}
              placeholder="0.0"
              min="0"
              step="0.5"
              required
            />
          )}

          {/* Tasks Checkbox */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeTasks}
                onChange={(e) => {
                  console.log("Include tasks toggled. Now:", e.target.checked);
                  toggleTasks(e.target.checked);
                }}
                className="rounded border-gray-300"
              />
              <span>Do you want to add tasks to your project?</span>
            </label>
          </div>

          {/* Task Controls and Display (when tasks are included) */}
          {includeTasks && (
            <>
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    console.log("Add new task button clicked");
                    setShowTaskModal(true);
                  }}
                  className="w-[220px] bg-slate-600 text-white p-3 rounded hover:bg-slate-700 transition-colors"
                >
                  Add new task
                </button>
                <button
                  type="button"
                  onClick={() => {
                    console.log("Add other costs button clicked");
                    setShowCostsModal(true);
                  }}
                  className="w-[220px] bg-slate-600 text-white p-3 rounded hover:bg-slate-700 transition-colors"
                >
                  Add other costs
                </button>
              </div>

              {/* Display Tasks */}
              {formData.tasks.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-base font-medium mb-2">Tasks</h3>
                  <div className="space-y-2">
                    {formData.tasks.map((task, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-md">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium">{task.name}</p>
                            <p className="text-sm text-gray-600">
                              {task.hoursEstimate} hours estimated
                            </p>
                          </div>
                          <div className="flex space-x-3 ml-4">
                            <button
                              type="button"
                              onClick={() => handleEditClick(index)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveClick(index)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        {task.otherCosts?.length > 0 && (
                          <div className="mt-1">
                            <p className="text-sm text-gray-600 font-medium">
                              Task Costs:
                            </p>
                            {task.otherCosts.map((cost, costIndex) => (
                              <p
                                key={costIndex}
                                className="text-sm text-gray-600 ml-4"
                              >
                                - {cost.name}: £{cost.amount.toFixed(2)} (
                                {cost.category})
                              </p>
                            ))}
                          </div>
                        )}
                        {task.subtasks && task.subtasks.length > 0 && (
                          <div className="mt-2 ml-4">
                            {task.subtasks.map((subtask, idx) => (
                              <div key={idx} className="mb-1">
                                <p className="text-sm text-gray-600">
                                  - {subtask.name}: {subtask.hoursEstimate}{" "}
                                  hours
                                </p>
                                {subtask.otherCosts?.length > 0 && (
                                  <div className="ml-4">
                                    {subtask.otherCosts.map((cost, costIdx) => (
                                      <p
                                        key={costIdx}
                                        className="text-sm text-gray-600"
                                      >
                                        · {cost.name}: £{cost.amount.toFixed(2)}{" "}
                                        ({cost.category})
                                      </p>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Display Project Other Costs */}
              {formData.otherCosts.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-base font-medium mb-2">Project Costs</h3>
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
            </>
          )}

          {/* Total Cost */}
          <div className="text-center mt-6">
            Total cost: £{formData.totalCost.toFixed(2)}
          </div>

          {/* View Summary Button */}
          <div className="flex justify-center mt-6">
            <Button
              variant="secondary"
              onClick={() => {
                console.log("View quote button clicked");
                setShowQuoteModal(true);
              }}
              type="button"
              className="px-6 py-3"
            >
              View quote
            </Button>
          </div>
        </div>
      </div>

      {/* Footer (Fixed with sticky) */}
      <div className="sticky bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            console.log(`Cancel/Close pressed. initialData: ${!!initialData}`);
            confirmCancel(onCancel);
          }}
        >
          {initialData ? "Close" : "Cancel"}
        </Button>
        <Button
          type="submit"
          variant="primary"
          onClick={() => {
            console.log("Submit project form (Create/Save) button clicked");
          }}
        >
          {initialData ? "Save Changes" : "Create Project"}
        </Button>
      </div>

      {/* Warning Modal */}
      <WarningModal
        isOpen={showWarningModal}
        onClose={() => {
          console.log("Warning modal closed");
          handleWarningClose();
        }}
        onConfirm={() => {
          console.log("Warning modal confirm action triggered");
          handleWarningConfirm();
        }}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to cancel?"
        confirmText="Yes, Cancel"
        cancelText="No, Keep Editing"
      />

      {/* Task Modal */}
      <Modal
        isOpen={showTaskModal}
        onClose={() => {
          console.log("Task modal onClose triggered");
          setShowTaskModal(false);
        }}
      >
        <CreateTaskForm
          initialData={
            editingTaskIndex !== null
              ? formData.tasks[editingTaskIndex]
              : undefined
          }
          onSubmit={(updatedTask) => {
            console.log("CreateTaskForm onSubmit called with:", updatedTask);
            handleUpdateTask(updatedTask);
          }}
          onCancel={() => {
            console.log("CreateTaskForm canceled. Closing task modal...");
            setShowTaskModal(false);
            setEditingTaskIndex(null);
          }}
        />
      </Modal>

      {/* Costs Creation Modal */}
      <Modal
        isOpen={showCostsModal}
        onClose={() => {
          console.log("Costs creation modal onClose triggered");
          setShowCostsModal(false);
        }}
      >
        <CreateCostsForm
          existingCosts={formData.otherCosts}
          onSubmit={(costs) => {
            console.log("New costs submitted from CreateCostsForm:", costs);
            handleAddCosts(costs);
            setShowCostsModal(false);
          }}
          onCancel={() => {
            console.log("CreateCostsForm canceled. Closing costs modal...");
            setShowCostsModal(false);
          }}
        />
      </Modal>

      {/* Delete Task Warning Modal */}
      <WarningModal
        isOpen={showDeleteTaskModal}
        onClose={() => {
          console.log("Delete task warning modal closed without confirmation");
          setShowDeleteTaskModal(false);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete Task"
        cancelText="Cancel"
      />

      {/* Quote Preview Modal */}
      <Modal
        isOpen={showQuoteModal}
        onClose={() => {
          console.log("Quote preview modal onClose triggered");
          setShowQuoteModal(false);
        }}
      >
        <QuotePreview projectData={formData} userDetails={userDetails} />
        <div className="sticky bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={() => {
              console.log("Closing quote preview modal...");
              setShowQuoteModal(false);
            }}
            type="button"
          >
            Close
          </Button>
        </div>
      </Modal>
    </form>
  );
};

CreateProjectForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  userDetails: PropTypes.shape({
    companyName: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    terms: PropTypes.string,
  }),
  initialData: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    customerName: PropTypes.string,
    hourlyRate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    hoursEstimate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tasks: PropTypes.array,
    otherCosts: PropTypes.array,
    totalCost: PropTypes.number,
    quoteNumber: PropTypes.string,
  }),
};

export default CreateProjectForm;
