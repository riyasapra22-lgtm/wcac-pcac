import Link from "next/link";
import { LogIn } from "lucide-react";
import { login } from "@/app/actions/auth";

export default async function LoginPage(props: PageProps<"/login">) {
  const searchParams = await props.searchParams;
  const error = typeof searchParams.error === "string" ? searchParams.error : null;

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <span className="flex h-11 w-11 items-center justify-center border-2 border-foreground text-foreground">
        <LogIn className="h-5 w-5" strokeWidth={2} />
      </span>
      <h1 className="mt-5 font-display text-4xl uppercase tracking-wide">Log in</h1>
      <p className="mt-1 font-sans text-sm text-muted">Welcome back to campus.</p>

      {error && (
        <p className="mt-4 border-2 border-primary bg-white px-3 py-2 font-sans text-sm text-primary">
          {error}
        </p>
      )}

      <form action={login} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="font-sans text-sm font-semibold" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="field mt-1"
            placeholder="you@mica.ac.in"
          />
        </div>
        <div>
          <label className="font-sans text-sm font-semibold" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="field mt-1"
            placeholder="••••••••"
          />
        </div>
        <button type="submit" className="btn btn-primary mt-2">
          Log in
        </button>
      </form>

      <p className="mt-6 font-sans text-sm text-muted">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-primary underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
