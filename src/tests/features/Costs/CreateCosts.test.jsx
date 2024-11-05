import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CreateCostsForm from "../../../src/features/Costs/CreateCosts";

describe("CreateCostsForm Component", () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  const renderComponent = (props = {}) => {
    return render(
      <CreateCostsForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        {...props}
      />
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form with initial empty state", () => {
    renderComponent();
    expect(screen.getByText("Other Costs")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Category")).toBeInTheDocument();
    expect(screen.getByLabelText("Cost")).toBeInTheDocument();
  });

  it("adds a new cost when form is filled and add button is clicked", async () => {
    renderComponent();

    // Fill in the form
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Test Cost" },
    });
    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "Materials" },
    });
    fireEvent.change(screen.getByLabelText("Cost"), {
      target: { value: "100" },
    });

    // Click add button
    fireEvent.click(screen.getByText("Add cost to table"));

    // Check if cost appears in table
    expect(screen.getByText("Test Cost")).toBeInTheDocument();
    expect(screen.getByText("Materials")).toBeInTheDocument();
    expect(screen.getByText("£100.00")).toBeInTheDocument();
  });

  it("allows editing existing costs", async () => {
    renderComponent({
      existingCosts: [
        {
          id: 1,
          name: "Existing Cost",
          category: "Materials",
          amount: 100,
        },
      ],
    });

    // Click edit button
    fireEvent.click(screen.getByText("Edit"));

    // Check if form is populated with existing cost
    expect(screen.getByLabelText("Name")).toHaveValue("Existing Cost");
    expect(screen.getByLabelText("Cost")).toHaveValue(100);
  });

  it("removes a cost when remove button is clicked", async () => {
    renderComponent({
      existingCosts: [
        {
          id: 1,
          name: "Cost to Remove",
          category: "Materials",
          amount: 100,
        },
      ],
    });

    // Verify cost is initially present
    expect(screen.getByText("Cost to Remove")).toBeInTheDocument();

    // Click remove button
    fireEvent.click(screen.getByText("Remove"));

    // Verify cost is removed
    expect(screen.queryByText("Cost to Remove")).not.toBeInTheDocument();
  });

  it("submits costs when save button is clicked", async () => {
    renderComponent();

    // Add a cost
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Test Cost" },
    });
    fireEvent.change(screen.getByLabelText("Cost"), {
      target: { value: "100" },
    });
    fireEvent.click(screen.getByText("Add cost to table"));

    // Click save button
    fireEvent.click(screen.getByText("Save Costs"));

    // Check if onSubmit was called with correct data
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Test Cost",
          amount: 100,
        }),
      ])
    );
  });

  it("calls onCancel when cancel button is clicked", () => {
    renderComponent();
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnCancel).toHaveBeenCalled();
  });
});
