import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updatePost } from "@/app/actions/posts";
import { PostForm } from "@/components/PostForm";
import type { Post } from "@/types";

export default async function EditPostPage(props: PageProps<"/posts/[id]/edit">) {
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const error = typeof searchParams.error === "string" ? searchParams.error : null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: post } = await supabase.from("posts").select("*").eq("id", id).single();
  if (!post) notFound();

  const typedPost = post as Post;
  if (typedPost.user_id !== user.id) redirect(`/posts/${id}`);

  const updatePostWithId = updatePost.bind(null, id);

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="font-display text-4xl uppercase tracking-wide">Edit post</h1>

      {error && (
        <p className="mt-4 border-2 border-primary bg-white px-3 py-2 font-sans text-sm text-primary">
          {error}
        </p>
      )}

      <PostForm action={updatePostWithId} submitLabel="Save changes" defaultValues={typedPost} />
    </div>
  );
}
