import Link from "next/link";
import { UserPlus } from "lucide-react";
import { signup } from "@/app/actions/auth";

export default async function SignupPage(props: PageProps<"/signup">) {
  const searchParams = await props.searchParams;
  const error = typeof searchParams.error === "string" ? searchParams.error : null;

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <span className="flex h-11 w-11 items-center justify-center bg-primary text-primary-foreground">
        <UserPlus className="h-5 w-5" strokeWidth={2} />
      </span>
      <h1 className="mt-5 font-display text-4xl uppercase tracking-wide">Create an account</h1>
      <p className="mt-1 font-sans text-sm text-muted">Join the campus resource pool.</p>

      {error && (
        <p className="mt-4 border-2 border-primary bg-white px-3 py-2 font-sans text-sm text-primary">
          {error}
        </p>
      )}

      <form action={signup} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="font-sans text-sm font-semibold" htmlFor="fullName">
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            className="field mt-1"
            placeholder="Your name"
          />
        </div>
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
            minLength={6}
            className="field mt-1"
            placeholder="At least 6 characters"
          />
        </div>
        <button type="submit" className="btn btn-accent mt-2">
          Sign up
        </button>
      </form>

      <p className="mt-6 font-sans text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
