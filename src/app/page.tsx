import Link from "next/link";
import { redirect } from "next/navigation";
import GithubButton from "~/components/auth/github-button";
import ProfileButton from "~/components/auth/profile-button";
import TodoList from "~/components/todo-list";
import { auth } from "~/server/auth";

export default async function HomePage() {
  const session = await auth();

  if (!session) redirect("/sign-in");

  return (
    <>
      <div className="bg-foreground">
        <p className="mx-auto max-w-screen-sm px-4 py-2 text-center text-xs font-semibold text-background">
          ⚠ Please be patient, the database is pretty slow! (It&apos;s a free
          tier) ⚠
        </p>
      </div>
      <header className="mx-auto flex max-w-screen-sm items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold tracking-tighter">
          AdvancedTodo
        </Link>
        {session?.user ? (
          <ProfileButton user={session.user} />
        ) : (
          <GithubButton />
        )}
      </header>
      <main className="mx-auto mt-8 max-w-screen-sm px-4">
        <TodoList userId={session.user.id} />
      </main>
    </>
  );
}
