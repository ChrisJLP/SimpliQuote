import { describe, it, expect } from "vitest";
import {
  calculateTotalCost,
  calculateProjectCost,
  calculateTotalHours,
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

  describe("calculateTotalCost", () => {
    it("calculates total cost correctly with tasks and hourly rate", () => {
      const tasks = [
        { hoursEstimate: 5, subtasks: [] },
        {
          hoursEstimate: 7,
          subtasks: [{ hoursEstimate: 5 }, { hoursEstimate: 2 }],
        },
      ];
      const hourlyRate = 25;

      // Should be 12 hours * £25 = £300
      expect(calculateTotalCost(tasks, [], hourlyRate)).toBe(300);
    });

    it("includes other costs in total", () => {
      const tasks = [{ hoursEstimate: 2, subtasks: [] }];
      const otherCosts = [{ amount: 100 }, { amount: 50 }];
      const hourlyRate = 10;

      // Should be (2 hours * £10) + £150 = £170
      expect(calculateTotalCost(tasks, otherCosts, hourlyRate)).toBe(170);
    });
  });

  describe("calculateProjectCost", () => {
    it("calculates simple hourly rate * hours", () => {
      expect(calculateProjectCost(25, 12)).toBe(300);
    });
  });
});
