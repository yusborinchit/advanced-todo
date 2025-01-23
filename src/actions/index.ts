"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "~/server/auth";
import { createTodo, deleteTodo, toggleTodo } from "~/server/db/queries";
import { type todos } from "~/server/db/schema";
import { createTodoFormSchema } from "~/zod-schemas";

export async function createTodoAction(
  input: z.infer<typeof createTodoFormSchema>,
  parentId: typeof todos.$inferSelect.parentId,
) {
  const { success, data } = createTodoFormSchema.safeParse(input);
  if (!success) return { success: false };

  const session = await auth();
  if (!session) return { success: false };

  const { success: dbSuccess } = await createTodo(
    session.user.id,
    parentId,
    data.name,
  );
  if (!dbSuccess) return { success: false };

  revalidatePath("/");

  return { success: true };
}

export async function deleteTodoAction(todoId: typeof todos.$inferSelect.id) {
  const { success } = z
    .number({ message: "Invalid Todo ID" })
    .safeParse(todoId);
  if (!success) return { success: false };

  const session = await auth();
  if (!session) return { success: false };

  const { success: dbSuccess } = await deleteTodo(session.user.id, todoId);
  if (!dbSuccess) return { success: false };

  revalidatePath("/");

  return { success: true };
}

export async function toggleTodoAction(
  todoId: typeof todos.$inferSelect.id,
  completed: typeof todos.$inferSelect.completed,
) {
  const { success } = z
    .object({
      todoId: z.number({ message: "Invalid Todo ID" }),
      completed: z.boolean({ message: "Invalid Todo Status" }),
    })
    .safeParse({ todoId, completed });
  if (!success) return { success: false };

  const session = await auth();
  if (!session) return { success: false };

  const { success: dbSuccess } = await toggleTodo(
    session.user.id,
    todoId,
    completed,
  );
  if (!dbSuccess) return { success: false };

  revalidatePath("/");

  return { success: true };
}
