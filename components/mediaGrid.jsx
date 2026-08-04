import { Trash2, ImageIcon } from "lucide-react";
import EmptyState from "./EmptyState";

export default function MediaGrid({ media = [], onDelete }) {
  if (!media.length) {
    return (
      <EmptyState
        icon={ImageIcon}
        title="No media yet"
        description="Upload a project file above to see it listed here."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {media.map((m) => (
        <div
          key={m.projectId}
          className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
        >
          <div className="relative h-32 bg-slate-100">
            {m.type === "video" ? (
              <div className="flex h-full w-full items-center justify-center bg-slate-800 text-xs font-medium text-white">
                Video
              </div>
            ) : (
              <img
                src={m.url}
                alt={m.title}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            )}
            <span className="absolute left-2 top-2 rounded-md bg-slate-900/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
              {m.category === "Ongoing Projects" ? "Ongoing" : "Completed"}
            </span>
          </div>

          <div className="p-3">
            <p className="truncate text-sm font-semibold text-slate-900">
              {m.title}
            </p>
            <p className="mt-0.5 truncate text-xs text-slate-500">
              {Array.isArray(m.subCategory)
                ? m.subCategory.join(", ") || "—"
                : m.subCategory || "—"}
            </p>
            {m.location && (
              <p className="mt-0.5 truncate text-xs text-slate-400">
                {m.location}
              </p>
            )}

            <button
              type="button"
              onClick={() => onDelete(m.projectId)}
              className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-red-50 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
