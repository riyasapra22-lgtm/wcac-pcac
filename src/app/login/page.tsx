import Link from "next/link";
import { login } from "@/app/actions/auth";

export default async function LoginPage(props: PageProps<"/login">) {
  const searchParams = await props.searchParams;
  const error = typeof searchParams.error === "string" ? searchParams.error : null;

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-extrabold">Log in</h1>
      <p className="mt-1 text-sm text-muted">Welcome back to campus.</p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <form action={login} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 outline-none focus:border-primary"
            placeholder="you@mica.ac.in"
          />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 outline-none focus:border-primary"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="mt-2 rounded-full bg-primary px-4 py-2.5 font-semibold text-primary-foreground hover:opacity-90"
        >
          Log in
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-primary">
          Create an account
        </Link>
      </p>
    </div>
  );
}
