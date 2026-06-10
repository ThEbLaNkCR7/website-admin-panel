export default function MediaGrid({ media = [], onDelete, onUpdate }) {
 return (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
   {media.map((m) => (
    <div
     key={m.projectId}
     className="bg-white rounded-md shadow-sm hover:shadow-md transition overflow-hidden border"
    >
     {/* IMAGE */}
     <img src={m.url} alt={m.title} className="w-full h-24 object-cover" />

     {/* CONTENT */}
     <div className="p-2">
      <p className="text-xs font-semibold text-gray-900 truncate">{m.title}</p>
      <p className="text-[10px] text-gray-500 truncate">{m.category}</p>
      <p className="text-[10px] text-gray-500 truncate">{m.subCategory}</p>

      <button
       onClick={() => onDelete(m.projectId)}
       className="mt-2 w-full bg-red-500 hover:bg-red-600 text-white text-[10px] py-1 rounded"
      >
       Delete
      </button>
     </div>
    </div>
   ))}
  </div>
 );
}
