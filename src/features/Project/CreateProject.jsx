import React from "react";
import PropTypes from "prop-types";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import FormInput from "../../components/FormInput";
import CreateTaskForm from "../Task/CreateTask";
import CreateCostsForm from "../Costs/CreateCosts";
import { useProjectForm } from "../../hooks/useForm";

const CreateProjectForm = ({ onSubmit, onCancel }) => {
  const {
    formData,
    includeTasks,
    showCostsModal,
    setShowCostsModal,
    handleInputChange,
    handleAddTask: originalHandleAddTask,
    handleAddCosts,
    toggleTasks,
  } = useProjectForm();

  const [showTaskModal, setShowTaskModal] = React.useState(false);

  const handleAddTask = (taskData) => {
    originalHandleAddTask(taskData);
    setShowTaskModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-y-auto p-6 pb-24">
        <h2 className="text-2xl font-medium mb-6">Create a Project</h2>

        <form className="space-y-6">
          {/* Project Name Input */}
          <FormInput
            label="Project name"
            name="name"
            value={formData.name}
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
                onChange={(e) => toggleTasks(e.target.checked)}
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
                  onClick={() => setShowCostsModal(true)}
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

              {/* Display Other Costs */}
              {formData.otherCosts.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-base font-medium mb-2">Other Costs</h3>
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
          <div className="text-center">
            Total cost: £{formData.totalCost.toFixed(2)}
          </div>

          {/* View Summary Button */}
          <div className="flex justify-center">
            <Button variant="secondary" className="px-6 py-3">
              View project summary
            </Button>
          </div>
        </form>
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 mt-auto flex justify-end space-x-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Create Project
        </Button>
      </div>

      {/* Task Creation Modal */}
      <Modal isOpen={showTaskModal} onClose={() => setShowTaskModal(false)}>
        <CreateTaskForm
          onSubmit={handleAddTask}
          onCancel={() => setShowTaskModal(false)}
        />
      </Modal>

      {/* Costs Creation Modal */}
      <Modal isOpen={showCostsModal} onClose={() => setShowCostsModal(false)}>
        <CreateCostsForm
          existingCosts={formData.otherCosts}
          onSubmit={handleAddCosts}
          onCancel={() => setShowCostsModal(false)}
        />
      </Modal>
    </div>
  );
};

CreateProjectForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default CreateProjectForm;
