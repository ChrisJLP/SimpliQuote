// hooks/useForm.js
import { useState, useCallback, useEffect } from "react";
import {
  calculateTotalCost,
  calculateProjectCost,
} from "../utils/calculateCost";

const DEFAULT_PROJECT_STATE = {
  name: "",
  customerName: "",
  hourlyRate: "",
  hoursEstimate: "",
  tasks: [],
  otherCosts: [],
  totalCost: 0,
  quoteNumber: "",
};

export const useProjectForm = (initialData = null) => {
  const [formData, setFormData] = useState({
    ...DEFAULT_PROJECT_STATE,
    ...initialData,
  });
  const [originalData, setOriginalData] = useState(
    initialData ? { ...initialData } : null
  );
  const [isDirty, setIsDirty] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [includeTasks, setIncludeTasks] = useState(
    initialData ? initialData.tasks?.length > 0 : false
  );
  const [savedTasks, setSavedTasks] = useState([]);
  const [previousHoursEstimate, setPreviousHoursEstimate] = useState("");
  const [showCostsModal, setShowCostsModal] = useState(false);

  useEffect(() => {
    if (JSON.stringify(initialData) !== JSON.stringify(originalData)) {
      setOriginalData(initialData ? { ...initialData } : null);
      setIsDirty(false);
    }
  }, [initialData, originalData]);

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      setFormData((prev) => {
        const updatedData = { ...prev, [name]: value };

        if (name === "hourlyRate" || name === "hoursEstimate") {
          return {
            ...updatedData,
            totalCost: !includeTasks
              ? calculateProjectCost(
                  updatedData.hourlyRate,
                  updatedData.hoursEstimate
                )
              : calculateTotalCost(
                  prev.tasks,
                  prev.otherCosts,
                  updatedData.hourlyRate
                ),
          };
        }
        return updatedData;
      });

      // Set isDirty only when value actually changes
      if (originalData && originalData[name] !== value) {
        setIsDirty(true);
      }
    },
    [includeTasks, originalData]
  );

  const handleAddTask = useCallback(
    (taskData) => {
      setFormData((prev) => {
        const updatedTasks = [...prev.tasks, taskData];
        if (originalData) setIsDirty(true);
        return {
          ...prev,
          tasks: updatedTasks,
          totalCost: calculateTotalCost(
            updatedTasks,
            prev.otherCosts,
            prev.hourlyRate
          ),
        };
      });
    },
    [originalData]
  );

  const handleAddCosts = useCallback(
    (costs) => {
      setFormData((prev) => {
        if (originalData) setIsDirty(true);
        return {
          ...prev,
          otherCosts: costs,
          totalCost: calculateTotalCost(prev.tasks, costs, prev.hourlyRate),
        };
      });
      setShowCostsModal(false);
    },
    [originalData]
  );

  const toggleTasks = useCallback(
    (enable) => {
      setIncludeTasks(enable);
      if (enable) {
        setPreviousHoursEstimate(formData.hoursEstimate);
        setFormData((prev) => {
          const updatedData = {
            ...prev,
            tasks: savedTasks,
            hoursEstimate: "",
          };
          return {
            ...updatedData,
            totalCost: calculateTotalCost(
              savedTasks,
              prev.otherCosts,
              prev.hourlyRate
            ),
          };
        });
      } else {
        setSavedTasks(formData.tasks);
        setFormData((prev) => ({
          ...prev,
          tasks: [],
          hoursEstimate: previousHoursEstimate,
          totalCost: calculateProjectCost(
            prev.hourlyRate,
            previousHoursEstimate
          ),
        }));
      }
      if (
        originalData &&
        JSON.stringify(originalData) !== JSON.stringify(formData)
      ) {
        setIsDirty(true);
      }
    },
    [formData, savedTasks, previousHoursEstimate, originalData]
  );

  const confirmCancel = useCallback(
    (onCancel) => {
      if (!originalData || (originalData && isDirty)) {
        setShowWarningModal(true);
        setPendingAction(() => onCancel);
      } else {
        onCancel();
      }
    },
    [originalData, isDirty]
  );

  const handleWarningClose = useCallback(() => {
    setShowWarningModal(false);
    setPendingAction(null);
  }, []);

  const handleWarningConfirm = useCallback(() => {
    if (pendingAction) {
      pendingAction();
    }
    handleWarningClose();
  }, [pendingAction, handleWarningClose]);

  return {
    formData,
    setFormData, // Exported here
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
    isExistingProject: !!originalData,
    isDirty,
  };
};

// Define DEFAULT_TASK_STATE
const DEFAULT_TASK_STATE = {
  name: "",
  hoursEstimate: "",
  otherCosts: [],
};

// Define useTaskForm
export const useTaskForm = (initialData = null) => {
  const [formData, setFormData] = useState({
    ...DEFAULT_TASK_STATE,
    ...initialData,
  });

  const [hasSubtasks, setHasSubtasks] = useState(
    initialData?.subtasks?.length > 0 || false
  );

  const [confirmedSubtasks, setConfirmedSubtasks] = useState(
    initialData?.subtasks || []
  );

  const [currentSubtask, setCurrentSubtask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSubtaskIndex, setEditingSubtaskIndex] = useState(null);
  const [showDeleteSubtaskModal, setShowDeleteSubtaskModal] = useState(false);
  const [subtaskToDelete, setSubtaskToDelete] = useState(null);
  const [subtaskError, setSubtaskError] = useState("");
  const [showCostsModal, setShowCostsModal] = useState(false);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const toggleSubtasks = useCallback((enable) => {
    setHasSubtasks(enable);
    if (!enable) {
      // Clear subtasks when disabling
      setConfirmedSubtasks([]);
    }
  }, []);

  const handleAddSubtask = useCallback(() => {
    setCurrentSubtask({ name: "", hoursEstimate: "" });
    setIsEditing(false);
    setEditingSubtaskIndex(null);
  }, []);

  const handleEditSubtask = useCallback(
    (index) => {
      const subtaskToEdit = confirmedSubtasks[index];
      setCurrentSubtask(subtaskToEdit);
      setIsEditing(true);
      setEditingSubtaskIndex(index);
    },
    [confirmedSubtasks]
  );

  const handleConfirmSubtask = useCallback((subtask) => {
    setConfirmedSubtasks((prev) => [...prev, subtask]);
    setCurrentSubtask(null);
  }, []);

  const handleUpdateSubtask = useCallback((index, updatedSubtask) => {
    setConfirmedSubtasks((prev) =>
      prev.map((subtask, i) => (i === index ? updatedSubtask : subtask))
    );
    setCurrentSubtask(null);
  }, []);

  const handleRemoveSubtask = useCallback((index) => {
    setConfirmedSubtasks((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleAddCosts = useCallback((costs) => {
    setFormData((prev) => ({
      ...prev,
      otherCosts: costs,
    }));
  }, []);

  return {
    formData,
    hasSubtasks,
    showCostsModal,
    setShowCostsModal,
    handleInputChange,
    handleAddCosts,
    toggleSubtasks,
    confirmedSubtasks,
    updateSubtasks: setConfirmedSubtasks,
    handleAddSubtask,
    handleEditSubtask,
    handleConfirmSubtask,
    handleUpdateSubtask,
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
  };
};
