"use client";

import { ChevronDown, ChevronRight, Loader2, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteTodoAction, toggleTodoAction } from "~/actions";
import { type todos } from "~/server/db/schema";
import TodoForm from "./form/todo-form";
import { Checkbox } from "./ui/checkbox";

interface Props {
  todos: (typeof todos.$inferSelect)[];
  todo: typeof todos.$inferSelect;
}

export default function Todo({ todos, todo }: Readonly<Props>) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [isExpanded, setIsExpanded] = useState(false);
  const children = todos.filter((t) => t.parentId === todo.id);

  async function onDelete() {
    startTransition(async () => {
      const { success } = await deleteTodoAction(todo.id);

      if (success) {
        router.refresh();
        toast.success("Todo deleted successfully", {
          position: "top-center",
        });
      } else {
        toast.error("Something went wrong, please try again", {
          position: "top-center",
        });
      }
    });
  }

  async function onToggle() {
    startTransition(async () => {
      const { success } = await toggleTodoAction(todo.id, !todo.completed);

      if (success) {
        router.refresh();
      } else {
        toast.error("Something went wrong, please try again", {
          position: "top-center",
        });
      }
    });
  }

  return (
    <>
      <li
        data-completed={todo.completed}
        className="group flex items-center gap-2"
      >
        <button onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? (
            <ChevronDown className="size-5 opacity-25" />
          ) : (
            <ChevronRight className="size-5 opacity-25" />
          )}
        </button>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Checkbox
            id={`${todo.id}`}
            onCheckedChange={onToggle}
            checked={todo.completed}
            className="hover:cursor-pointer"
          />
        )}
        <label
          htmlFor={`${todo.id}`}
          className="w-full py-2 hover:cursor-pointer"
        >
          <span className="group-data-[completed=true]:line-through">
            {todo.name}
          </span>
          {isPending && (
            <span className="ml-2 text-sm text-neutral-300">Saving...</span>
          )}
        </label>
        <button aria-label="Delete" onClick={onDelete} className="text-red-500">
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Trash className="size-4" />
          )}
        </button>
      </li>
      {isExpanded && (
        <div className="ml-8 flex flex-col">
          <TodoForm parentId={todo.id} />
          {children.map((t) => (
            <Todo key={t.id} todos={todos} todo={t} />
          ))}
        </div>
      )}
    </>
  );
}
