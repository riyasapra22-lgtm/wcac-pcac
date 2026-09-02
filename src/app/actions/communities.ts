"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { CommunityKind } from "@/types";

const VALID_KINDS: CommunityKind[] = ["HOSTEL", "COMMITTEE", "SOCIETY", "CLUB"];

export async function createCommunity(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = String(formData.get("name") ?? "").trim();
  const kind = String(formData.get("kind") ?? "");
  const description = String(formData.get("description") ?? "").trim();

  if (!name || !VALID_KINDS.includes(kind as CommunityKind)) {
    redirect(`/communities?error=${encodeURIComponent("Pick a name and a kind.")}`);
  }

  const { data, error } = await supabase
    .from("communities")
    .insert({ name, kind, description: description || null, created_by: user!.id })
    .select("id")
    .single();

  if (error || !data) {
    redirect(`/communities?error=${encodeURIComponent(error?.message ?? "Could not create community.")}`);
  }

  // creating a community joins you as its first member
  await supabase.from("community_members").insert({ community_id: data!.id, user_id: user!.id, role: "admin" });

  revalidatePath("/communities");
  redirect(`/communities/${data!.id}`);
}

export async function joinCommunity(communityId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("community_members").insert({ community_id: communityId, user_id: user!.id });

  revalidatePath("/communities");
  revalidatePath(`/communities/${communityId}`);
}

export async function leaveCommunity(communityId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("community_members")
    .delete()
    .eq("community_id", communityId)
    .eq("user_id", user!.id);

  revalidatePath("/communities");
  revalidatePath(`/communities/${communityId}`);
}
