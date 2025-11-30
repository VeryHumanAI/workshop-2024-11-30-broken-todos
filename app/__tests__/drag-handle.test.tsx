/**
 * DragHandle Component Unit Tests
 *
 * Tests the drag handle component that provides the grip icon for dragging todos.
 */

import { render, screen } from "@testing-library/react";
import { DragHandle } from "../drag-handle";

describe("DragHandle", () => {
  it("renders a grip icon", () => {
    // Act
    render(<DragHandle />);

    // Assert: Should render the grip icon (⋮⋮)
    expect(screen.getByText("⋮⋮")).toBeInTheDocument();
  });

  it("has correct aria-label for accessibility", () => {
    // Act
    render(<DragHandle />);

    // Assert: Should have aria-label for screen readers
    const handle = screen.getByLabelText("Drag to reorder");
    expect(handle).toBeInTheDocument();
  });

  it("has grab cursor on hover", () => {
    // Act
    render(<DragHandle />);

    // Assert: Should have cursor-grab class or style
    const handle = screen.getByText("⋮⋮");
    expect(handle).toHaveClass("cursor-grab");
  });
});
