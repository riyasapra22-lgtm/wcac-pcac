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
    <form action={action} className="mt-6 flex flex-col gap-5">
      <div>
        <label className="font-sans text-sm font-semibold">Type</label>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {POST_TYPES.map((t) => {
            const Icon = TYPE_ICONS[t.value];
            return (
              <label
                key={t.value}
                className="card flex cursor-pointer flex-col p-3 text-sm has-[:checked]:bg-primary has-[:checked]:text-primary-foreground"
              >
                <span className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-display text-lg uppercase tracking-wide">
                    <Icon className="h-4 w-4" strokeWidth={2} />
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
                <span className="mt-1 font-sans text-xs opacity-80">{t.blurb}</span>
              </label>
            );
          })}
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
          placeholder="e.g. Laptop for an event, 3–7 PM"
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
          placeholder="Any details that help someone respond"
          className="field mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="font-sans text-sm font-semibold" htmlFor="category">
            Category
          </label>
          <input
            id="category"
            name="category"
            type="text"
            defaultValue={defaultValues?.category ?? ""}
            placeholder="Electronics, clothes…"
            className="field mt-1"
          />
        </div>
        <div>
          <label className="font-sans text-sm font-semibold" htmlFor="location">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            defaultValue={defaultValues?.location ?? ""}
            placeholder="Hostel 2, SAC…"
            className="field mt-1"
          />
        </div>
      </div>

      <button type="submit" className="btn btn-accent mt-2">
        <Send className="h-4 w-4" strokeWidth={2} />
        {submitLabel}
      </button>
    </form>
  );
}
