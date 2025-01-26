"use server";

import { and, desc, eq, or } from "drizzle-orm";
import { db } from ".";
import { todos } from "./schema";

export async function getTodos(userId: typeof todos.$inferSelect.createdById) {
  const result = await db
    .select()
    .from(todos)
    .where(eq(todos.createdById, userId))
    .orderBy(desc(todos.createdAt));

  if (!result) return { success: false, data: [] };

  return { success: true, data: result };
}

export async function deleteTodo(
  userId: typeof todos.$inferSelect.createdById,
  todoId: typeof todos.$inferSelect.id,
) {
  const result = await db
    .delete(todos)
    .where(
      and(
        or(eq(todos.id, todoId), eq(todos.parentId, todoId)),
        eq(todos.createdById, userId),
      ),
    )
    .returning();

  if (!result) return { success: false };

  return { success: true };
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

export async function createTodo(
  userId: typeof todos.$inferSelect.createdById,
  parentId: typeof todos.$inferSelect.parentId,
  name: typeof todos.$inferSelect.name,
) {
  const result = await db
    .insert(todos)
    .values({ createdById: userId, parentId, name })
    .returning();

  if (!result) return { success: false };

  return { success: true };
}
