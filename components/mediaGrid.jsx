export default function MediaGrid({
  media = [],
  onDelete,
  onUpdate,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {media.map((m) => (
        <div key={m.projectId} className="bg-white rounded-xl shadow-md overflow-hidden">
          <img src={m.url} className="w-full h-48 object-cover" />

          <div className="p-4">
            <p className="text-lg text-gray-950">
              {m.title}
            </p>

            <p className="text-sm text-gray-600">
              {m.category} • {m.location}
            </p>

            <button
              onClick={() => onDelete(m.projectId)}
              className="bg-red-500 text-white px-3 py-1 rounded mt-2"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}