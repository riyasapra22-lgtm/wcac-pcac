import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Search, PackageOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PostCard } from "@/components/PostCard";
import { POST_TYPES, type Post, type PostType } from "@/types";

export default async function FeedPage(props: PageProps<"/feed">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const searchParams = await props.searchParams;
  const typeFilter = typeof searchParams.type === "string" ? (searchParams.type as PostType) : null;
  const q = typeof searchParams.q === "string" ? searchParams.q : "";

  let query = supabase
    .from("posts")
    .select("*, profiles(id, full_name, hostel)")
    .eq("status", "OPEN")
    .order("created_at", { ascending: false });

  if (typeFilter) query = query.eq("type", typeFilter);
  if (q) query = query.ilike("title", `%${q}%`);

  const { data: posts } = await query;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Campus feed</h1>
        <Link
          href="/posts/new"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" strokeWidth={2.25} />
          New post
        </Link>
      </div>

      <form className="mt-5 flex flex-wrap items-center gap-2" method="get">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" strokeWidth={1.75} />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search open requests…"
            className="w-full rounded-full border border-border bg-surface py-2 pl-9 pr-4 text-sm outline-none focus:border-primary"
          />
        </div>
        {typeFilter && <input type="hidden" name="type" value={typeFilter} />}
        <button
          type="submit"
          className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-primary"
        >
          Search
        </button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href={q ? `/feed?q=${encodeURIComponent(q)}` : "/feed"}
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            !typeFilter ? "bg-primary text-primary-foreground" : "border border-border text-muted"
          }`}
        >
          All
        </Link>
        {POST_TYPES.map((t) => (
          <Link
            key={t.value}
            href={`/feed?type=${t.value}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              typeFilter === t.value ? "bg-primary text-primary-foreground" : "border border-border text-muted"
            }`}
          >
            {t.value}
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {(posts as Post[] | null)?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {posts?.length === 0 && (
        <div className="mt-10 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border py-12 text-center">
          <PackageOpen className="h-8 w-8 text-muted" strokeWidth={1.5} />
          <p className="text-sm text-muted">
            Nothing open here yet. Be the first —{" "}
            <Link href="/posts/new" className="font-semibold text-primary">
              post a WCAC
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}
