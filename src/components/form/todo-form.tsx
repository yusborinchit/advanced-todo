"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, SendHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";
import { createTodoAction } from "~/actions";
import { type todos } from "~/server/db/schema";
import { createTodoFormSchema } from "~/zod-schemas";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

interface Props {
  parentId: typeof todos.$inferSelect.parentId;
}

export default function TodoForm({ parentId }: Readonly<Props>) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof createTodoFormSchema>>({
    resolver: zodResolver(createTodoFormSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(inputs: z.infer<typeof createTodoFormSchema>) {
    startTransition(async () => {
      const { success } = await createTodoAction(inputs, parentId);
      if (success) {
        router.refresh();
        form.reset();
        toast.success("Todo created successfully", { position: "top-center" });
      } else {
        toast.error("Something went wrong, please try again", {
          position: "top-center",
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="my-2 flex">
        <input type="hidden" name="parentId" value={parentId} />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input placeholder="Type here..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          size="icon"
          aria-label={isPending ? "Saving..." : "Create Todo"}
          disabled={isPending}
          variant="link"
          type="submit"
        >
          {isPending ? (
            <Loader2 className="!size-4 animate-spin" />
          ) : (
            <SendHorizontal className="!size-4" />
          )}
        </Button>
      </form>
    </Form>
  );
}
