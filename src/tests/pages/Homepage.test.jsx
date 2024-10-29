import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Homepage from "../../pages/Homepage";

describe("Homepage Component", () => {
  // Test if the component renders
  it("renders Homepage component", () => {
    render(<Homepage />);
    expect(screen.getByText("SimpliQuote")).toBeInTheDocument();
  });

  // Test if headings are rendered with correct text
  it("renders headings correctly", () => {
    render(<Homepage />);
    expect(
      screen.getByRole("heading", { name: /SimpliQuote/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Projects/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Example Project/i })
    ).toBeInTheDocument();
  });

  // Test if the button is rendered and can be clicked
  it("renders 'Create a new project' button and tests clicking", () => {
    render(<Homepage />);
    const button = screen.getByRole("button", {
      name: /Create a new project/i,
    });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
  });
});
