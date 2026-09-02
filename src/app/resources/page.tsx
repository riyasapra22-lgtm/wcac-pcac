import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Search, PackageOpen, Pencil, Trash2, EyeOff, Eye } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ResourceCard } from "@/components/ResourceCard";
import { toggleResourceStatus, deleteResource } from "@/app/actions/resources";
import type { Resource } from "@/types";

export default async function ResourcesPage(props: PageProps<"/resources">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : "";

  let query = supabase
    .from("resources")
    .select("*, profiles(id, full_name, hostel)")
    .eq("status", "AVAILABLE")
    .neq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (q) query = query.ilike("title", `%${q}%`);

  const { data: pool } = await query;

  const { data: mine } = await supabase
    .from("resources")
    .select("*, profiles(id, full_name, hostel)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-wide">Resource pool</h1>
          <p className="mt-1 font-sans text-sm text-muted">
            Things MICAans are willing to lend, rent, sell or give away — right now, not just
            during an active request.
          </p>
        </div>
        <Link href="/resources/new" className="btn btn-accent btn-sm">
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          List something
        </Link>
      </div>

      <form className="mt-6 flex items-center gap-2" method="get">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" strokeWidth={2} />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search the pool… e.g. hammer"
            className="field py-2 pl-9"
          />
        </div>
        <button type="submit" className="btn btn-ghost btn-sm">
          Search
        </button>
      </form>

      {q && (
        <p className="mt-3 font-mono text-xs font-bold uppercase text-muted">
          {pool?.length ?? 0} available on campus
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {(pool as Resource[] | null)?.map((r) => (
          <ResourceCard key={r.id} resource={r} />
        ))}
      </div>

      {pool?.length === 0 && (
        <div className="mt-10 flex flex-col items-center gap-2 border-2 border-dashed border-foreground py-12 text-center">
          <PackageOpen className="h-8 w-8 text-muted" strokeWidth={1.5} />
          <p className="font-sans text-sm text-muted">
            Nothing here yet. Be the first —{" "}
            <Link href="/resources/new" className="font-semibold text-primary underline">
              list something
            </Link>
            .
          </p>
        </div>
      )}

      <h2 className="mt-12 font-display text-3xl uppercase tracking-wide">My stuff</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {(mine as Resource[] | null)?.map((r) => {
          const toggleAction = toggleResourceStatus.bind(
            null,
            r.id,
            r.status === "AVAILABLE" ? "UNAVAILABLE" : "AVAILABLE"
          );
          const deleteAction = deleteResource.bind(null, r.id);
          return (
            <ResourceCard
              key={r.id}
              resource={r}
              actions={
                <>
                  <Link href={`/resources/${r.id}/edit`} className="btn btn-ghost btn-sm">
                    <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
                    Edit
                  </Link>
                  <form action={toggleAction}>
                    <button className="btn btn-ghost btn-sm">
                      {r.status === "AVAILABLE" ? (
                        <>
                          <EyeOff className="h-3.5 w-3.5" strokeWidth={2} />
                          Mark unavailable
                        </>
                      ) : (
                        <>
                          <Eye className="h-3.5 w-3.5" strokeWidth={2} />
                          Mark available
                        </>
                      )}
                    </button>
                  </form>
                  <form action={deleteAction}>
                    <button className="btn btn-outline-primary btn-sm">
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                      Delete
                    </button>
                  </form>
                </>
              }
            />
          );
        })}
      </div>
      {mine?.length === 0 && (
        <p className="mt-4 font-sans text-sm text-muted">
          You haven&apos;t listed anything yet.{" "}
          <Link href="/resources/new" className="font-semibold text-primary underline">
            List your first item
          </Link>
          .
        </p>
      )}
    </div>
  );
}
