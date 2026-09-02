import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createCommunity, joinCommunity, leaveCommunity } from "@/app/actions/communities";
import { COMMUNITY_KINDS, type Community, type CommunityKind } from "@/types";

export default async function CommunitiesPage(props: PageProps<"/communities">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const searchParams = await props.searchParams;
  const error = typeof searchParams.error === "string" ? searchParams.error : null;

  const { data: communities } = await supabase
    .from("communities")
    .select("*, community_members(count)")
    .order("kind", { ascending: true })
    .order("name", { ascending: true });

  const { data: memberships } = await supabase
    .from("community_members")
    .select("community_id")
    .eq("user_id", user.id);

  const myCommunityIds = new Set((memberships ?? []).map((m) => m.community_id));

  const grouped = (communities as Community[] | null)?.reduce<Record<CommunityKind, Community[]>>(
    (acc, c) => {
      acc[c.kind] = acc[c.kind] ? [...acc[c.kind], c] : [c];
      return acc;
    },
    {} as Record<CommunityKind, Community[]>
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-wide">Communities</h1>
          <p className="mt-1 font-sans text-sm text-muted">
            Hostels, committees, societies, clubs — join the ones you&apos;re part of so requests
            reach the right people.
          </p>
        </div>
      </div>

      {error && (
        <p className="mt-4 border-2 border-primary bg-white px-3 py-2 font-sans text-sm text-primary">
          {error}
        </p>
      )}

      {COMMUNITY_KINDS.map(({ value: kind, label }) => (
        <section key={kind} className="mt-10">
          <h2 className="font-display text-2xl uppercase tracking-wide">{label}s</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {(grouped?.[kind] ?? []).map((c) => {
              const isMember = myCommunityIds.has(c.id);
              const memberCount = c.community_members?.[0]?.count ?? 0;
              const toggleAction = isMember
                ? leaveCommunity.bind(null, c.id)
                : joinCommunity.bind(null, c.id);
              return (
                <div key={c.id} className="card flex items-center justify-between gap-3 p-4">
                  <div>
                    <Link
                      href={`/communities/${c.id}`}
                      className="font-display text-lg uppercase tracking-wide hover:text-primary"
                    >
                      {c.name}
                    </Link>
                    <p className="mt-0.5 inline-flex items-center gap-1 font-sans text-xs text-muted">
                      <Users className="h-3.5 w-3.5" strokeWidth={1.75} />
                      {memberCount} member{memberCount === 1 ? "" : "s"}
                    </p>
                  </div>
                  <form action={toggleAction}>
                    <button className={`btn btn-sm ${isMember ? "btn-ghost" : "btn-primary"}`}>
                      {isMember ? "Leave" : "Join"}
                    </button>
                  </form>
                </div>
              );
            })}
            {(!grouped?.[kind] || grouped[kind].length === 0) && (
              <p className="font-sans text-sm text-muted">None yet.</p>
            )}
          </div>
        </section>
      ))}

      <section className="mt-12 border-t-2 border-foreground pt-8">
        <h2 className="font-display text-2xl uppercase tracking-wide">Start a new one</h2>
        <p className="mt-1 font-sans text-sm text-muted">
          Missing your hostel, club or committee? Add it.
        </p>
        <form action={createCommunity} className="mt-4 flex flex-col gap-4 sm:max-w-md">
          <div>
            <label className="font-sans text-sm font-semibold" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="e.g. Photography Club"
              className="field mt-1"
            />
          </div>
          <div>
            <label className="font-sans text-sm font-semibold" htmlFor="kind">
              Kind
            </label>
            <select id="kind" name="kind" required className="field mt-1">
              {COMMUNITY_KINDS.map((k) => (
                <option key={k.value} value={k.value}>
                  {k.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-sans text-sm font-semibold" htmlFor="description">
              Description
            </label>
            <textarea id="description" name="description" rows={2} className="field mt-1" />
          </div>
          <button type="submit" className="btn btn-accent self-start">
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Create community
          </button>
        </form>
      </section>
    </div>
  );
}
