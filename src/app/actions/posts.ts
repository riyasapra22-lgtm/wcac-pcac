"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { PostType } from "@/types";

const VALID_TYPES: PostType[] = ["WCAC", "PCAC", "WCAB", "PCAB", "LOST", "FOUND"];

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const type = String(formData.get("type") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();

  if (!VALID_TYPES.includes(type as PostType) || !title) {
    redirect(`/posts/new?error=${encodeURIComponent("Pick a type and a title.")}`);
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({
      user_id: user!.id,
      type,
      title,
      description: description || null,
      category: category || null,
      location: location || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    redirect(`/posts/new?error=${encodeURIComponent(error?.message ?? "Could not create post.")}`);
  }

  revalidatePath("/feed");
  revalidatePath("/my-posts");
  redirect(`/posts/${data!.id}`);
}

export async function updatePost(postId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const type = String(formData.get("type") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();

  if (!VALID_TYPES.includes(type as PostType) || !title) {
    redirect(`/posts/${postId}/edit?error=${encodeURIComponent("Pick a type and a title.")}`);
  }

  const { error } = await supabase
    .from("posts")
    .update({
      type,
      title,
      description: description || null,
      category: category || null,
      location: location || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", postId)
    .eq("user_id", user!.id);

  if (error) {
    redirect(`/posts/${postId}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/feed");
  revalidatePath("/my-posts");
  revalidatePath(`/posts/${postId}`);
  redirect(`/posts/${postId}`);
}

export async function deletePost(postId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("posts").delete().eq("id", postId).eq("user_id", user!.id);

  revalidatePath("/feed");
  revalidatePath("/my-posts");
  redirect("/my-posts");
}

export async function closePost(postId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("posts")
    .update({ status: "CLOSED", updated_at: new Date().toISOString() })
    .eq("id", postId)
    .eq("user_id", user!.id);

  revalidatePath("/feed");
  revalidatePath("/my-posts");
  revalidatePath(`/posts/${postId}`);
}

export async function reopenPost(postId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("posts")
    .update({ status: "OPEN", updated_at: new Date().toISOString() })
    .eq("id", postId)
    .eq("user_id", user!.id);

  revalidatePath("/feed");
  revalidatePath("/my-posts");
  revalidatePath(`/posts/${postId}`);
}
