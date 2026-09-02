import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createResource } from "@/app/actions/resources";
import { ResourceForm } from "@/components/ResourceForm";

export default async function NewResourcePage(props: PageProps<"/resources/new">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const searchParams = await props.searchParams;
  const error = typeof searchParams.error === "string" ? searchParams.error : null;

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="font-display text-4xl uppercase tracking-wide">List something</h1>
      <p className="mt-1 font-sans text-sm text-muted">
        Add it to the standing campus resource pool — visible to everyone, any time, not just
        during an active WCAC.
      </p>

      {error && (
        <p className="mt-4 border-2 border-primary bg-white px-3 py-2 font-sans text-sm text-primary">
          {error}
        </p>
      )}

      <ResourceForm action={createResource} submitLabel="Add to pool" />
    </div>
  );
}
