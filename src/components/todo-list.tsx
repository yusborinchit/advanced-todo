import { getTodos } from "~/server/db/queries";
import { type todos } from "~/server/db/schema";
import Todo from "./todo";

interface Props {
  userId: typeof todos.$inferSelect.createdById;
}

export default async function TodoList({ userId }: Readonly<Props>) {
  const { success, data: allTodos } = await getTodos(userId);

  const firstLevelTodos = allTodos.filter((t) => !t.parentId);

  return (
    <ul className="flex flex-col gap-4">
      {success &&
        firstLevelTodos.map((t) => (
          <Todo key={t.id} todos={allTodos} todo={t} />
        ))}
    </ul>
  );
}
