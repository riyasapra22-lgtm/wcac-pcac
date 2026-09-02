import Link from "next/link";
import type { Post } from "@/types";
import { TypeBadge, StatusBadge } from "@/components/TypeBadge";

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/posts/${post.id}`}
      className="block rounded-2xl border border-border bg-surface p-4 transition hover:border-primary/40 hover:shadow-sm"
    >
      <div className="flex items-center gap-2">
        <TypeBadge type={post.type} />
        <StatusBadge status={post.status} />
      </div>
      <h3 className="mt-2 text-lg font-semibold text-foreground">{post.title}</h3>
      {post.description && (
        <p className="mt-1 line-clamp-2 text-sm text-muted">{post.description}</p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
        {post.category && <span>📦 {post.category}</span>}
        {post.location && <span>📍 {post.location}</span>}
        {post.profiles?.full_name && <span>by {post.profiles.full_name}</span>}
      </div>
    </Link>
  );
}
