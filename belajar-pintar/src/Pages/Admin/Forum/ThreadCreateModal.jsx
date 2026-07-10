import { useState } from "react";
import Button from "../Components/Button";
import { useStoreThread } from "../../../utils/Hooks/useForum";

const ThreadCreateModal = ({ isOpen, onClose, categories, onCreated }) => {
  const { mutate: store, isPending } = useStoreThread();
  const [form, setForm] = useState({ judul: "", category_id: "", konten: "", tags: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    store(
      {
        ...form,
        category_id: Number(form.category_id),
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        author_id: user?.id,
        upvotes: 0,
        downvotes: 0,
        solved: false,
        pinned: false,
        created_at: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          setForm({ judul: "", category_id: "", konten: "", tags: "" });
          onCreated?.();
          onClose();
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Buat Thread Baru</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 text-2xl cursor-pointer">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
            <input type="text" value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm" required>
              <option value="">Pilih kategori</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.nama}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Konten</label>
            <textarea value={form.konten} onChange={(e) => setForm({ ...form, konten: e.target.value })} rows={5} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm" required></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (pisahkan dengan koma)</label>
            <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm" placeholder="contoh: javascript, react, tailwind" />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
            <Button type="submit" disabled={isPending}>{isPending ? "Menyimpan..." : "Simpan"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ThreadCreateModal;
