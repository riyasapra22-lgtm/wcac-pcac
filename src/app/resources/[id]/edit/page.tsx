import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateResource } from "@/app/actions/resources";
import { ResourceForm } from "@/components/ResourceForm";
import type { Resource } from "@/types";

export default async function EditResourcePage(props: PageProps<"/resources/[id]/edit">) {
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const error = typeof searchParams.error === "string" ? searchParams.error : null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: resource } = await supabase.from("resources").select("*").eq("id", id).single();
  if (!resource) notFound();

  const typedResource = resource as Resource;
  if (typedResource.user_id !== user.id) redirect("/resources");

  const updateResourceWithId = updateResource.bind(null, id);

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="font-display text-4xl uppercase tracking-wide">Edit listing</h1>

      {error && (
        <p className="mt-4 border-2 border-primary bg-white px-3 py-2 font-sans text-sm text-primary">
          {error}
        </p>
      )}

      <ResourceForm action={updateResourceWithId} submitLabel="Save changes" defaultValues={typedResource} />
    </div>
  );
}
