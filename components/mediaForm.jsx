import { useState, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

export default function MediaForm({ onUpload, loading, onError }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Completed Projects");
  const [subCategory, setSubCategory] = useState("");
  const [location, setLocation] = useState("");
  const [client, setClient] = useState("");
  const [commencementDate, setCommencementDate] = useState("");
  const [finalizationDate, setFinalizationDate] = useState("");
  const [description, setDescription] = useState("");
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const handleUpload = () => {
    if (!file) {
      onError?.("Please select a file to upload.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      onError?.("File too large. Maximum allowed size is 5MB.");
      return;
    }

    onUpload({
      file,
      title,
      category,
      subCategory,
      location,
      client,
      commencementDate,
      finalizationDate,
      description,
      reset: () => {
        setFile(null);
        setTitle("");
        setSubCategory("");
        setLocation("");
        setClient("");
        setCommencementDate("");
        setFinalizationDate("");
        setDescription("");
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
    });
  };

  return (
    <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Upload className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Upload Media</h2>
          <p className="text-sm text-slate-500">
            Add a project image or video with details
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className={labelClass} htmlFor="media-title">
            Title
          </label>
          <input
            id="media-title"
            className={inputClass}
            placeholder="Project title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="media-category">
            Category
          </label>
          <select
            id="media-category"
            className={inputClass}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Completed Projects">Completed Projects</option>
            <option value="Ongoing Projects">Ongoing Projects</option>
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="media-subcategory">
            Sub Category
          </label>
          <select
            id="media-subcategory"
            className={inputClass}
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
          >
            <option value="">Select Sub Category</option>
            <option>Hotel</option>
            <option>Hydropower</option>
            <option>Parks</option>
            <option>Institutional Buildings</option>
            <option>Residential</option>
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="media-location">
            Location
          </label>
          <input
            id="media-location"
            className={inputClass}
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="media-client">
            Client
          </label>
          <input
            id="media-client"
            className={inputClass}
            placeholder="Client name"
            value={client}
            onChange={(e) => setClient(e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="media-start">
            Commencement Date
          </label>
          <input
            id="media-start"
            type="date"
            className={inputClass}
            value={commencementDate}
            onChange={(e) => setCommencementDate(e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="media-end">
            Finalization Date
          </label>
          <input
            id="media-end"
            type="date"
            className={inputClass}
            value={finalizationDate}
            onChange={(e) => setFinalizationDate(e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass} htmlFor="media-description">
            Description
          </label>
          <textarea
            id="media-description"
            rows={3}
            className={inputClass}
            placeholder="Short project description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass} htmlFor="media-file">
            File
          </label>
          <input
            id="media-file"
            ref={fileInputRef}
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
          />
          {file && (
            <p className="mt-2 text-xs text-slate-500">
              Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>
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
              Upload
            </>
          )}
        </button>
      </div>
    </div>
  );
}
