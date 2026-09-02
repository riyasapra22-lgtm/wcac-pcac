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
    <div className="relative overflow-hidden bg-background pb-20">
      <div className="pointer-events-none absolute -right-28 -top-10 h-56 w-[560px] rotate-[-8deg] bg-primary" />

      <div className="relative mx-auto max-w-3xl px-4 pt-16">
        <div className="mb-6 flex gap-2.5">
          <span className="relative h-7 w-7 rounded-full border-[3px] border-foreground">
            <span className="absolute inset-[6px] rounded-full bg-foreground" />
          </span>
          <span className="relative h-7 w-7 rounded-full border-[3px] border-foreground">
            <span className="absolute inset-[6px] rounded-full bg-foreground" />
          </span>
        </div>

        <p className="eyebrow text-foreground">
          MICA&apos;s digital &quot;kiske paas hai?&quot;
        </p>

        <h1 className="mt-2 font-display text-[64px] uppercase leading-[0.86] tracking-wide sm:text-[92px]">
          Someone at MICA
          <br />
          already has{" "}
          <mark className="bg-primary px-2 text-background">what you need</mark>
        </h1>

        <p className="mt-7 max-w-xl font-sans text-lg font-medium text-muted">
          WCAC PCAC turns the borrowing, lending, buying and selling that already happens on
          campus and hostel groups into one searchable home — in the language MICA already speaks.
        </p>

        <div className="mt-9 flex flex-wrap gap-4">
          <Link href="/signup" className="btn btn-primary">
            Get started
          </Link>
          <Link href="/login" className="btn btn-ghost">
            Log in
          </Link>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2">
          {EXAMPLES.map((e, i) => (
            <div
              key={e.text}
              className="card p-4"
              style={{ transform: i === 1 ? "rotate(1.2deg)" : i === 2 ? "rotate(-1deg)" : undefined }}
            >
              <span className="font-display text-xl uppercase tracking-wide text-primary">
                {e.tag}
              </span>
              <p className="mt-1 font-sans text-foreground">{e.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
