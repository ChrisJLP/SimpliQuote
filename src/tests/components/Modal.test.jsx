import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Modal from "../../src/components/Modal";

describe("Modal Component", () => {
  it("renders nothing when isOpen is false", () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        Test Content
      </Modal>
    );
    expect(screen.queryByTestId("modal-overlay")).not.toBeInTheDocument();
  });

  it("renders content when isOpen is true", () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        Test Content
      </Modal>
    );
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("applies correct styling and ARIA attributes", () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        Test Content
      </Modal>
    );

    const overlay = screen.getByTestId("modal-overlay");

    // Check ARIA attributes
    expect(overlay).toHaveAttribute("role", "dialog");
    expect(overlay).toHaveAttribute("aria-modal", "true");

    // Check styling classes individually
    const expectedClasses = [
      "fixed",
      "inset-0",
      "bg-black",
      "bg-opacity-50",
      "flex",
      "items-center",
      "justify-center",
      "p-4",
      "z-50",
    ];

    expectedClasses.forEach((className) => {
      expect(overlay).toHaveClass(className);
    });
  });

  it("renders modal content with correct styling", () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        Test Content
      </Modal>
    );

    const content = screen.getByTestId("modal-content");
    const expectedContentClasses = [
      "bg-white",
      "rounded-lg",
      "shadow-xl",
      "p-6",
      "relative",
      "max-w-2xl",
      "w-full",
    ];

    expectedContentClasses.forEach((className) => {
      expect(content).toHaveClass(className);
    });
  });
});
