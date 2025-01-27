import Link from "next/link";
import { redirect } from "next/navigation";
import GithubButton from "~/components/auth/github-button";
import ProfileButton from "~/components/auth/profile-button";
import TodoList from "~/components/todo-list";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { auth } from "~/server/auth";

export default async function HomePage() {
  const session = await auth();

  if (!session) redirect("/sign-in");

  return (
    <ScrollArea className="h-screen">
      <div className="flex min-h-screen w-full flex-col">
        <div className="w-full bg-foreground">
          <p className="mx-auto max-w-screen-sm px-4 py-2 text-center text-xs font-semibold text-background">
            ⚠ Please be patient, the database is pretty slow! (It&apos;s a free
            tier) ⚠
          </p>
        </div>
        <header className="mx-auto flex w-full max-w-screen-sm items-center justify-between p-4">
          <Link href="/" className="text-xl font-bold tracking-tighter">
            AdvancedTodo
          </Link>
          {session?.user ? (
            <ProfileButton user={session.user} />
          ) : (
            <GithubButton />
          )}
        </header>
        <main className="mx-auto mb-20 mt-8 w-full max-w-screen-sm px-4">
          <TodoList userId={session.user.id} />
        </main>
        <div className="mt-auto bg-foreground">
          <footer className="mx-auto flex max-w-screen-sm flex-col items-center justify-between p-4 text-background md:flex-row">
            <a
              href="www.github.com/yusborinchit"
              target="_blank"
              className="text-lg font-semibold"
            >
              @github/yusborinchit
            </a>
            <p className="text-sm tracking-tighter opacity-20">
              Made with ❤ and Next.js{" "}
            </p>
          </footer>
        </div>
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
}
