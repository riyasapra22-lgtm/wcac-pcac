import { Send } from "lucide-react";
import { RESOURCE_MODES, type Resource } from "@/types";

export function ResourceForm({
  action,
  submitLabel,
  defaultValues,
}: {
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  defaultValues?: Pick<Resource, "title" | "description" | "category" | "mode">;
}) {
  return (
    <form action={action} className="mt-6 flex flex-col gap-5">
      <div>
        <label className="font-sans text-sm font-semibold">Mode</label>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {RESOURCE_MODES.map((m) => (
            <label
              key={m.value}
              className="card flex cursor-pointer items-center justify-between p-3 text-sm"
            >
              <span className="font-display text-lg uppercase tracking-wide">{m.label}</span>
              <input
                type="radio"
                name="mode"
                value={m.value}
                required
                defaultChecked={defaultValues?.mode === m.value}
                className="accent-[var(--primary)]"
              />
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="font-sans text-sm font-semibold" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={defaultValues?.title}
          placeholder="e.g. DSLR camera"
          className="field mt-1"
        />
      </div>

      <div>
        <label className="font-sans text-sm font-semibold" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={defaultValues?.description ?? ""}
          placeholder="Condition, terms, anything a borrower should know"
          className="field mt-1"
        />
      </div>

      <div>
        <label className="font-sans text-sm font-semibold" htmlFor="category">
          Category
        </label>
        <input
          id="category"
          name="category"
          type="text"
          defaultValue={defaultValues?.category ?? ""}
          placeholder="Electronics, tools, clothes…"
          className="field mt-1"
        />
      </div>

      <button type="submit" className="btn btn-accent mt-2">
        <Send className="h-4 w-4" strokeWidth={2} />
        {submitLabel}
      </button>
    </form>
  );
}
