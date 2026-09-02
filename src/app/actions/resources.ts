"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ResourceMode } from "@/types";

const VALID_MODES: ResourceMode[] = ["LEND", "RENT", "SELL", "GIVE_AWAY"];

export async function createResource(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const mode = String(formData.get("mode") ?? "");

  if (!title || !VALID_MODES.includes(mode as ResourceMode)) {
    redirect(`/resources/new?error=${encodeURIComponent("Pick a mode and a title.")}`);
  }

  const { error } = await supabase.from("resources").insert({
    user_id: user!.id,
    title,
    description: description || null,
    category: category || null,
    mode,
  });

  if (error) {
    redirect(`/resources/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/resources");
  redirect("/resources");
}

export async function updateResource(resourceId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const mode = String(formData.get("mode") ?? "");

  if (!title || !VALID_MODES.includes(mode as ResourceMode)) {
    redirect(`/resources/${resourceId}/edit?error=${encodeURIComponent("Pick a mode and a title.")}`);
  }

  const { error } = await supabase
    .from("resources")
    .update({
      title,
      description: description || null,
      category: category || null,
      mode,
      updated_at: new Date().toISOString(),
    })
    .eq("id", resourceId)
    .eq("user_id", user!.id);

  if (error) {
    redirect(`/resources/${resourceId}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/resources");
  redirect("/resources");
}

export async function toggleResourceStatus(resourceId: string, nextStatus: "AVAILABLE" | "UNAVAILABLE") {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("resources")
    .update({ status: nextStatus, updated_at: new Date().toISOString() })
    .eq("id", resourceId)
    .eq("user_id", user!.id);

  revalidatePath("/resources");
}

export async function deleteResource(resourceId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("resources").delete().eq("id", resourceId).eq("user_id", user!.id);

  revalidatePath("/resources");
  redirect("/resources");
}
