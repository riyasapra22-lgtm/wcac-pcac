import { redirect } from "next/navigation";
import { Trophy, Medal } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { badgesFor, type UserStats } from "@/lib/badges";

type CommunityStats = {
  community_id: string;
  name: string;
  kind: string;
  total_points: number;
  member_count: number;
};

const MEDALS = ["🥇", "🥈", "🥉"];

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: users } = await supabase
    .from("user_stats")
    .select("*")
    .order("points", { ascending: false })
    .limit(20);

  const { data: communities } = await supabase
    .from("community_stats")
    .select("*")
    .order("total_points", { ascending: false })
    .limit(10);

  const typedUsers = (users ?? []) as UserStats[];
  const typedCommunities = (communities ?? []) as CommunityStats[];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-display text-4xl uppercase tracking-wide">Leaderboard</h1>
      <p className="mt-1 font-sans text-sm text-muted">
        Helping is already part of MICA culture — this just makes it visible.
      </p>

      <section className="mt-8">
        <h2 className="flex items-center gap-2 font-display text-2xl uppercase tracking-wide">
          <Trophy className="h-5 w-5 text-primary" strokeWidth={2} />
          Most helpful MICAans
        </h2>
        <ol className="mt-4 flex flex-col gap-2">
          {typedUsers.map((u, i) => {
            const badges = badgesFor(u);
            return (
              <li key={u.user_id} className="card flex items-center justify-between gap-3 p-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 font-display text-xl">{MEDALS[i] ?? i + 1}</span>
                  <div>
                    <p className="font-sans font-semibold">{u.full_name ?? "A MICAan"}</p>
                    {badges.length > 0 && (
                      <p className="font-sans text-xs text-muted">
                        {badges.map((b) => `${b.emoji} ${b.label}`).join("  ·  ")}
                      </p>
                    )}
                  </div>
                </div>
                <span className="font-mono text-sm font-bold text-primary">{u.points} pts</span>
              </li>
            );
          })}
          {typedUsers.length === 0 && (
            <p className="font-sans text-sm text-muted">No points on the board yet.</p>
          )}
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="flex items-center gap-2 font-display text-2xl uppercase tracking-wide">
          <Medal className="h-5 w-5 text-primary" strokeWidth={2} />
          Community wars
        </h2>
        <ol className="mt-4 flex flex-col gap-2">
          {typedCommunities.map((c, i) => (
            <li key={c.community_id} className="card flex items-center justify-between gap-3 p-3">
              <div className="flex items-center gap-3">
                <span className="w-7 font-display text-xl">{MEDALS[i] ?? i + 1}</span>
                <div>
                  <p className="font-sans font-semibold">{c.name}</p>
                  <p className="font-sans text-xs text-muted">
                    {c.member_count} member{c.member_count === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
              <span className="font-mono text-sm font-bold text-primary">{c.total_points} pts</span>
            </li>
          ))}
          {typedCommunities.length === 0 && (
            <p className="font-sans text-sm text-muted">No communities yet.</p>
          )}
        </ol>
      </section>
    </div>
  );
}
