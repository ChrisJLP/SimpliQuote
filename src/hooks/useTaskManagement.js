// hooks/useTaskManagement.js
import { useState, useCallback } from "react";

export const useTaskManagement = (onTasksChange) => {
  const [tasks, setTasks] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const handleAddTask = useCallback(
    (taskData) => {
      const newTask = {
        ...taskData,
        hoursEstimate: parseFloat(taskData.hoursEstimate) || 0,
        subtasks: taskData.subtasks.map((st) => ({
          ...st,
          hoursEstimate: parseFloat(st.hoursEstimate) || 0,
        })),
      };

      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks, newTask];
        onTasksChange?.(updatedTasks);
        return updatedTasks;
      });
    },
    [onTasksChange]
  );

  const handleRemoveTask = useCallback(
    (taskIndex) => {
      setTasks((prevTasks) => {
        const updatedTasks = prevTasks.filter(
          (_, index) => index !== taskIndex
        );
        onTasksChange?.(updatedTasks);
        return updatedTasks;
      });
    },
    [onTasksChange]
  );

  const handleEditTask = useCallback(
    (taskIndex, updatedTask) => {
      setTasks((prevTasks) => {
        const updatedTasks = prevTasks.map((task, index) =>
          index === taskIndex ? updatedTask : task
        );
        onTasksChange?.(updatedTasks);
        return updatedTasks;
      });
    },
    [onTasksChange]
  );

  return {
    tasks,
    showTaskModal,
    setShowTaskModal,
    handleAddTask,
    handleRemoveTask,
    handleEditTask,
  };
};
