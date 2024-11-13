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
    setOriginalData(initialData ? { ...initialData } : null);
    setIsDirty(false);
  }, [initialData]);

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

      if (originalData) {
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
      if (originalData) setIsDirty(true);
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

export const useTaskForm = (initialData = null) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    hoursEstimate: initialData?.hoursEstimate || "",
    subtasks: initialData?.subtasks || [],
    otherCosts: initialData?.otherCosts || [],
  });

  const [hasSubtasks, setHasSubtasks] = useState(
    initialData?.subtasks?.length > 0
  );
  const [showCostsModal, setShowCostsModal] = useState(false);
  const [confirmedSubtasks, setConfirmedSubtasks] = useState(
    initialData?.subtasks || []
  );
  const [previousHoursEstimate, setPreviousHoursEstimate] = useState("");

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleAddCosts = useCallback((costs) => {
    setFormData((prev) => ({
      ...prev,
      otherCosts: costs.map((cost) => ({
        ...cost,
        amount: parseFloat(cost.amount) || 0,
      })),
    }));
    setShowCostsModal(false);
  }, []);

  const updateSubtasks = useCallback((newSubtasks) => {
    setConfirmedSubtasks(newSubtasks);
    setFormData((prev) => ({
      ...prev,
      subtasks: newSubtasks,
    }));
  }, []);

  const handleEditSubtask = useCallback(
    (index) => {
      const subtaskToEdit = { ...confirmedSubtasks[index], index };
      return subtaskToEdit;
    },
    [confirmedSubtasks]
  );

  const handleConfirmSubtask = useCallback(
    (subtask) => {
      if (subtask && subtask.name && subtask.hoursEstimate) {
        const newSubtask = {
          ...subtask,
          hoursEstimate: parseFloat(subtask.hoursEstimate) || 0,
        };
        const newSubtasks = [...confirmedSubtasks, newSubtask];
        setConfirmedSubtasks(newSubtasks);
        setFormData((prev) => ({
          ...prev,
          subtasks: newSubtasks,
        }));
        return true;
      }
      return false;
    },
    [confirmedSubtasks]
  );

  const handleRemoveSubtask = useCallback(
    (index) => {
      const newSubtasks = [...confirmedSubtasks];
      newSubtasks.splice(index, 1);
      updateSubtasks(newSubtasks);
    },
    [confirmedSubtasks, updateSubtasks]
  );

  const toggleSubtasks = useCallback(
    (enable) => {
      setHasSubtasks(enable);
      if (enable) {
        setPreviousHoursEstimate(formData.hoursEstimate);
        setFormData((prev) => ({
          ...prev,
          subtasks: confirmedSubtasks,
          hoursEstimate: "",
        }));
      } else {
        setConfirmedSubtasks(formData.subtasks);
        setFormData((prev) => ({
          ...prev,
          subtasks: [],
          hoursEstimate: previousHoursEstimate,
        }));
      }
    },
    [formData, confirmedSubtasks, previousHoursEstimate]
  );

  return {
    formData,
    hasSubtasks,
    showCostsModal,
    setShowCostsModal,
    handleInputChange,
    handleAddCosts,
    toggleSubtasks,
    setFormData,
    confirmedSubtasks,
    updateSubtasks,
    handleEditSubtask,
    handleConfirmSubtask,
    handleRemoveSubtask,
  };
};
