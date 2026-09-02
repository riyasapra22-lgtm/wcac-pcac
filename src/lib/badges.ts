export type UserStats = {
  user_id: string;
  full_name: string | null;
  points: number;
  accepted_count: number;
  volunteer_accepted_count: number;
};

export type Badge = { emoji: string; label: string };

export function badgesFor(stats: Pick<UserStats, "points" | "accepted_count" | "volunteer_accepted_count">): Badge[] {
  const badges: Badge[] = [];
  if (stats.accepted_count >= 10) badges.push({ emoji: "🛠️", label: "The Toolbox" });
  if (stats.volunteer_accepted_count >= 5) badges.push({ emoji: "🎭", label: "Event Hero" });
  if (stats.points >= 50) badges.push({ emoji: "🤝", label: "MICA MVP" });
  return badges;
}
