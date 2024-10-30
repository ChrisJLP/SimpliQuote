import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import ProjectCard from "../../components/ProjectCard";

describe("ProjectCard Component", () => {
  const mockProps = {
    title: "Test Project",
    description: "Test Description",
  };

  beforeEach(() => {
    // Clean up before each test
    document.body.innerHTML = "";
  });

  it("renders title and description correctly", () => {
    render(<ProjectCard {...mockProps} />);

    expect(
      screen.getByRole("heading", { name: mockProps.title })
    ).toBeInTheDocument();
    expect(screen.getByText(mockProps.description)).toBeInTheDocument();
  });

  it("matches snapshot for styling", () => {
    const { container } = render(<ProjectCard {...mockProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("handles long content gracefully", () => {
    const longProps = {
      title: "A".repeat(50),
      description: "B".repeat(200),
    };

    render(<ProjectCard {...longProps} />);
    const card = screen
      .getByRole("heading", { name: longProps.title })
      .closest("div");

    expect(card).toHaveClass("overflow-auto");
  });

  it("maintains responsive design classes", () => {
    render(<ProjectCard {...mockProps} />);
    const card = screen
      .getByRole("heading", { name: mockProps.title })
      .closest("div");

    // Test for responsive classes
    expect(card.className).toMatch(/md:w-\[50vh\]/);
    expect(card.className).toMatch(/lg:w-\[50vh\]/);
  });
});
