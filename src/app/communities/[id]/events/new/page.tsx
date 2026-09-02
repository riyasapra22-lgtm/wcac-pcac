import { notFound, redirect } from "next/navigation";
import { Send } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createEvent } from "@/app/actions/events";
import type { Community, CommunityMember } from "@/types";

export default async function NewEventPage(props: PageProps<"/communities/[id]/events/new">) {
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const error = typeof searchParams.error === "string" ? searchParams.error : null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: community } = await supabase.from("communities").select("*").eq("id", id).single();
  if (!community) notFound();
  const typedCommunity = community as Community;

  const { data: membership } = await supabase
    .from("community_members")
    .select("*")
    .eq("community_id", id)
    .eq("user_id", user.id)
    .maybeSingle<CommunityMember>();

  if (!membership) redirect(`/communities/${id}`);

  const createEventWithCommunity = createEvent.bind(null, id);

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <p className="eyebrow text-primary">{typedCommunity.name}</p>
      <h1 className="mt-1 font-display text-4xl uppercase tracking-wide">New event</h1>
      <p className="mt-1 font-sans text-sm text-muted">
        Activate the campus around it — list what people might need, and they can flag what
        they already have.
      </p>

      {error && (
        <p className="mt-4 border-2 border-primary bg-white px-3 py-2 font-sans text-sm text-primary">
          {error}
        </p>
      )}

      <form action={createEventWithCommunity} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="font-sans text-sm font-semibold" htmlFor="title">
            Title
          </label>
          <input id="title" name="title" type="text" required placeholder="e.g. Oorja" className="field mt-1" />
        </div>
        <div>
          <label className="font-sans text-sm font-semibold" htmlFor="event_date">
            Date
          </label>
          <input id="event_date" name="event_date" type="date" required className="field mt-1" />
        </div>
        <div>
          <label className="font-sans text-sm font-semibold" htmlFor="description">
            Description
          </label>
          <textarea id="description" name="description" rows={3} className="field mt-1" />
        </div>
        <div>
          <label className="font-sans text-sm font-semibold" htmlFor="needs">
            Things people might need
          </label>
          <input
            id="needs"
            name="needs"
            type="text"
            placeholder="Ethnic wear, Jewellery, Accessories, Props"
            className="field mt-1"
          />
          <p className="mt-1 font-sans text-xs text-muted">Comma-separated — becomes a checklist on the event page.</p>
        </div>
        <button type="submit" className="btn btn-accent mt-2 self-start">
          <Send className="h-4 w-4" strokeWidth={2} />
          Create event
        </button>
      </form>
    </div>
  );
}
