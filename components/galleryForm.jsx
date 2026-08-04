import { useState, useRef } from "react";
import { Images, Loader2, Upload } from "lucide-react";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

export default function GalleryForm({ onUpload, loading, onError }) {
  const [category, setCategory] = useState("Completed Projects");
  const [files, setFiles] = useState([]);
  const [titles, setTitles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
    setTitles(selectedFiles.map((file) => file.name.split(".")[0]));
  };

  const handleTitleChange = (index, value) => {
    setTitles((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleUpload = () => {
    if (files.length === 0) {
      onError?.("Select at least one file.");
      return;
    }

    onUpload({
      category,
      files,
      titles,
      reset: () => {
        setCategory("Completed Projects");
        setFiles([]);
        setTitles([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
    });
  };

  return (
    <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Images className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Upload Gallery Files
          </h2>
          <p className="text-sm text-slate-500">
            Upload multiple images or videos under a category
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="gallery-category">
            Category
          </label>
          <select
            id="gallery-category"
            className={inputClass}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Completed Projects">Completed Projects</option>
            <option value="Ongoing Projects">Ongoing Projects</option>
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="gallery-files">
            Files
          </label>
          <input
            id="gallery-files"
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
          />
          {files.length > 0 && (
            <p className="mt-2 text-xs text-slate-500">
              {files.length} file{files.length > 1 ? "s" : ""} selected
            </p>
          )}
        </div>

        {files.length > 0 && (
          <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/80 p-4">
            <p className="text-sm font-medium text-slate-800">File Titles</p>
            {files.map((file, index) => (
              <div key={`${file.name}-${index}`}>
                <p className="mb-1 truncate text-xs text-slate-500">
                  {file.name}
                </p>
                <input
                  type="text"
                  value={titles[index] || ""}
                  onChange={(e) => handleTitleChange(index, e.target.value)}
                  placeholder="Enter title"
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleUpload}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload Files
            </>
          )}
        </button>
      </div>
    </div>
  );
}
