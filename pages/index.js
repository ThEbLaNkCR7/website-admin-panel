import { useCallback, useEffect, useState } from "react";
import {
  LayoutDashboard,
  Upload,
  Images,
  Menu,
  X,
} from "lucide-react";
import Toast from "../components/toast";
import MediaForm from "../components/mediaForm";
import MediaGrid from "../components/mediaGrid";
import GalleryForm from "../components/galleryForm";
import GalleryGrid from "../components/GalleryGrid";
import ConfirmModal from "../components/ConfirmModal";
import LoadingSkeleton from "../components/LoadingSkeleton";

const NAV = [
  { id: "media", label: "Media Upload", icon: Upload },
  { id: "gallery", label: "Create Gallery", icon: Images },
];

export default function Home() {
  const [media, setMedia] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("media");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
  }, []);

  const fetchMedia = async () => {
    const res = await fetch("/api/media");
    if (!res.ok) throw new Error("Failed to load media");
    const data = await res.json();
    setMedia(Array.isArray(data) ? data : []);
  };

  const fetchGalleries = async () => {
    const res = await fetch("/api/gallery");
    if (!res.ok) throw new Error("Failed to load galleries");
    const data = await res.json();
    setGalleries(data.data || []);
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setInitialLoading(true);
        await Promise.all([fetchMedia(), fetchGalleries()]);
      } catch (err) {
        if (!cancelled) {
          showToast("error", err.message || "Failed to load data");
        }
      } finally {
        if (!cancelled) setInitialLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [showToast]);

  const upload = async (data) => {
    const formData = new FormData();
    formData.append("file", data.file);
    formData.append("title", data.title);
    formData.append("category", data.category);
    formData.append("subCategory", data.subCategory);
    formData.append("location", data.location);
    formData.append("client", data.client);
    formData.append("commencementDate", data.commencementDate);
    formData.append("finalizationDate", data.finalizationDate);
    formData.append("description", data.description);

    try {
      setLoading(true);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      showToast("success", "Uploaded successfully");
      data.reset();
      await fetchMedia();
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadGallery = async (data) => {
    const formData = new FormData();
    formData.append("category", data.category);
    formData.append("titles", JSON.stringify(data.titles));

    if (data.files?.length) {
      data.files.forEach((file) => {
        formData.append("files", file);
      });
    }

    try {
      setLoading(true);
      const res = await fetch("/api/gallery/upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      showToast("success", "Files uploaded successfully");
      data.reset();
      setGalleries((prev) => {
        const exists = prev.find((g) => g._id === result.data._id);
        if (exists) {
          return prev.map((g) => (g._id === result.data._id ? result.data : g));
        }
        return [...prev, result.data];
      });
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const requestDeleteMedia = (id) => {
    setConfirm({
      type: "media",
      id,
      title: "Delete media?",
      message: "This media item will be permanently removed. This cannot be undone.",
    });
  };

  const requestDeleteGallery = (fileId) => {
    setConfirm({
      type: "gallery",
      id: fileId,
      title: "Delete file?",
      message: "This gallery file will be permanently deleted. This cannot be undone.",
    });
  };

  const handleConfirmDelete = async () => {
    if (!confirm) return;
    setDeleting(true);

    try {
      if (confirm.type === "media") {
        const res = await fetch(`/api/media/${confirm.id}`, {
          method: "DELETE",
        });
        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.error || "Failed to delete media");
        }
        showToast("success", "Media deleted successfully");
        await fetchMedia();
      } else {
        const res = await fetch(`/api/gallery/file/${confirm.id}`, {
          method: "DELETE",
        });
        const result = await res.json();
        if (!result.success) {
          throw new Error(result.error || "Failed to delete file");
        }
        showToast("success", "File deleted successfully");
        setGalleries((prev) =>
          prev.map((gallery) => ({
            ...gallery,
            files: gallery.files?.filter((file) => file._id !== confirm.id),
          })),
        );
      }
      setConfirm(null);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setDeleting(false);
    }
  };

  const selectTab = (id) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <ConfirmModal
        open={Boolean(confirm)}
        title={confirm?.title}
        message={confirm?.message}
        loading={deleting}
        onCancel={() => !deleting && setConfirm(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">
              Admin Panel
            </p>
            <p className="truncate text-xs text-slate-500">Content manager</p>
          </div>
          <button
            type="button"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {NAV.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => selectTab(id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
                {label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-base font-semibold text-slate-900 sm:text-lg">
              {activeTab === "media" ? "Media Upload" : "Create Gallery"}
            </h1>
            <p className="hidden text-xs text-slate-500 sm:block">
              {activeTab === "media"
                ? "Manage project media and details"
                : "Organize gallery images and videos"}
            </p>
          </div>
        </header>

        <main className="mx-auto max-w-7xl p-4 sm:p-6">
          {activeTab === "media" && (
            <>
              <MediaForm
                loading={loading}
                onUpload={upload}
                onError={(message) => showToast("error", message)}
              />
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Media Library
                    </h2>
                    <p className="text-sm text-slate-500">
                      {initialLoading
                        ? "Loading..."
                        : `${media.length} item${media.length === 1 ? "" : "s"}`}
                    </p>
                  </div>
                </div>
                {initialLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <MediaGrid media={media} onDelete={requestDeleteMedia} />
                )}
              </section>
            </>
          )}

          {activeTab === "gallery" && (
            <>
              <GalleryForm
                loading={loading}
                onUpload={uploadGallery}
                onError={(message) => showToast("error", message)}
              />
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Created Galleries
                  </h2>
                  <p className="text-sm text-slate-500">
                    {initialLoading
                      ? "Loading..."
                      : "Browse and manage uploaded gallery files"}
                  </p>
                </div>
                {initialLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <GalleryGrid
                    galleries={galleries}
                    onDelete={requestDeleteGallery}
                  />
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
