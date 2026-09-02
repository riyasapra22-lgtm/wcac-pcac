import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/auth";

function ReelMark() {
  return (
    <span className="flex items-center gap-1">
      <span className="relative h-5 w-5 rounded-full border-[2.5px] border-foreground">
        <span className="absolute inset-[5px] rounded-full bg-foreground" />
      </span>
      <span className="relative h-5 w-5 rounded-full border-[2.5px] border-foreground">
        <span className="absolute inset-[5px] rounded-full bg-primary" />
      </span>
    </span>
  );
}

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-10 border-b-2 border-foreground bg-surface">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link
          href={user ? "/feed" : "/"}
          className="flex items-center gap-2 font-display text-2xl uppercase tracking-wide text-foreground"
        >
          <ReelMark />
          WCAC<span className="text-primary">/</span>PCAC
        </Link>

        {user ? (
          <nav className="flex items-center gap-5 font-sans text-sm font-medium">
            <Link href="/feed" className="text-foreground/80 hover:text-primary">
              Feed
            </Link>
            <Link href="/posts/new" className="text-foreground/80 hover:text-primary">
              Post
            </Link>
            <Link href="/my-posts" className="text-foreground/80 hover:text-primary">
              My posts
            </Link>
            <form action={logout}>
              <button className="btn btn-ghost btn-sm">Log out</button>
            </form>
          </nav>
        ) : (
          <nav className="flex items-center gap-3 font-sans text-sm font-medium">
            <Link href="/login" className="text-foreground/80 hover:text-primary">
              Log in
            </Link>
            <Link href="/signup" className="btn btn-primary btn-sm">
              Sign up
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
