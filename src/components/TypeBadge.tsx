import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import type { PostType, PostStatus } from "@/types";

// "Need" types are outlined (waiting), "offer" types are filled red (something's ready).
const NEED_TYPES: PostType[] = ["WCAC", "WCAB", "LOST"];

export function TypeBadge({ type }: { type: PostType }) {
  const isNeed = NEED_TYPES.includes(type);
  const Icon = isNeed ? ArrowDownToLine : ArrowUpFromLine;
  return (
    <span
      className={`inline-flex items-center gap-1 border-2 px-2 py-0.5 font-mono text-xs font-bold tracking-wide ${
        isNeed
          ? "border-foreground bg-transparent text-foreground"
          : "border-primary bg-primary text-primary-foreground"
      }`}
    >
      <Icon className="h-3 w-3" strokeWidth={2.5} />
      {type}
    </span>
  );
}

const STATUS_STYLES: Record<PostStatus, string> = {
  OPEN: "border-foreground text-foreground bg-transparent",
  FULFILLED: "border-primary bg-primary text-primary-foreground",
  CLOSED: "border-muted text-muted bg-transparent",
};

export function StatusBadge({ status }: { status: PostStatus }) {
  return (
    <span
      className={`inline-flex items-center border-2 px-2 py-0.5 font-mono text-xs font-bold ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}
