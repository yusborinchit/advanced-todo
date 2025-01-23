import { z } from "zod";

export const createTodoFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "The todo is too short (Min 1)" })
    .max(256, { message: "The todo is too long (Max 256)" }),
});
