import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  Package,
  MapPin,
  User,
  CheckCheck,
  Inbox,
  Pencil,
  RotateCcw,
  XCircle,
  Trash2,
  Send,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { TypeBadge, StatusBadge } from "@/components/TypeBadge";
import { createResponse, acceptResponse, deleteResponse } from "@/app/actions/responses";
import { deletePost, closePost, reopenPost } from "@/app/actions/posts";
import type { Post, PostResponse } from "@/types";

export default async function PostDetailPage(props: PageProps<"/posts/[id]">) {
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const error = typeof searchParams.error === "string" ? searchParams.error : null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: post } = await supabase
    .from("posts")
    .select("*, profiles(id, full_name, hostel)")
    .eq("id", id)
    .single();

  if (!post) notFound();

  const typedPost = post as Post;
  const isOwner = typedPost.user_id === user.id;

  const { data: responses } = await supabase
    .from("responses")
    .select("*, profiles(id, full_name, hostel)")
    .eq("post_id", id)
    .order("created_at", { ascending: true });

  const typedResponses = (responses ?? []) as PostResponse[];
  const alreadyResponded = typedResponses.some((r) => r.user_id === user.id);
  const acceptedCount = typedResponses.filter((r) => r.accepted).length;
  const isVolunteer = typedPost.type === "VOLUNTEER";
  const createResponseWithId = createResponse.bind(null, id);
  const deletePostWithId = deletePost.bind(null, id);
  const closePostWithId = closePost.bind(null, id);
  const reopenPostWithId = reopenPost.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/feed" className="inline-flex items-center gap-1 font-sans text-sm text-muted hover:text-primary">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
        Back to feed
      </Link>

      {error && (
        <p className="mt-4 border-2 border-primary bg-white px-3 py-2 font-sans text-sm text-primary">
          {error}
        </p>
      )}

      <div className="card mt-3 p-6">
        <div className="flex items-center gap-2">
          <TypeBadge type={typedPost.type} />
          <StatusBadge status={typedPost.status} />
        </div>
        <h1 className="mt-3 font-display text-3xl uppercase tracking-wide">{typedPost.title}</h1>
        {typedPost.description && (
          <p className="mt-2 font-sans text-foreground/90">{typedPost.description}</p>
        )}
        {isVolunteer && typedPost.slots_needed && (
          <p className="mt-2 font-mono text-xs font-bold uppercase text-primary">
            {acceptedCount} / {typedPost.slots_needed} people signed up
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-sans text-sm text-muted">
          {typedPost.category && (
            <span className="inline-flex items-center gap-1.5">
              <Package className="h-4 w-4" strokeWidth={1.75} />
              {typedPost.category}
            </span>
          )}
          {typedPost.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4" strokeWidth={1.75} />
              {typedPost.location}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <User className="h-4 w-4" strokeWidth={1.75} />
            by {typedPost.profiles?.full_name ?? "a MICAan"}
          </span>
        </div>

        {isOwner && (
          <div className="mt-5 flex flex-wrap gap-2 border-t-2 border-foreground pt-4">
            <Link href={`/posts/${typedPost.id}/edit`} className="btn btn-ghost btn-sm">
              <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
              Edit
            </Link>
            {typedPost.status === "CLOSED" ? (
              <form action={reopenPostWithId}>
                <button className="btn btn-ghost btn-sm">
                  <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
                  Reopen
                </button>
              </form>
            ) : (
              typedPost.status === "OPEN" && (
                <form action={closePostWithId}>
                  <button className="btn btn-ghost btn-sm">
                    <XCircle className="h-3.5 w-3.5" strokeWidth={2} />
                    Close without fulfilling
                  </button>
                </form>
              )
            )}
            <form action={deletePostWithId}>
              <button className="btn btn-outline-primary btn-sm">
                <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                Delete
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="font-display text-2xl uppercase tracking-wide">
          {isOwner ? "Responses" : "Respond"}
        </h2>

        {!isOwner && typedPost.status === "OPEN" && !alreadyResponded && (
          <form action={createResponseWithId} className="mt-3 flex flex-col gap-2">
            <textarea
              name="message"
              rows={2}
              placeholder="e.g. I have this, come collect from Hostel 2"
              className="field text-sm"
            />
            <button type="submit" className="btn btn-primary btn-sm self-start">
              <Send className="h-3.5 w-3.5" strokeWidth={2} />
              Send response
            </button>
          </form>
        )}

        {!isOwner && alreadyResponded && (
          <p className="mt-3 font-sans text-sm text-muted">You&apos;ve already responded to this post.</p>
        )}

        {!isOwner && typedPost.status !== "OPEN" && (
          <p className="mt-3 font-sans text-sm text-muted">This post is no longer open.</p>
        )}

        <ul className="mt-4 flex flex-col gap-3">
          {typedResponses.map((r) => {
            const acceptResponseAction = acceptResponse.bind(null, id, r.id);
            const deleteResponseAction = deleteResponse.bind(null, id, r.id);
            const isMine = r.user_id === user.id;
            return (
              <li
                key={r.id}
                className={`border-2 p-3 font-sans text-sm ${
                  r.accepted ? "border-primary bg-primary/5" : "border-foreground bg-surface"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{r.profiles?.full_name ?? "A MICAan"}</span>
                  {r.accepted && (
                    <span className="font-mono text-xs font-bold text-primary">ACCEPTED ✓</span>
                  )}
                </div>
                {r.message && <p className="mt-1 text-foreground/90">{r.message}</p>}

                <div className="mt-2 flex gap-2">
                  {isOwner && typedPost.status === "OPEN" && !r.accepted && (
                    <form action={acceptResponseAction}>
                      <button className="btn btn-accent btn-sm">
                        <CheckCheck className="h-3.5 w-3.5" strokeWidth={2.5} />
                        {isVolunteer ? "Accept sign-up" : "Accept & mark fulfilled"}
                      </button>
                    </form>
                  )}
                  {isMine && !r.accepted && (
                    <form action={deleteResponseAction}>
                      <button className="btn btn-ghost btn-sm">Withdraw</button>
                    </form>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {typedResponses.length === 0 && (
          <div className="mt-4 flex flex-col items-center gap-2 border-2 border-dashed border-foreground py-8 text-center">
            <Inbox className="h-6 w-6 text-muted" strokeWidth={1.5} />
            <p className="font-sans text-sm text-muted">No responses yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
