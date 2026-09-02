import Link from "next/link";
import { redirect } from "next/navigation";
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
      <h1 className="text-2xl font-extrabold">My posts</h1>
      <p className="mt-1 text-sm text-muted">Everything you&apos;ve posted — edit, close or delete anytime.</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {(posts as Post[] | null)?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {posts?.length === 0 && (
        <p className="mt-6 text-sm text-muted">
          You haven&apos;t posted anything yet.{" "}
          <Link href="/posts/new" className="font-semibold text-primary">
            Post a WCAC
          </Link>
          .
        </p>
      )}

      <h2 className="mt-10 text-lg font-bold">Posts I&apos;ve responded to</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {respondedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      {respondedPosts.length === 0 && (
        <p className="mt-3 text-sm text-muted">No responses sent yet.</p>
      )}
    </div>
  );
}
