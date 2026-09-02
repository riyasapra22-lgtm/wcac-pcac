import type { PostType, PostStatus } from "@/types";

// "Need" types lean blue, "offer" types lean yellow — two hues, six meanings.
const NEED_TYPES: PostType[] = ["WCAC", "WCAB", "LOST"];

export function TypeBadge({ type }: { type: PostType }) {
  const isNeed = NEED_TYPES.includes(type);
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold tracking-wide ${
        isNeed ? "bg-primary-soft text-primary" : "bg-accent-soft text-accent-foreground"
      }`}
    >
      {type}
    </span>
  );
}

const STATUS_STYLES: Record<PostStatus, string> = {
  OPEN: "bg-primary-soft text-primary",
  FULFILLED: "bg-accent-soft text-accent-foreground",
  CLOSED: "bg-black/5 text-muted",
};

export function StatusBadge({ status }: { status: PostStatus }) {
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  );
}
