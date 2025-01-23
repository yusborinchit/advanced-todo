"use server";

import { revalidatePath } from "next/cache";
import { type z } from "zod";
import { auth } from "~/server/auth";
import { createTodo } from "~/server/db/queries";
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
