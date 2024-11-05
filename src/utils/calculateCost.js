// Calculate total hours from tasks and their subtasks
export const calculateTotalHours = (tasks = []) => {
  return tasks.reduce((total, task) => {
    if (task.subtasks && task.subtasks.length > 0) {
      // If task has subtasks, only count subtask hours
      const subtaskHours = task.subtasks.reduce((sum, subtask) => {
        return sum + (parseFloat(subtask.hoursEstimate) || 0);
      }, 0);
      return total + subtaskHours;
    } else {
      // If task has no subtasks, count task hours
      return total + (parseFloat(task.hoursEstimate) || 0);
    }
  }, 0);
};

// Calculate the total cost of other costs
export const calculateOtherCostsTotal = (costs = []) => {
  return costs.reduce((total, cost) => {
    return total + (parseFloat(cost.amount) || 0);
  }, 0);
};

// Calculate total project cost including tasks and other costs
export const calculateTotalCost = (
  tasks = [],
  otherCosts = [],
  hourlyRate = 0
) => {
  const totalHours = calculateTotalHours(tasks);
  const laborCost = totalHours * (parseFloat(hourlyRate) || 0);
  const otherCostsTotal = calculateOtherCostsTotal(otherCosts);

  return laborCost + otherCostsTotal;
};

// Calculate simple project cost without tasks
export const calculateProjectCost = (hourlyRate = 0, hoursEstimate = 0) => {
  const rate = parseFloat(hourlyRate) || 0;
  const hours = parseFloat(hoursEstimate) || 0;
  return rate * hours;
};
