import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import FormInput from "../../components/FormInput";

describe("FormInput Component", () => {
  it("calls onChange when value changes", () => {
    const handleChange = vi.fn();

    render(
      <FormInput label="Test" name="test" value="" onChange={handleChange} />
    );

    const input = screen.getByRole("textbox");
    fireEvent.input(input, { target: { value: "test value" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("calls onChange with correct value", () => {
    const handleChange = vi.fn();

    render(
      <FormInput label="Test" name="test" value="" onChange={handleChange} />
    );

    const input = screen.getByRole("textbox");
    const newValue = "test value";

    fireEvent.change(input, {
      target: {
        value: newValue,
        name: "test",
      },
    });

    expect(handleChange).toHaveBeenCalledTimes(1);
    const event = handleChange.mock.calls[0][0];
    expect(event.target.name).toBe("test");
    expect(event.target.value).toBe(newValue);
  });

  it("renders with required label", () => {
    render(
      <FormInput
        label="Test Label"
        name="test"
        value=""
        onChange={() => {}}
        required
      />
    );

    expect(screen.getByText("Test Label *")).toBeInTheDocument();
  });

  it("renders with prefix", () => {
    render(
      <FormInput
        label="Test Label"
        name="test"
        value=""
        onChange={() => {}}
        prefix="£"
      />
    );

    expect(screen.getByText("£")).toBeInTheDocument();
  });

  it("applies number input attributes", () => {
    render(
      <FormInput
        label="Number Input"
        name="test"
        value=""
        onChange={() => {}}
        type="number"
        min="0"
        step="0.5"
      />
    );

    const input = screen.getByRole("spinbutton");
    expect(input).toHaveAttribute("type", "number");
    expect(input).toHaveAttribute("min", "0");
    expect(input).toHaveAttribute("step", "0.5");
  });

  it("functions as a controlled component", () => {
    const handleChange = vi.fn();
    const { rerender } = render(
      <FormInput
        label="Test"
        name="test"
        value="initial"
        onChange={handleChange}
      />
    );

    const input = screen.getByRole("textbox");
    expect(input.value).toBe("initial");

    // Rerender with new value
    rerender(
      <FormInput
        label="Test"
        name="test"
        value="updated"
        onChange={handleChange}
      />
    );

    expect(input.value).toBe("updated");
  });
});
