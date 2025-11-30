"use server";

import { revalidatePath } from "next/cache";
import { eq, not, asc, sql } from "drizzle-orm";

import { db } from "@/db";
import { todosTable } from "@/db/schema";

export async function addTodo(formData: FormData) {
  const description = formData.get("description") as string;

  const [maxPosition] = await db.select({ max: sql`MAX(position)` }).from(todosTable);
  const newPosition = (maxPosition?.max ?? 0) + 1000;

  await db.insert(todosTable).values({
    description,
    position: newPosition,
  });

  revalidatePath("/");
}

export async function removeTodoAction(id: number) {
  await db.delete(todosTable).where(eq(todosTable.id, id));

  revalidatePath("/");
}

export async function toggleTodoAction(id: number) {
  await db
    .update(todosTable)
    .set({
      completed: not(todosTable.completed),
    })
    .where(eq(todosTable.id, id));

  revalidatePath("/");
}

export async function getTodos() {
  return await db.select().from(todosTable).orderBy(asc(todosTable.position), asc(todosTable.id));
}

export async function reorderTodosAction(todoId: number, newPosition: number) {
  await db.update(todosTable).set({ position: newPosition }).where(eq(todosTable.id, todoId));

  revalidatePath("/");
}
