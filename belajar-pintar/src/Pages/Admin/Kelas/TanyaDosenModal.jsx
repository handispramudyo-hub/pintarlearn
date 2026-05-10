import { useState } from "react";
import Button from "../Components/Button";
import { toastSuccess } from "../../../Utils/Helpers/ToastHelpers";

const TanyaDosenModal = ({ isOpen, materi, onClose }) => {
  const [pertanyaan, setPertanyaan] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pertanyaan.trim()) return;
    toastSuccess(`Pertanyaan untuk modul "${materi?.judul}" berhasil dikirim!`);
    setPertanyaan("");
    onClose();
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-4 border-b flex justify-between items-center"><h2 className="text-lg font-semibold">💬 Tanya Dosen</h2><button onClick={onClose} className="text-gray-400 hover:text-red-500 text-2xl cursor-pointer">&times;</button></div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modul: <span className="text-blue-600">{materi?.judul}</span></label>
            <textarea value={pertanyaan} onChange={(e) => setPertanyaan(e.target.value)} rows={4} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm" placeholder="Tuliskan pertanyaan Anda..."></textarea>
          </div>
          <div className="flex justify-end gap-2"><Button type="button" variant="secondary" onClick={onClose}>Batal</Button><Button type="submit">Kirim Pertanyaan</Button></div>
        </form>
      </div>
    </div>
  );
};
export default TanyaDosenModal;