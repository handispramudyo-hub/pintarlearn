import { useState } from "react";
import Card from "../Components/Card";
import Heading from "../Components/Heading";
import Button from "../Components/Button";
import Swal from "sweetalert2";
import { useAuthStateContext } from "../../../Utils/Contexts/AuthContext";
import { useMatakuliah, useStoreMatakuliah, useUpdateMatakuliah, useDeleteMatakuliah } from "../../../utils/Hooks/useMatakuliah";

const initialState = { kode: "", nama: "", sks: "", dosen: "", semester: "" };

const Matakuliah = () => {
  const { user } = useAuthStateContext();
  const p = (perm) => user?.permission?.includes(perm);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("nama");
  const [sortOrder, setSortOrder] = useState("asc");

  const { data: result = { data: [], total: 0 }, isLoading } = useMatakuliah({
    q: search || undefined,
    _sort: sortBy,
    _order: sortOrder,
    _page: page,
    _limit: limit,
  });

  const matkul = result.data;
  const totalPages = Math.ceil(result.total / limit);

  const { mutate: store } = useStoreMatakuliah();
  const { mutate: update } = useUpdateMatakuliah();
  const { mutate: remove } = useDeleteMatakuliah();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(initialState);

  const resetPage = () => setPage(1);

  const openAdd = () => { setEditId(null); setForm(initialState); setShowModal(true); };

  const openEdit = (m) => { setEditId(m.id); setForm({ kode: m.kode, nama: m.nama, sks: m.sks, dosen: m.dosen, semester: m.semester }); setShowModal(true); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      update({ id: editId, data: form });
    } else {
      store(form);
    }
    setShowModal(false);
  };

  const handleDelete = (id, nama) => {
    Swal.fire({
      title: "Hapus matakuliah?",
      text: `Yakin ingin menghapus ${nama}?`,
      icon: "warning", showCancelButton: true, confirmButtonColor: "#dc2626",
      confirmButtonText: "Ya, hapus", cancelButtonText: "Batal",
    }).then((res) => {
      if (res.isConfirmed) {
        remove(id);
      }
    });
  };

  if (isLoading) return <p className="text-center text-gray-500">Memuat data...</p>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Heading as="h2" spacing="mb-0">Data Matakuliah</Heading>
          {p("matakuliah.create") && <Button onClick={openAdd}>+ Tambah Matakuliah</Button>}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <input type="text" placeholder="Cari matakuliah..." value={search} onChange={(e) => { setSearch(e.target.value); resetPage(); }} className="flex-grow px-3 py-1.5 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm" />
          <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); resetPage(); }} className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring focus:ring-blue-300">
            <option value="nama">Sort by Nama</option>
            <option value="kode">Sort by Kode</option>
            <option value="sks">Sort by SKS</option>
            <option value="semester">Sort by Semester</option>
          </select>
          <select value={sortOrder} onChange={(e) => { setSortOrder(e.target.value); resetPage(); }} className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring focus:ring-blue-300">
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
          <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); resetPage(); }} className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring focus:ring-blue-300">
            <option value={5}>5 / hal</option>
            <option value={10}>10 / hal</option>
            <option value={25}>25 / hal</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 font-medium">No</th>
                <th className="px-4 py-3 font-medium">Kode</th>
                <th className="px-4 py-3 font-medium">Nama Matakuliah</th>
                <th className="px-4 py-3 font-medium">SKS</th>
                <th className="px-4 py-3 font-medium">Dosen</th>
                <th className="px-4 py-3 font-medium">Semester</th>
                <th className="px-4 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {matkul.map((m, i) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{(page - 1) * limit + i + 1}</td>
                  <td className="px-4 py-3 font-mono text-xs">{m.kode}</td>
                  <td className="px-4 py-3 font-medium">{m.nama}</td>
                  <td className="px-4 py-3">{m.sks}</td>
                  <td className="px-4 py-3 text-gray-500">{m.dosen}</td>
                  <td className="px-4 py-3">Semester {m.semester}</td>
                  <td className="px-4 py-3 flex gap-2">
                    {p("matakuliah.update") && <Button size="sm" variant="info" onClick={() => openEdit(m)}>Edit</Button>}
                    {p("matakuliah.delete") && <Button size="sm" variant="danger" onClick={() => handleDelete(m.id, m.nama)}>Hapus</Button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {matkul.length === 0 && <p className="text-center text-gray-400 py-8">Belum ada data matakuliah</p>}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500">Halaman {page} dari {totalPages} ({result.total} data)</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1} className="px-3 py-1 bg-gray-200 rounded text-sm disabled:opacity-50 cursor-pointer">Prev</button>
              <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages} className="px-3 py-1 bg-gray-200 rounded text-sm disabled:opacity-50 cursor-pointer">Next</button>
            </div>
          </div>
        )}
      </Card>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">{editId ? "Edit Matakuliah" : "Tambah Matakuliah"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 text-2xl cursor-pointer">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kode MK</label>
                <input type="text" value={form.kode} onChange={(e) => setForm({ ...form, kode: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Matakuliah</label>
                <input type="text" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm" required />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKS</label>
                  <input type="number" value={form.sks} onChange={(e) => setForm({ ...form, sks: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm" required min="1" max="6" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                  <input type="number" value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm" required min="1" max="14" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dosen Pengampu</label>
                <input type="text" value={form.dosen} onChange={(e) => setForm({ ...form, dosen: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm" required />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Batal</Button>
                <Button type="submit">{editId ? "Update" : "Simpan"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Matakuliah;
