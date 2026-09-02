import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarDays, CalendarOff } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { daysUntilLabel } from "@/lib/dates";
import type { Event } from "@/types";

export default async function EventsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const todayIso = new Date().toISOString().slice(0, 10);

  const { data: upcoming } = await supabase
    .from("events")
    .select("*, communities(id, name, kind)")
    .gte("event_date", todayIso)
    .order("event_date", { ascending: true });

  const { data: past } = await supabase
    .from("events")
    .select("*, communities(id, name, kind)")
    .lt("event_date", todayIso)
    .order("event_date", { ascending: false })
    .limit(6);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="font-display text-4xl uppercase tracking-wide">Events</h1>
      <p className="mt-1 font-sans text-sm text-muted">
        Committee and club events activating the campus — see what&apos;s coming and what people
        already have.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {(upcoming as Event[] | null)?.map((e) => (
          <Link key={e.id} href={`/events/${e.id}`} className="card p-4 hover:shadow-[4px_4px_0_var(--primary)]">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-primary">
                <CalendarDays className="h-3.5 w-3.5" strokeWidth={2} />
                {new Date(e.event_date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </span>
              <span className="border-2 border-foreground px-2 py-0.5 font-mono text-[10px] font-bold uppercase">
                {daysUntilLabel(e.event_date)}
              </span>
            </div>
            <h3 className="mt-2 font-display text-xl uppercase tracking-wide">{e.title}</h3>
            <p className="mt-1 font-sans text-xs text-muted">{e.communities?.name}</p>
          </Link>
        ))}
      </div>

      {upcoming?.length === 0 && (
        <div className="mt-10 flex flex-col items-center gap-2 border-2 border-dashed border-foreground py-12 text-center">
          <CalendarOff className="h-8 w-8 text-muted" strokeWidth={1.5} />
          <p className="font-sans text-sm text-muted">
            Nothing scheduled yet. Join a{" "}
            <Link href="/communities" className="font-semibold text-primary underline">
              community
            </Link>{" "}
            and create one.
          </p>
        </div>
      )}

      {past && past.length > 0 && (
        <section className="mt-12 border-t-2 border-foreground pt-6">
          <h2 className="font-display text-2xl uppercase tracking-wide">Past events</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {(past as Event[]).map((e) => (
              <Link key={e.id} href={`/events/${e.id}`} className="card p-4 opacity-70 hover:opacity-100">
                <span className="font-mono text-xs font-bold text-muted">
                  {new Date(e.event_date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                </span>
                <h3 className="mt-1 font-display text-lg uppercase tracking-wide">{e.title}</h3>
                <p className="mt-1 font-sans text-xs text-muted">{e.communities?.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
