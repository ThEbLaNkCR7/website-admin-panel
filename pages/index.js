import { useEffect, useState } from "react";
import Toast from "../components/toast";
import MediaForm from "../components/mediaForm";
import MediaGrid from "../components/mediaGrid";
import GalleryForm from "../components/galleryForm";

export default function Home() {
  const [media, setMedia] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("media");

  const fetchMedia = async () => {
    const res = await fetch("/api/media");
    const data = await res.json();
    setMedia(data);
  };

  const fetchGalleries = async () => {
    const res = await fetch("/api/gallery");
    const data = await res.json();
    setGalleries(data.data || []);
  };

  useEffect(() => {
    fetchMedia();
    fetchGalleries();
  }, []);

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

      setToast({ type: "success", message: "Uploaded successfully" });

      data.reset();
      fetchMedia();
    } catch (err) {
      setToast({ type: "error", message: err.message });
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

      if (!res.ok) {
        throw new Error(result.error);
      }

      setToast({
        type: "success",
        message: "Files uploaded successfully",
      });

      data.reset();
      setGalleries((prev) => {
        const exists = prev.find((g) => g._id === result.data._id);

        if (exists) {
          return prev.map((g) => (g._id === result.data._id ? result.data : g));
        }

        return [...prev, result.data];
      });
    } catch (err) {
      setToast({
        type: "error",
        message: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteMedia = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this media?",
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/media/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (res.ok) {
        setToast({
          type: "success",
          message: "Media deleted successfully",
        });

        fetchMedia();
      } else {
        setToast({
          type: "error",
          message: result.error || "Failed to delete media",
        });
      }
    } catch (error) {
      setToast({
        type: "error",
        message: error.message,
      });
    }
  };

  const updateTitle = async (id, title) => {
    await fetch(`/api/media/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    fetchMedia();
  };

  const deleteGallery = async (fileId) => {
    if (!confirm("Delete this file?")) return;

    try {
      const res = await fetch(`/api/gallery/file/${fileId}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (result.success) {
        setToast({
          type: "success",
          message: "File deleted successfully",
        });

        // remove deleted file from local state
        setGalleries((prev) =>
          prev.map((gallery) => ({
            ...gallery,
            files: gallery.files?.filter((file) => file._id !== fileId),
          })),
        );
      } else {
        setToast({
          type: "error",
          message: result.error,
        });
      }
    } catch (error) {
      setToast({
        type: "error",
        message: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab("media")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "media"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600"
          }`}
        >
          Media Upload
        </button>
        <button
          onClick={() => setActiveTab("gallery")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "gallery"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600"
          }`}
        >
          Create Gallery
        </button>
      </div>

      {/* Media Tab */}
      {activeTab === "media" && (
        <>
          <MediaForm loading={loading} onUpload={upload} />
          <MediaGrid
            media={media}
            onDelete={deleteMedia}
            onUpdate={updateTitle}
          />
        </>
      )}

      {/* Gallery Tab */}
      {activeTab === "gallery" && (
        <>
          <GalleryForm loading={loading} onUpload={uploadGallery} />

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Created Galleries</h2>

            {galleries.length === 0 ? (
              <p className="text-gray-500">No galleries created yet</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {galleries.flatMap((gallery) =>
                  gallery.files?.map((file) => (
                    <div
                      key={file._id}
                      className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden border"
                    >
                      {/* Media Preview */}
                      <div className="w-full h-56 bg-gray-200">
                        {file.type === "video" ? (
                          <video
                            src={file.url}
                            controls
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={file.url}
                            alt={file.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-3">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {file.title || "Untitled"}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          Category: {gallery.category}
                        </p>
                      </div>

                      {/* Delete Button */}
                      <div className="p-3 pt-0">
                        <button
                          onClick={() => deleteGallery(file._id)}
                          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm transition"
                        >
                          Delete file
                        </button>
                      </div>
                    </div>
                  )),
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
