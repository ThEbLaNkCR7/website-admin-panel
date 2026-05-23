import { useState } from "react";

export default function GalleryForm({ onUpload, loading }) {
  const [category, setCategory] = useState("Completed Projects");
  const [files, setFiles] = useState([]);
  const [titles, setTitles] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    setFiles(selectedFiles);

    setTitles(selectedFiles.map((file) => file.name.split(".")[0]));
  };

  const handleTitleChange = (index, value) => {
    const updated = [...titles];
    updated[index] = value;
    setTitles(updated);
  };

  const handleUpload = () => {
    if (files.length === 0) {
      return alert("Select at least one file");
    }

    onUpload({
      category,
      files,
      titles,
      reset: () => {
        setCategory("Completed Projects");
        setFiles([]);
        setTitles([]);
      },
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4">Upload Gallery Files</h2>

      <select
        className="w-full border p-3 rounded mb-4 bg-white"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="Completed Projects">Completed Projects</option>
        <option value="Ongoing Projects">Ongoing Projects</option>
      </select>

      <input
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="block w-full text-sm mb-4 text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700"
      />

      {files.length > 0 && (
        <div className="space-y-3 mb-4">
          <p className="font-medium">File Titles</p>

          {files.map((file, index) => (
            <div key={index}>
              <p className="text-sm text-gray-500 mb-1">{file.name}</p>

              <input
                type="text"
                value={titles[index]}
                onChange={(e) => handleTitleChange(index, e.target.value)}
                placeholder="Enter title"
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Uploading..." : "Upload Files"}
      </button>
    </div>
  );
}
