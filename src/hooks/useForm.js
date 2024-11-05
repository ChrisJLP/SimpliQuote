import { useState, useCallback } from "react";
import {
  calculateTotalCost,
  calculateProjectCost,
} from "../utils/calculateCost";

export const useProjectForm = (initialData = {}) => {
  const [formData, setFormData] = useState({
    name: "",
    hourlyRate: "",
    hoursEstimate: "",
    tasks: [],
    otherCosts: [],
    totalCost: 0,
    ...initialData,
  });

  const [includeTasks, setIncludeTasks] = useState(false);
  const [savedTasks, setSavedTasks] = useState([]);
  const [previousHoursEstimate, setPreviousHoursEstimate] = useState("");
  const [showCostsModal, setShowCostsModal] = useState(false);

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      setFormData((prev) => {
        const updatedData = {
          ...prev,
          [name]: value,
        };

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
    },
    [includeTasks]
  );

  const handleAddTask = useCallback((taskData) => {
    setFormData((prev) => {
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
  }, []);

  const handleAddCosts = useCallback((costs) => {
    setFormData((prev) => {
      const updatedCosts = costs.map((cost) => ({
        ...cost,
        amount: parseFloat(cost.amount) || 0,
      }));

      const newTotalCost = calculateTotalCost(
        prev.tasks,
        updatedCosts,
        prev.hourlyRate
      );

      return {
        ...prev,
        otherCosts: updatedCosts,
        totalCost: newTotalCost,
      };
    });
    setShowCostsModal(false);
  }, []);

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
    },
    [formData, savedTasks, previousHoursEstimate]
  );

  return {
    formData,
    includeTasks,
    showCostsModal,
    setShowCostsModal,
    handleInputChange,
    handleAddTask,
    handleAddCosts,
    toggleTasks,
    setFormData,
  };
};

export const useTaskForm = (initialData = {}) => {
  const [formData, setFormData] = useState({
    name: "",
    hoursEstimate: "",
    subtasks: [],
    otherCosts: [],
    ...initialData,
  });

  const [hasSubtasks, setHasSubtasks] = useState(false);
  const [showCostsModal, setShowCostsModal] = useState(false);
  const [confirmedSubtasks, setConfirmedSubtasks] = useState([]);
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
    setConfirmedSubtasks,
  };
};
