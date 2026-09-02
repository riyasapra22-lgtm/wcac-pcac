import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, CalendarDays, CircleCheck, HandHelping } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { respondToEventNeed, clearEventNeedResponse } from "@/app/actions/events";
import { daysUntil, daysUntilLabel } from "@/lib/dates";
import type { Event, EventNeed, EventNeedResponse } from "@/types";

function bannerCopy(days: number, title: string) {
  if (days < 0) return null;
  if (days === 0) return `${title.toUpperCase()} IS TODAY. Don't forget what you still need.`;
  if (days <= 3)
    return `${title} is in ${days} day${days === 1 ? "" : "s"} — still looking for something? Check who already has it below.`;
  return `${title} is coming. Before you buy anything, check what's already available on campus.`;
}

export default async function EventDetailPage(props: PageProps<"/events/[id]">) {
  const { id } = await props.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: event } = await supabase
    .from("events")
    .select("*, communities(id, name, kind)")
    .eq("id", id)
    .single();
  if (!event) notFound();
  const typedEvent = event as Event;

  const { data: needs } = await supabase
    .from("event_needs")
    .select("*, event_need_responses(*, profiles(id, full_name, hostel))")
    .eq("event_id", id)
    .order("created_at", { ascending: true });

  const typedNeeds = (needs ?? []) as EventNeed[];
  const days = daysUntil(typedEvent.event_date);
  const banner = bannerCopy(days, typedEvent.title);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link
        href={`/communities/${typedEvent.community_id}`}
        className="inline-flex items-center gap-1 font-sans text-sm text-muted hover:text-primary"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
        {typedEvent.communities?.name}
      </Link>

      <div className="card mt-3 p-6">
        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-primary">
          <CalendarDays className="h-3.5 w-3.5" strokeWidth={2} />
          {new Date(typedEvent.event_date).toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        <h1 className="mt-2 font-display text-4xl uppercase tracking-wide">{typedEvent.title}</h1>
        {typedEvent.description && (
          <p className="mt-2 font-sans text-foreground/90">{typedEvent.description}</p>
        )}
      </div>

      {banner && (
        <div className="mt-4 border-2 border-foreground bg-primary p-4 font-sans text-sm font-semibold text-primary-foreground">
          {banner}
        </div>
      )}

      <h2 className="mt-8 font-display text-2xl uppercase tracking-wide">Checklist</h2>
      <p className="mt-1 font-sans text-sm text-muted">
        Flag what you already have, or what you&apos;re still looking for.
      </p>

      <ul className="mt-4 flex flex-col gap-3">
        {typedNeeds.map((need) => {
          const responses = (need.event_need_responses ?? []) as EventNeedResponse[];
          const haveCount = responses.filter((r) => r.response === "HAVE").length;
          const needCount = responses.filter((r) => r.response === "NEED").length;
          const mine = responses.find((r) => r.user_id === user.id);
          const haveAction = respondToEventNeed.bind(null, id, need.id, "HAVE");
          const needAction = respondToEventNeed.bind(null, id, need.id, "NEED");
          const clearAction = clearEventNeedResponse.bind(null, id, need.id);

          return (
            <li key={need.id} className="card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-display text-lg uppercase tracking-wide">{need.item_name}</span>
                <span className="font-mono text-xs text-muted">
                  {haveCount} have it &middot; {needCount} need it
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                {mine?.response === "HAVE" ? (
                  <form action={clearAction}>
                    <button className="btn btn-primary btn-sm">
                      <CircleCheck className="h-3.5 w-3.5" strokeWidth={2.5} />
                      I have it
                    </button>
                  </form>
                ) : (
                  <form action={haveAction}>
                    <button className="btn btn-ghost btn-sm">I have it</button>
                  </form>
                )}
                {mine?.response === "NEED" ? (
                  <form action={clearAction}>
                    <button className="btn btn-accent btn-sm">
                      <HandHelping className="h-3.5 w-3.5" strokeWidth={2.5} />
                      I need it
                    </button>
                  </form>
                ) : (
                  <form action={needAction}>
                    <button className="btn btn-ghost btn-sm">I need it</button>
                  </form>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {typedNeeds.length === 0 && (
        <p className="mt-4 font-sans text-sm text-muted">No checklist items for this event.</p>
      )}

      <p className="mt-6 font-mono text-xs uppercase text-muted">{daysUntilLabel(typedEvent.event_date)}</p>
    </div>
  );
}
