"use client";

import { useOptimistic, useId, useTransition } from "react";
import { InferSelectModel } from "drizzle-orm";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import { todosTable } from "@/db/schema";
import { Todo as TodoComponent } from "./todo";
import { Form } from "./form";
import { reorderTodosAction } from "./actions";

type Todo = InferSelectModel<typeof todosTable>;

export function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  const dndContextId = useId();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [, startTransition] = useTransition();

  const [optimisticTodos, setOptimisticTodos] = useOptimistic<
    Todo[],
    { action: "add" | "remove" | "toggle" | "reorder"; todo: Todo; newIndex?: number }
  >(initialTodos, (state, { action, todo, newIndex }) => {
    switch (action) {
      case "add":
        return [...state, todo];
      case "remove":
        return state.filter((t) => t.id !== todo.id);
      case "toggle":
        return state.map((t) => (t.id === todo.id ? { ...t, completed: !t.completed } : t));
      case "reorder":
        if (newIndex === undefined) return state;
        const reordered = [...state];
        const oldIndex = reordered.findIndex((t) => t.id === todo.id);
        if (oldIndex === -1) return state;
        const [removed] = reordered.splice(oldIndex, 1);
        reordered.splice(newIndex, 0, removed);
        return reordered;
    }
  });

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = optimisticTodos.findIndex((t) => t.id === active.id);
    const newIndex = optimisticTodos.findIndex((t) => t.id === over.id);

    // Calculate new position
    const movedTodo = optimisticTodos[oldIndex];
    const newPosition = calculateNewPosition(optimisticTodos, oldIndex, newIndex);

    // Optimistic update + persist to database (wrapped in startTransition via server action)
    startTransition(async () => {
      setOptimisticTodos({ action: "reorder", todo: movedTodo, newIndex });
      await reorderTodosAction(active.id as number, newPosition);
    });
  };

  const calculateNewPosition = (todos: Todo[], fromIndex: number, toIndex: number): number => {
    if (toIndex > fromIndex) {
      // Moving down
      const before = todos[toIndex];
      const after = todos[toIndex + 1];
      if (!after) {
        return before.position + 1000;
      }
      return Math.floor((before.position + after.position) / 2);
    } else {
      // Moving up
      const after = todos[toIndex];
      const before = todos[toIndex - 1];
      if (!before) {
        return Math.floor(after.position / 2);
      }
      return Math.floor((before.position + after.position) / 2);
    }
  };

  return (
    <div className="divide-y divide-slate-100">
      {/* Screen reader announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only"></div>

      {/* Empty State */}
      {optimisticTodos.length === 0 && (
        <div className="py-12 text-center">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <span className="text-2xl">📝</span>
          </div>
          <p className="text-slate-500">No todos yet. Add one below!</p>
        </div>
      )}

      {/* Todo Items */}
      <DndContext
        id={dndContextId}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={optimisticTodos.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="divide-y divide-slate-100">
            {optimisticTodos.map((todo) => (
              <TodoComponent key={todo.id} item={todo} allTodos={optimisticTodos} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      {/* Add Todo Form */}
      <Form />
    </div>
  );
}
