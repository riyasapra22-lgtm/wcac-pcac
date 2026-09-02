import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Camera,
  Gem,
  Laptop,
  BookOpen,
  Shirt,
  Wrench,
  Repeat2,
  PackageSearch,
  PackageCheck,
  ShoppingCart,
  HelpCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const EXAMPLES = [
  { tag: "WCAC", icon: PackageSearch, text: "safety pins?", need: true },
  { tag: "PCAC", icon: PackageCheck, text: "I have an extension board — come collect.", need: false },
  { tag: "WCAB", icon: ShoppingCart, text: "anyone selling a black formal shirt, size M?", need: true },
  { tag: "LOST", icon: HelpCircle, text: "black AirPods case, last seen near SAC.", need: true },
];

const COLLAGE = [
  { Icon: Laptop, need: true, className: "left-2 top-4 h-16 w-16 rotate-[-6deg]" },
  { Icon: Camera, need: false, className: "left-28 top-0 h-14 w-14 rotate-[4deg]" },
  { Icon: BookOpen, need: false, className: "right-4 top-10 h-16 w-16 rotate-[5deg]" },
  { Icon: Shirt, need: true, className: "left-8 top-32 h-14 w-14 rotate-[3deg]" },
  { Icon: Wrench, need: false, className: "left-40 top-28 h-12 w-12 rotate-[-8deg]" },
  { Icon: Gem, need: true, className: "right-10 top-40 h-14 w-14 rotate-[-4deg]" },
];

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/feed");

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-widest text-primary">
            <Repeat2 className="h-4 w-4" />
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
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-border px-6 py-3 font-semibold hover:border-primary hover:text-primary"
            >
              Log in
            </Link>
          </div>
        </div>

        <div className="relative hidden h-56 lg:block">
          {COLLAGE.map(({ Icon, need, className }, i) => (
            <div
              key={i}
              className={`absolute flex items-center justify-center rounded-2xl ${
                need ? "bg-primary-soft text-primary" : "bg-accent-soft text-accent-foreground"
              } ${className}`}
            >
              <Icon className="h-6 w-6" strokeWidth={1.75} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14 grid gap-3 sm:grid-cols-2">
        {EXAMPLES.map((e) => (
          <div
            key={e.text}
            className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4"
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                e.need ? "bg-primary-soft text-primary" : "bg-accent-soft text-accent-foreground"
              }`}
            >
              <e.icon className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <div>
              <span className="text-xs font-bold tracking-wide text-muted">{e.tag}</span>
              <p className="text-foreground">{e.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
