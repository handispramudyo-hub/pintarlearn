import Button from "../Components/Button";

const MateriAccordion = ({ item, index, isActive, onToggle, onTandaiSelesai, onTanyaDosen }) => {
  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      <button onClick={onToggle} className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition cursor-pointer">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">Modul {index + 1}</span>
          <h3 className="font-medium text-gray-800">{item.judul}</h3>
          {item.selesai && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Selesai</span>}
        </div>
        <span className={`text-gray-500 transition-transform ${isActive ? "rotate-180" : ""}`}>▼</span>
      </button>
      {isActive && (
        <div className="p-4 border-t bg-gray-50">
          <p className="text-gray-600 mb-6">{item.deskripsi}</p>
          <div className="flex gap-3">
            <Button onClick={(e) => { e.stopPropagation(); onTandaiSelesai(); }} variant={item.selesai ? "secondary" : "success"} size="sm" disabled={item.selesai}>{item.selesai ? "✅ Sudah Selesai" : "📌 Tandai Selesai"}</Button>
            <Button onClick={(e) => { e.stopPropagation(); onTanyaDosen(); }} variant="info" size="sm">💬 Tanya Dosen</Button>
          </div>
        </div>
      )}
    </div>
  );
};
export default MateriAccordion;
