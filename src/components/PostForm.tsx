import {
  PackageSearch,
  PackageCheck,
  ShoppingCart,
  Tag,
  HelpCircle,
  CheckCircle2,
  Send,
} from "lucide-react";
import { POST_TYPES, type Post, type PostType } from "@/types";

const TYPE_ICONS: Record<PostType, typeof PackageSearch> = {
  WCAC: PackageSearch,
  PCAC: PackageCheck,
  WCAB: ShoppingCart,
  PCAB: Tag,
  LOST: HelpCircle,
  FOUND: CheckCircle2,
};

export function PostForm({
  action,
  submitLabel,
  defaultValues,
}: {
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  defaultValues?: Pick<Post, "type" | "title" | "description" | "category" | "location">;
}) {
  return (
    <form action={action} className="mt-6 flex flex-col gap-4">
      <div>
        <label className="text-sm font-medium">Type</label>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {POST_TYPES.map((t) => {
            const Icon = TYPE_ICONS[t.value];
            return (
              <label
                key={t.value}
                className="flex cursor-pointer flex-col rounded-xl border border-border bg-surface p-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary-soft"
              >
                <span className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Icon className="h-4 w-4 text-primary" strokeWidth={1.75} />
                    {t.value}
                  </span>
                  <input
                    type="radio"
                    name="type"
                    value={t.value}
                    required
                    defaultChecked={defaultValues?.type === t.value}
                    className="accent-[var(--primary)]"
                  />
                </span>
                <span className="mt-1 text-xs text-muted">{t.blurb}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={defaultValues?.title}
          placeholder="e.g. Laptop for an event, 3–7 PM"
          className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="text-sm font-medium" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={defaultValues?.description ?? ""}
          placeholder="Any details that help someone respond"
          className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 outline-none focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium" htmlFor="category">
            Category
          </label>
          <input
            id="category"
            name="category"
            type="text"
            defaultValue={defaultValues?.category ?? ""}
            placeholder="Electronics, clothes…"
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="location">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            defaultValue={defaultValues?.location ?? ""}
            placeholder="Hostel 2, SAC…"
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 outline-none focus:border-primary"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2.5 font-semibold text-primary-foreground hover:opacity-90"
      >
        <Send className="h-4 w-4" strokeWidth={2} />
        {submitLabel}
      </button>
    </form>
  );
}
