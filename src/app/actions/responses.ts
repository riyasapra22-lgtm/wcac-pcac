"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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

// Owner accepts one response: mark it accepted and flip the post to FULFILLED.
// This is the moment a WCAC/PCAC/WCAB/PCAB request completes its business flow.
export async function acceptResponse(postId: string, responseId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: post } = await supabase
    .from("posts")
    .select("id, user_id")
    .eq("id", postId)
    .single();

  if (!post || post.user_id !== user!.id) {
    redirect(`/posts/${postId}?error=${encodeURIComponent("Only the post owner can accept a response.")}`);
  }

  await supabase.from("responses").update({ accepted: true }).eq("id", responseId);

  await supabase
    .from("posts")
    .update({ status: "FULFILLED", updated_at: new Date().toISOString() })
    .eq("id", postId);

  revalidatePath(`/posts/${postId}`);
  revalidatePath("/feed");
  revalidatePath("/my-posts");
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
