"use server";

import { and, eq } from "drizzle-orm";
import { db } from ".";
import { todos } from "./schema";

export async function getTodos(userId: typeof todos.$inferSelect.createdById) {
  const result = await db
    .select()
    .from(todos)
    .where(eq(todos.createdById, userId));

  if (!result) return { success: false, data: [] };

  return { success: true, data: result };
}

export async function toggleTodo(
  userId: typeof todos.$inferSelect.createdById,
  todoId: typeof todos.$inferSelect.id,
  completed: typeof todos.$inferSelect.completed,
) {
  const result = await db
    .update(todos)
    .set({ completed })
    .where(and(eq(todos.id, todoId), eq(todos.createdById, userId)));

  if (!result) return { success: false };

  return { success: true };
}
