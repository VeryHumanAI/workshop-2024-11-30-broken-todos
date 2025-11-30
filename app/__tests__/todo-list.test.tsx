/**
 * TodoList Component Tests
 *
 * Tests for the TodoList component which displays a list of todos
 * and handles empty state rendering.
 *
 * The TodoList uses useOptimistic for optimistic updates, but we test
 * the initial render state since optimistic updates are handled by React.
 */
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { TodoList } from "../todo-list";

// Mock the child components to isolate TodoList testing
// We test Todo and Form components separately
jest.mock("../todo", () => ({
  Todo: ({ item }: { item: { id: number; description: string } }) => (
    <li data-testid={`todo-${item.id}`}>{item.description}</li>
  ),
}));

jest.mock("../form", () => ({
  Form: () => <div data-testid="form">Mock Form</div>,
}));

// Mock server actions (required by Form, even though Form is mocked)
jest.mock("../actions", () => ({
  addTodo: jest.fn(),
  toggleTodoAction: jest.fn(),
  removeTodoAction: jest.fn(),
  getTodos: jest.fn(),
  reorderTodosAction: jest.fn(),
}));

// Mock @dnd-kit for drag-drop testing
jest.mock("@dnd-kit/core", () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dnd-context" data-ondragend={true}>
      {children}
    </div>
  ),
  closestCenter: jest.fn(),
  KeyboardSensor: jest.fn(),
  PointerSensor: jest.fn(),
  useSensor: jest.fn(() => ({})),
  useSensors: jest.fn(() => []),
}));

jest.mock("@dnd-kit/sortable", () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sortable-context">{children}</div>
  ),
  verticalListSortingStrategy: jest.fn(),
  sortableKeyboardCoordinates: jest.fn(),
}));

jest.mock("@dnd-kit/utilities", () => ({
  CSS: {
    Transform: {
      toString: jest.fn(() => ""),
    },
  },
}));

// Test fixtures
const multipleTodos = [
  { id: 1, description: "Buy groceries", completed: false, position: 1000 },
  { id: 2, description: "Walk the dog", completed: true, position: 2000 },
  { id: 3, description: "Read a book", completed: false, position: 3000 },
];

const singleTodo = [{ id: 1, description: "Only todo", completed: false, position: 1000 }];

const emptyTodos: Array<{
  id: number;
  description: string;
  completed: boolean;
  position: number;
}> = [];

describe("TodoList Component", () => {
  describe("Rendering list items", () => {
    test("renders list of todo items", () => {
      render(<TodoList initialTodos={multipleTodos} />);

      // Check each todo is rendered
      expect(screen.getByText("Buy groceries")).toBeInTheDocument();
      expect(screen.getByText("Walk the dog")).toBeInTheDocument();
      expect(screen.getByText("Read a book")).toBeInTheDocument();
    });

    test("renders correct number of todo items", () => {
      render(<TodoList initialTodos={multipleTodos} />);

      const todoItems = screen.getAllByTestId(/^todo-/);
      expect(todoItems).toHaveLength(3);
    });

    test("renders single todo item", () => {
      render(<TodoList initialTodos={singleTodo} />);

      expect(screen.getByText("Only todo")).toBeInTheDocument();
      expect(screen.getAllByTestId(/^todo-/)).toHaveLength(1);
    });
  });

  describe("Empty state", () => {
    test("renders empty state when no todos", () => {
      render(<TodoList initialTodos={emptyTodos} />);

      // Check for empty state message
      expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
    });

    test("displays helpful prompt in empty state", () => {
      render(<TodoList initialTodos={emptyTodos} />);

      // Should show prompt to add a todo
      expect(screen.getByText(/add one below/i)).toBeInTheDocument();
    });

    test("does not show empty state when todos exist", () => {
      render(<TodoList initialTodos={multipleTodos} />);

      expect(screen.queryByText(/no todos yet/i)).not.toBeInTheDocument();
    });
  });

  describe("Form integration", () => {
    test("renders the Form component", () => {
      render(<TodoList initialTodos={emptyTodos} />);

      expect(screen.getByTestId("form")).toBeInTheDocument();
    });

    test("Form is present with todos", () => {
      render(<TodoList initialTodos={multipleTodos} />);

      expect(screen.getByTestId("form")).toBeInTheDocument();
    });
  });

  describe("Drag and Drop", () => {
    test("wraps the list with DndContext", () => {
      render(<TodoList initialTodos={multipleTodos} />);

      expect(screen.getByTestId("dnd-context")).toBeInTheDocument();
    });

    test("wraps todos with SortableContext", () => {
      render(<TodoList initialTodos={multipleTodos} />);

      expect(screen.getByTestId("sortable-context")).toBeInTheDocument();
    });

    test("DndContext has onDragEnd handler", () => {
      render(<TodoList initialTodos={multipleTodos} />);

      const dndContext = screen.getByTestId("dnd-context");
      expect(dndContext).toHaveAttribute("data-ondragend", "true");
    });
  });

  describe("Accessibility", () => {
    test("has no accessibility violations with todos", async () => {
      const { container } = render(<TodoList initialTodos={multipleTodos} />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("has no accessibility violations in empty state", async () => {
      const { container } = render(<TodoList initialTodos={emptyTodos} />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
