import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/auth";

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link href={user ? "/feed" : "/"} className="text-lg font-extrabold tracking-tight text-primary">
          WCAC<span className="text-foreground">/</span>PCAC
        </Link>

        {user ? (
          <nav className="flex items-center gap-4 text-sm font-medium">
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
              <button className="rounded-full border border-border px-3 py-1.5 text-foreground/70 hover:border-primary hover:text-primary">
                Log out
              </button>
            </form>
          </nav>
        ) : (
          <nav className="flex items-center gap-3 text-sm font-medium">
            <Link href="/login" className="text-foreground/80 hover:text-primary">
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-primary px-4 py-1.5 text-primary-foreground hover:opacity-90"
            >
              Sign up
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
