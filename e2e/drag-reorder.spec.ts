/**
 * E2E Tests: Drag to Reorder Feature
 *
 * Tests the drag-and-drop reordering functionality and persistence.
 */
import { test, expect } from "@playwright/test";
import { clearTodos, seedTodos } from "../db/seeds/todos";

test.describe("Drag to Reorder", () => {
  test.beforeEach(async () => {
    await clearTodos();
  });

  test("can drag todo to reorder and persists after refresh", async ({ page }) => {
    // Seed multiple todos
    await seedTodos([
      { description: "First task", completed: false },
      { description: "Second task", completed: false },
      { description: "Third task", completed: false },
    ]);

    await page.goto("/");

    // Verify initial order
    const todos = page.locator("li");
    await expect(todos.nth(0)).toContainText("First task");
    await expect(todos.nth(1)).toContainText("Second task");
    await expect(todos.nth(2)).toContainText("Third task");

    // Drag the first todo down to second position
    const firstTodo = todos.nth(0);
    const secondTodo = todos.nth(1);

    // Use dragTo to simulate drag and drop
    await firstTodo.dragTo(secondTodo);

    // Wait for reorder to complete (optimistic update)
    await page.waitForTimeout(500);

    // Verify new order
    await expect(todos.nth(0)).toContainText("Second task");
    await expect(todos.nth(1)).toContainText("First task");
    await expect(todos.nth(2)).toContainText("Third task");

    // Refresh the page
    await page.reload();

    // Verify order persists
    await expect(todos.nth(0)).toContainText("Second task");
    await expect(todos.nth(1)).toContainText("First task");
    await expect(todos.nth(2)).toContainText("Third task");
  });

  test("keyboard reorder with Alt+Arrow keys", async ({ page }) => {
    // Seed todos
    await seedTodos([
      { description: "Task A", completed: false },
      { description: "Task B", completed: false },
    ]);

    await page.goto("/");

    // Focus on first todo's drag handle
    const firstTodo = page.locator("li").nth(0);
    const dragHandle = firstTodo.locator("text=⋮⋮");
    await dragHandle.focus();

    // Press Alt+ArrowDown to move down
    await page.keyboard.press("Alt+ArrowDown");

    // Verify order changed
    await expect(page.locator("li").nth(0)).toContainText("Task B");
    await expect(page.locator("li").nth(1)).toContainText("Task A");

    // Refresh and verify persistence
    await page.reload();
    await expect(page.locator("li").nth(0)).toContainText("Task B");
    await expect(page.locator("li").nth(1)).toContainText("Task A");
  });
});
