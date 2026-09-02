import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createPost } from "@/app/actions/posts";
import { PostForm } from "@/components/PostForm";

export default async function NewPostPage(props: PageProps<"/posts/new">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const searchParams = await props.searchParams;
  const error = typeof searchParams.error === "string" ? searchParams.error : null;

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="text-2xl font-extrabold">New post</h1>
      <p className="mt-1 text-sm text-muted">
        WCAC something, PCAC something, buy, sell, or flag a lost / found item.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <PostForm action={createPost} submitLabel="Post it" />
    </div>
  );
}
