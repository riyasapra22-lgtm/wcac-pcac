import { Package, User } from "lucide-react";
import type { Resource } from "@/types";

const MODE_LABEL: Record<Resource["mode"], string> = {
  LEND: "Lend",
  RENT: "Rent",
  SELL: "Sell",
  GIVE_AWAY: "Give away",
};

export function ResourceCard({ resource, actions }: { resource: Resource; actions?: React.ReactNode }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2">
        <span className="border-2 border-foreground bg-foreground px-2 py-0.5 font-mono text-xs font-bold text-background">
          {MODE_LABEL[resource.mode]}
        </span>
        {resource.status === "UNAVAILABLE" && (
          <span className="border-2 border-muted px-2 py-0.5 font-mono text-xs font-bold text-muted">
            UNAVAILABLE
          </span>
        )}
      </div>
      <h3 className="mt-2 font-display text-xl uppercase tracking-wide">{resource.title}</h3>
      {resource.description && (
        <p className="mt-1 line-clamp-2 font-sans text-sm text-muted">{resource.description}</p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-xs text-muted">
        {resource.category && (
          <span className="inline-flex items-center gap-1">
            <Package className="h-3.5 w-3.5" strokeWidth={1.75} />
            {resource.category}
          </span>
        )}
        {resource.profiles?.full_name && (
          <span className="inline-flex items-center gap-1">
            <User className="h-3.5 w-3.5" strokeWidth={1.75} />
            {resource.profiles.full_name}
          </span>
        )}
      </div>
      {actions && <div className="mt-3 flex flex-wrap gap-2 border-t-2 border-foreground pt-3">{actions}</div>}
    </div>
  );
}
