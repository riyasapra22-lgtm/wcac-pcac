import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const EXAMPLES = [
  { tag: "WCAC", text: "safety pins?" },
  { tag: "PCAC", text: "I have an extension board — come collect." },
  { tag: "WCAB", text: "anyone selling a black formal shirt, size M?" },
  { tag: "LOST", text: "black AirPods case, last seen near SAC." },
];

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/feed");

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">
        MICA&apos;s digital &quot;kiske paas hai?&quot;
      </p>
      <h1 className="mt-3 text-4xl font-extrabold leading-tight sm:text-5xl">
        Someone at MICA already has what you need.
      </h1>
      <p className="mt-4 max-w-xl text-lg text-muted">
        WCAC PCAC turns the borrowing, lending, buying and selling that already happens on
        campus and hostel groups into one searchable home — in the language MICA already speaks.
      </p>

      <div className="mt-8 flex gap-3">
        <Link
          href="/signup"
          className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90"
        >
          Get started
        </Link>
        <Link
          href="/login"
          className="rounded-full border border-border px-6 py-3 font-semibold hover:border-primary hover:text-primary"
        >
          Log in
        </Link>
      </div>

      <div className="mt-14 grid gap-3 sm:grid-cols-2">
        {EXAMPLES.map((e) => (
          <div key={e.text} className="rounded-2xl border border-border bg-surface p-4">
            <span className="text-xs font-bold tracking-wide text-primary">{e.tag}</span>
            <p className="mt-1 text-foreground">{e.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
