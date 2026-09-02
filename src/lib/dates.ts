// Computes a live "days until" label instead of sending an actual push/email
// notification — there's no notification infrastructure wired up, so this is
// the honest stand-in for the staged event reminders in the brief.
export function daysUntil(eventDateIso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(`${eventDateIso}T00:00:00`);
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((eventDate.getTime() - today.getTime()) / msPerDay);
}

export function daysUntilLabel(eventDateIso: string): string {
  const days = daysUntil(eventDateIso);
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days === -1) return "Yesterday";
  if (days > 1) return `In ${days} days`;
  return `${Math.abs(days)} days ago`;
}
