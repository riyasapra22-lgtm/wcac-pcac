import Link from "next/link";
import { redirect } from "next/navigation";
import { PackageOpen, Reply } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PostCard } from "@/components/PostCard";
import type { Post } from "@/types";

export default async function MyPostsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: posts } = await supabase
    .from("posts")
    .select("*, profiles(id, full_name, hostel)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: responded } = await supabase
    .from("responses")
    .select("post_id, posts(*, profiles(id, full_name, hostel))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const respondedPosts = (responded ?? [])
    .map((r) => r.posts)
    .filter(Boolean) as unknown as Post[];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="font-display text-4xl uppercase tracking-wide">My posts</h1>
      <p className="mt-1 font-sans text-sm text-muted">
        Everything you&apos;ve posted — edit, close or delete anytime.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {(posts as Post[] | null)?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {posts?.length === 0 && (
        <div className="mt-6 flex flex-col items-center gap-2 border-2 border-dashed border-foreground py-10 text-center">
          <PackageOpen className="h-7 w-7 text-muted" strokeWidth={1.5} />
          <p className="font-sans text-sm text-muted">
            You haven&apos;t posted anything yet.{" "}
            <Link href="/posts/new" className="font-semibold text-primary underline">
              Post a WCAC
            </Link>
            .
          </p>
        </div>
      )}

      <h2 className="mt-12 font-display text-3xl uppercase tracking-wide">
        Posts I&apos;ve responded to
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {respondedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      {respondedPosts.length === 0 && (
        <div className="mt-3 flex flex-col items-center gap-2 border-2 border-dashed border-foreground py-10 text-center">
          <Reply className="h-7 w-7 text-muted" strokeWidth={1.5} />
          <p className="font-sans text-sm text-muted">No responses sent yet.</p>
        </div>
      )}
    </div>
  );
}
