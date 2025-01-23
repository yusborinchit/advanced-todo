import Link from "next/link";
import GithubButton from "~/components/auth/github-button";
import ProfileButton from "~/components/auth/profile-button";
import { auth } from "~/server/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <>
      <header className="mx-auto flex max-w-screen-md items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold tracking-tighter">
          AdvancedTodo
        </Link>
        {session?.user ? (
          <ProfileButton user={session.user} />
        ) : (
          <GithubButton />
        )}
      </header>
      <main className=""></main>
    </>
  );
}
