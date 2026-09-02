import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Plus, Users, CalendarDays } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { joinCommunity, leaveCommunity } from "@/app/actions/communities";
import { PostCard } from "@/components/PostCard";
import type { Community, CommunityMember, Event, Post } from "@/types";

export default async function CommunityDetailPage(props: PageProps<"/communities/[id]">) {
  const { id } = await props.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: community } = await supabase.from("communities").select("*").eq("id", id).single();
  if (!community) notFound();
  const typedCommunity = community as Community;

  const { data: members } = await supabase
    .from("community_members")
    .select("*, profiles(id, full_name, hostel)")
    .eq("community_id", id)
    .order("joined_at", { ascending: true });

  const isMember = (members as CommunityMember[] | null)?.some((m) => m.user_id === user.id) ?? false;
  const toggleAction = isMember ? leaveCommunity.bind(null, id) : joinCommunity.bind(null, id);

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("community_id", id)
    .order("event_date", { ascending: true });

  const { data: posts } = await supabase
    .from("posts")
    .select("*, profiles(id, full_name, hostel)")
    .eq("community_id", id)
    .eq("status", "OPEN")
    .order("created_at", { ascending: false })
    .limit(6);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <span className="border-2 border-foreground bg-foreground px-2 py-0.5 font-mono text-xs font-bold text-background">
        {typedCommunity.kind}
      </span>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-4xl uppercase tracking-wide">{typedCommunity.name}</h1>
        <form action={toggleAction}>
          <button className={`btn btn-sm ${isMember ? "btn-ghost" : "btn-primary"}`}>
            {isMember ? "Leave" : "Join"}
          </button>
        </form>
      </div>
      {typedCommunity.description && (
        <p className="mt-2 font-sans text-muted">{typedCommunity.description}</p>
      )}
      <p className="mt-2 inline-flex items-center gap-1 font-sans text-xs text-muted">
        <Users className="h-3.5 w-3.5" strokeWidth={1.75} />
        {members?.length ?? 0} member{members?.length === 1 ? "" : "s"}
      </p>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl uppercase tracking-wide">Events</h2>
          {isMember && (
            <Link href={`/communities/${id}/events/new`} className="btn btn-accent btn-sm">
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
              New event
            </Link>
          )}
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {(events as Event[] | null)?.map((e) => (
            <Link key={e.id} href={`/events/${e.id}`} className="card p-4 hover:shadow-[4px_4px_0_var(--primary)]">
              <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-primary">
                <CalendarDays className="h-3.5 w-3.5" strokeWidth={2} />
                {new Date(e.event_date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <h3 className="mt-1 font-display text-xl uppercase tracking-wide">{e.title}</h3>
            </Link>
          ))}
        </div>
        {events?.length === 0 && <p className="mt-3 font-sans text-sm text-muted">No events yet.</p>}
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl uppercase tracking-wide">Feed</h2>
        <p className="mt-1 font-sans text-sm text-muted">
          Open WCAC/PCAC requests posted to {typedCommunity.name}.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {(posts as Post[] | null)?.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
        {posts?.length === 0 && (
          <p className="mt-3 font-sans text-sm text-muted">Nothing posted here yet.</p>
        )}
      </section>

      <section className="mt-10 border-t-2 border-foreground pt-6">
        <h2 className="font-display text-2xl uppercase tracking-wide">Members</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {(members as CommunityMember[] | null)?.map((m) => (
            <li
              key={m.user_id}
              className="border-2 border-foreground px-2 py-1 font-sans text-xs font-medium"
            >
              {m.profiles?.full_name ?? "A MICAan"}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
