import Link from "next/link";
import { UserPlus } from "lucide-react";
import { signup } from "@/app/actions/auth";

export default async function SignupPage(props: PageProps<"/signup">) {
  const searchParams = await props.searchParams;
  const error = typeof searchParams.error === "string" ? searchParams.error : null;

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent-foreground">
        <UserPlus className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <h1 className="mt-4 text-2xl font-extrabold">Create an account</h1>
      <p className="mt-1 text-sm text-muted">Join the campus resource pool.</p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <form action={signup} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium" htmlFor="fullName">
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 outline-none focus:border-primary"
            placeholder="Your name"
          />
        </div>
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
            minLength={6}
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 outline-none focus:border-primary"
            placeholder="At least 6 characters"
          />
        </div>
        <button
          type="submit"
          className="mt-2 rounded-full bg-primary px-4 py-2.5 font-semibold text-primary-foreground hover:opacity-90"
        >
          Sign up
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary">
          Log in
        </Link>
      </p>
    </div>
  );
}
