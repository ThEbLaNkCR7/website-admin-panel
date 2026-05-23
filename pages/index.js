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
      fetchGalleries();
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
    await fetch(`/api/media/${id}`, { method: "DELETE" });
    fetchMedia();
  };

  const updateTitle = async (id, title) => {
    await fetch(`/api/media/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    fetchMedia();
  };

  const deleteGallery = async (id) => {
    if (!confirm("Are you sure you want to delete this gallery?")) return;

    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      const result = await res.json();

      if (result.success) {
        setToast({ type: "success", message: "Gallery deleted successfully" });
        fetchGalleries();
      } else {
        setToast({ type: "error", message: "Failed to delete gallery" });
      }
    } catch (error) {
      setToast({ type: "error", message: error.message });
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {galleries.map((gallery) => (
                  <div
                    key={gallery._id}
                    className="border rounded-lg p-4 hover:shadow-lg"
                  >
                    {/* category title */}
                    <h3 className="font-semibold text-lg mb-2">
                      {gallery.category}
                    </h3>

                    {/* file count */}
                    <p className="text-sm text-gray-500 mb-3">
                      {gallery.files?.length || 0} files
                    </p>

                    {/* preview first few files */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {gallery.files?.slice(0, 6).map((file) => (
                        <div key={file._id} className="flex flex-col">
                          {file.type === "video" ? (
                            <video
                              src={file.url}
                              className="w-full h-24 object-cover rounded bg-black"
                              muted
                            />
                          ) : (
                            <img
                              src={file.url}
                              alt={file.title}
                              className="w-full h-24 object-cover rounded"
                            />
                          )}

                          <p className="text-xs mt-1 truncate">{file.title}</p>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => deleteGallery(gallery._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm w-full"
                    >
                      Delete Category
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
