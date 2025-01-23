import Link from "next/link";
import GithubButton from "~/components/auth/github-button";
import { Separator } from "~/components/ui/separator";

export default function SignInPage() {
  return (
    <div className="grid h-screen place-items-center p-4">
      <section className="flex flex-col p-4">
        <Link href="/" className="font-semibold tracking-tighter">
          &larr; Go Back
        </Link>
        <div className="mt-6">
          <p className="text-sm tracking-tighter text-muted-foreground">
            Sign in to your account
          </p>
          <h2 className="text-5xl font-bold leading-[0.9] tracking-tighter">
            Advanced Todo<span className="text-hm-500">.</span>
          </h2>
        </div>
        <Separator className="my-6 bg-border" />
        <div className="flex flex-col gap-4">
          <GithubButton />
        </div>
      </section>
    </div>
  );
}
