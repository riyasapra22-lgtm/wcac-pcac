"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { EventNeedResponseKind } from "@/types";

export async function createEvent(communityId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const eventDate = String(formData.get("event_date") ?? "");
  const needsRaw = String(formData.get("needs") ?? "");

  if (!title || !eventDate) {
    redirect(
      `/communities/${communityId}/events/new?error=${encodeURIComponent("Give the event a title and a date.")}`
    );
  }

  const { data: event, error } = await supabase
    .from("events")
    .insert({
      community_id: communityId,
      title,
      description: description || null,
      event_date: eventDate,
      created_by: user!.id,
    })
    .select("id")
    .single();

  if (error || !event) {
    redirect(
      `/communities/${communityId}/events/new?error=${encodeURIComponent(error?.message ?? "Could not create event.")}`
    );
  }

  const needs = needsRaw
    .split(",")
    .map((n) => n.trim())
    .filter(Boolean);

  if (needs.length > 0) {
    await supabase
      .from("event_needs")
      .insert(needs.map((item_name) => ({ event_id: event!.id, item_name })));
  }

  revalidatePath("/events");
  revalidatePath(`/communities/${communityId}`);
  redirect(`/events/${event!.id}`);
}

export async function respondToEventNeed(
  eventId: string,
  eventNeedId: string,
  response: EventNeedResponseKind
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("event_need_responses")
    .upsert(
      { event_need_id: eventNeedId, user_id: user!.id, response },
      { onConflict: "event_need_id,user_id" }
    );

  revalidatePath(`/events/${eventId}`);
}

export async function clearEventNeedResponse(eventId: string, eventNeedId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("event_need_responses")
    .delete()
    .eq("event_need_id", eventNeedId)
    .eq("user_id", user!.id);

  revalidatePath(`/events/${eventId}`);
}
