import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Button from "../../../src/components/Button";

describe("Button Component", () => {
  it("renders children correctly", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: /click me/i })
    ).toBeInTheDocument();
  });

  it("handles click events", async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button");
    await fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it.each([
    ["primary", "bg-[#4CAF50] text-white hover:bg-[#45A049]"],
    ["secondary", "bg-slate-600 text-white hover:bg-slate-700"],
    ["outline", "border hover:bg-gray-100"],
  ])("applies %s variant styles correctly", (variant, expectedClasses) => {
    render(<Button variant={variant}>Test Button</Button>);
    const button = screen.getByRole("button");
    expectedClasses.split(" ").forEach((className) => {
      expect(button.className).toContain(className);
    });
  });

  it("combines custom className with default styles", () => {
    const customClass = "test-custom-class";
    render(<Button className={customClass}>Custom Button</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain(customClass);
    expect(button.className).toContain("px-6 py-2 rounded");
  });

  it("renders with correct type attribute", () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });
});
