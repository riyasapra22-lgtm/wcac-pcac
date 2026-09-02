import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createPost } from "@/app/actions/posts";
import { PostForm } from "@/components/PostForm";
import type { Community } from "@/types";

export default async function NewPostPage(props: PageProps<"/posts/new">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const searchParams = await props.searchParams;
  const error = typeof searchParams.error === "string" ? searchParams.error : null;

  const { data: memberships } = await supabase
    .from("community_members")
    .select("communities(id, name, kind)")
    .eq("user_id", user.id);

  const communities = (memberships ?? [])
    .map((m) => m.communities)
    .filter(Boolean) as unknown as Community[];

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="font-display text-4xl uppercase tracking-wide">New post</h1>
      <p className="mt-1 font-sans text-sm text-muted">
        WCAC something, PCAC something, buy, sell, flag a lost / found item, or ask for people.
      </p>

      {error && (
        <p className="mt-4 border-2 border-primary bg-white px-3 py-2 font-sans text-sm text-primary">
          {error}
        </p>
      )}

      <PostForm action={createPost} submitLabel="Post it" communities={communities} />
    </div>
  );
}
