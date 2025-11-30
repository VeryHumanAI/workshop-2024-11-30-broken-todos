"use client";

import { useOptimistic } from "react";
import { InferSelectModel } from "drizzle-orm";

import { todosTable } from "@/db/schema";
import { Todo as TodoComponent } from "./todo";
import { Form } from "./form";

type Todo = InferSelectModel<typeof todosTable>;

export function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  const [optimisticTodos] = useOptimistic<
    Todo[],
    { action: "add" | "remove" | "toggle"; todo: Todo }
  >(initialTodos, (state, { action, todo }) => {
    switch (action) {
      case "add":
        return [...state, todo];
      case "remove":
        return state.filter((t) => t.id !== todo.id);
      case "toggle":
        return state.map((t) => (t.id === todo.id ? { ...t, completed: !t.completed } : t));
    }
  });

  return (
    <div className="divide-y divide-slate-100">
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
      <ul className="divide-y divide-slate-100">
        {optimisticTodos.map((todo) => (
          <TodoComponent key={todo.id} item={todo} />
        ))}
      </ul>

      {/* Add Todo Form */}
      <Form />
    </div>
  );
}
