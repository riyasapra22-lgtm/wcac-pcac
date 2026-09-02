import type { PostType, PostStatus } from "@/types";

const TYPE_STYLES: Record<PostType, string> = {
  WCAC: "bg-orange-100 text-orange-800 border-orange-200",
  PCAC: "bg-emerald-100 text-emerald-800 border-emerald-200",
  WCAB: "bg-blue-100 text-blue-800 border-blue-200",
  PCAB: "bg-purple-100 text-purple-800 border-purple-200",
  LOST: "bg-red-100 text-red-800 border-red-200",
  FOUND: "bg-teal-100 text-teal-800 border-teal-200",
};

export function TypeBadge({ type }: { type: PostType }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold tracking-wide ${TYPE_STYLES[type]}`}
    >
      {type}
    </span>
  );
}

const STATUS_STYLES: Record<PostStatus, string> = {
  OPEN: "bg-primary/10 text-primary",
  FULFILLED: "bg-accent/10 text-accent",
  CLOSED: "bg-black/5 text-muted",
};

export function StatusBadge({ status }: { status: PostStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  );
}
