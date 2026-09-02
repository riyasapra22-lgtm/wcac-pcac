"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const POINTS_FOR_ACCEPTED_RESPONSE = 10;

export async function createResponse(postId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const message = String(formData.get("message") ?? "").trim();

  const { error } = await supabase.from("responses").insert({
    post_id: postId,
    user_id: user!.id,
    message: message || null,
  });

  if (error) {
    redirect(`/posts/${postId}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/posts/${postId}`);
}

// Owner accepts a response: mark it accepted, award the responder points, and
// flip the post to FULFILLED. VOLUNTEER posts can accept multiple responses —
// the post only fulfils once enough people have been accepted to fill the
// slots, so the sign-up loop mirrors WCAC/PCAC but with capacity instead of
// a single match.
export async function acceptResponse(postId: string, responseId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: post } = await supabase
    .from("posts")
    .select("id, user_id, type, slots_needed")
    .eq("id", postId)
    .single();

  if (!post || post.user_id !== user!.id) {
    redirect(`/posts/${postId}?error=${encodeURIComponent("Only the post owner can accept a response.")}`);
  }

  const { data: response } = await supabase
    .from("responses")
    .select("id, user_id")
    .eq("id", responseId)
    .single();

  if (!response) {
    redirect(`/posts/${postId}?error=${encodeURIComponent("That response no longer exists.")}`);
  }

  await supabase.from("responses").update({ accepted: true }).eq("id", responseId);
  await supabase.rpc("award_points", {
    target_user: response!.user_id,
    amount: POINTS_FOR_ACCEPTED_RESPONSE,
  });

  let fulfilled = true;
  if (post!.type === "VOLUNTEER" && post!.slots_needed) {
    const { count } = await supabase
      .from("responses")
      .select("id", { count: "exact", head: true })
      .eq("post_id", postId)
      .eq("accepted", true);
    fulfilled = (count ?? 0) >= post!.slots_needed;
  }

  if (fulfilled) {
    await supabase
      .from("posts")
      .update({ status: "FULFILLED", updated_at: new Date().toISOString() })
      .eq("id", postId);
  }

  revalidatePath(`/posts/${postId}`);
  revalidatePath("/feed");
  revalidatePath("/my-posts");
  revalidatePath("/leaderboard");
}

export async function deleteResponse(postId: string, responseId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("responses").delete().eq("id", responseId).eq("user_id", user!.id);

  revalidatePath(`/posts/${postId}`);
}
