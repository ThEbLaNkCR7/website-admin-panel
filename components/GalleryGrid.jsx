import { Play, Trash2, Images } from "lucide-react";
import EmptyState from "./EmptyState";

export default function GalleryGrid({ galleries = [], onDelete }) {
  const items = galleries.flatMap((gallery) =>
    (gallery.files || []).map((file) => ({
      ...file,
      category: gallery.category,
    })),
  );

  if (!items.length) {
    return (
      <EmptyState
        icon={Images}
        title="No gallery files yet"
        description="Upload files above to build your gallery."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((file) => (
        <div
          key={file._id}
          className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
        >
          <div className="relative h-32 bg-slate-100">
            {file.type === "video" ? (
              <div className="relative h-full w-full">
                <img
                  src={file.url.replace("/upload/", "/upload/so_0,w_400,h_200,c_fill,f_jpg/")}
                  alt={file.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-800">
                    <Play className="h-4 w-4 fill-current" />
                  </span>
                </div>
              </div>
            ) : (
              <img
                src={file.url}
                alt={file.title}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            )}
            <span className="absolute left-2 top-2 rounded-md bg-slate-900/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
              {file.category === "Ongoing Projects" ? "Ongoing" : "Completed"}
            </span>
          </div>

          <div className="p-3">
            <h3 className="truncate text-sm font-semibold text-slate-900">
              {file.title || "Untitled"}
            </h3>
            <p className="mt-0.5 truncate text-xs text-slate-500">
              {file.category}
            </p>

            <button
              type="button"
              onClick={() => onDelete(file._id)}
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
