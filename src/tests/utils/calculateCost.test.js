import { describe, it, expect } from "vitest";
import {
  calculateTotalCost,
  calculateProjectCost,
  calculateTotalHours,
  calculateTaskCostsTotal,
  calculateOtherCostsTotal,
} from "../../utils/calculateCost";

describe("Cost Calculation Utilities", () => {
  describe("calculateTotalHours", () => {
    it("calculates hours correctly with mixed tasks", () => {
      const tasks = [
        // Task with no subtasks
        {
          hoursEstimate: 5,
          subtasks: [],
        },
        // Task with subtasks - should only count subtask hours
        {
          hoursEstimate: 7,
          subtasks: [{ hoursEstimate: 5 }, { hoursEstimate: 2 }],
        },
      ];

      // Should be 5 (first task) + (5 + 2) (subtasks) = 12 hours
      expect(calculateTotalHours(tasks)).toBe(12);
    });

    it("handles invalid or missing values", () => {
      const tasks = [
        { hoursEstimate: "invalid", subtasks: [] },
        { hoursEstimate: undefined, subtasks: [] },
        {
          hoursEstimate: 10,
          subtasks: [{ hoursEstimate: "invalid" }, { hoursEstimate: 2 }],
        },
      ];

      // Should only count valid numbers
      expect(calculateTotalHours(tasks)).toBe(2);
    });
  });

  describe("calculateTaskCostsTotal", () => {
    it("calculates total costs from all tasks", () => {
      const tasks = [
        {
          hoursEstimate: 5,
          otherCosts: [{ amount: 100 }, { amount: 50 }],
        },
        {
          hoursEstimate: 3,
          otherCosts: [{ amount: 75 }],
        },
      ];

      // Should be (100 + 50) + 75 = 225
      expect(calculateTaskCostsTotal(tasks)).toBe(225);
    });

    it("handles tasks without other costs", () => {
      const tasks = [
        { hoursEstimate: 5 },
        { hoursEstimate: 3, otherCosts: [] },
      ];

      expect(calculateTaskCostsTotal(tasks)).toBe(0);
    });
  });

  describe("calculateTotalCost", () => {
    it("calculates total cost including labor, project costs, and task costs", () => {
      const tasks = [
        {
          hoursEstimate: 5,
          subtasks: [],
          otherCosts: [{ amount: 100 }, { amount: 50 }],
        },
        {
          hoursEstimate: 7,
          subtasks: [{ hoursEstimate: 5 }, { hoursEstimate: 2 }],
          otherCosts: [{ amount: 75 }],
        },
      ];
      const projectCosts = [{ amount: 200 }];
      const hourlyRate = 25;

      // Labor cost: 12 hours * £25 = £300
      // Project costs: £200
      // Task costs: (100 + 50 + 75) = £225
      // Total: £725
      expect(calculateTotalCost(tasks, projectCosts, hourlyRate)).toBe(725);
    });

    it("handles missing cost arrays", () => {
      const tasks = [
        {
          hoursEstimate: 2,
          subtasks: [],
        },
      ];
      const hourlyRate = 10;

      // Should be just labor cost: 2 * 10 = 20
      expect(calculateTotalCost(tasks, undefined, hourlyRate)).toBe(20);
    });
  });

  describe("calculateProjectCost", () => {
    it("calculates simple hourly rate * hours", () => {
      expect(calculateProjectCost(25, 12)).toBe(300);
    });
  });
});
