import { useState,useRef  } from "react";

export default function MediaForm({ onUpload, loading }) {
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

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleUpload = () => {
    if (!file) return alert("Select file");
    if (file.size > MAX_FILE_SIZE) {
    alert("File too large! Maximum allowed size is 5MB.");
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

        if (fileInputRef.current) {
        fileInputRef.current.value = "";
  }
      },
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4">Upload Media</h2>

      <input
        className="w-full border p-2 rounded mb-3"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <select
        className="w-full border p-3 rounded mb-3 bg-white"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="Completed Projects">Completed Projects</option>
        <option value="Ongoing Projects">Ongoing Projects</option>
      </select>

      <select
        className="w-full border p-3 rounded mb-3"
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

      <input
        className="w-full border p-2 rounded mb-3"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <input
        className="w-full border p-2 rounded mb-3"
        placeholder="Client"
        value={client}
        onChange={(e) => setClient(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <span className="text-sm text-gray-600 mb-1 block">
            Commencement Date
          </span>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={commencementDate}
            onChange={(e) => setCommencementDate(e.target.value)}
          />
        </div>

        <div>
          <span className="text-sm text-gray-600 mb-1 block">
            Finalization Date
          </span>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={finalizationDate}
            onChange={(e) => setFinalizationDate(e.target.value)}
          />
        </div>
      </div>

      <textarea
        className="w-full border p-2 rounded mb-3"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="mb-4">
        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) => setFile(e.target.files?.[0])}
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-3"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
