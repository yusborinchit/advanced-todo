"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toggleTodo } from "~/server/db/queries";
import { type todos } from "~/server/db/schema";

interface Props {
  todos: (typeof todos.$inferSelect)[];
  todo: typeof todos.$inferSelect;
}

export default function Todo({ todos, todo }: Readonly<Props>) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [isCompleted, setIsCompleted] = useState(todo.completed);

  const children = todos.filter((t) => t.parentId === todo.id);

  async function onToggle() {
    setIsCompleted(!todo.completed);

    startTransition(async () => {
      const { success } = await toggleTodo(
        todo.createdById,
        todo.id,
        !todo.completed,
      );

      if (success) {
        router.refresh();
      } else {
        setIsCompleted(todo.completed);
      }
    });
  }

  return (
    <>
      <li
        data-completed={isCompleted}
        className="group flex gap-2 hover:cursor-pointer data-[completed=true]:opacity-50"
      >
        <input
          id={`${todo.id}`}
          disabled={isPending}
          type="checkbox"
          onChange={onToggle}
          checked={isCompleted}
          className="hover:cursor-pointer"
        />
        <label htmlFor={`${todo.id}`} className="w-full hover:cursor-pointer">
          <span className="group-data-[completed=true]:line-through">
            {todo.name}
          </span>
          {isPending && (
            <span className="ml-2 text-sm text-neutral-500">Saving...</span>
          )}
        </label>
      </li>
      {children.length > 0 && (
        <div className="ml-8 flex flex-col gap-4">
          {children.map((t) => (
            <Todo key={t.id} todos={todos} todo={t} />
          ))}
        </div>
      )}
    </>
  );
}
