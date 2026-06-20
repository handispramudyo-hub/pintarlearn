import { useState } from "react";
import Card from "../Components/Card";
import Heading from "../Components/Heading";
import Button from "../Components/Button";
import Swal from "sweetalert2";
import { useAuthStateContext } from "../../../Utils/Contexts/AuthContext";
import { useDosen, useStoreDosen, useUpdateDosen, useDeleteDosen } from "../../../utils/Hooks/useDosen";

const initialState = { nidn: "", nama: "", email: "", telp: "", alamat: "" };

const Dosen = () => {
  const { user } = useAuthStateContext();
  const p = (perm) => user?.permission?.includes(perm);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("nama");
  const [sortOrder, setSortOrder] = useState("asc");

  const { data: result = { data: [], total: 0 }, isLoading } = useDosen({
    q: search || undefined,
    _sort: sortBy,
    _order: sortOrder,
    _page: page,
    _limit: limit,
  });

  const dosen = result.data;
  const totalPages = Math.ceil(result.total / limit);

  const { mutate: store } = useStoreDosen();
  const { mutate: update } = useUpdateDosen();
  const { mutate: remove } = useDeleteDosen();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(initialState);

  const resetPage = () => setPage(1);

  const openAdd = () => { setEditId(null); setForm(initialState); setShowModal(true); };

  const openEdit = (d) => { setEditId(d.id); setForm({ nidn: d.nidn, nama: d.nama, email: d.email, telp: d.telp, alamat: d.alamat }); setShowModal(true); };

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
      title: "Hapus dosen?",
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
          <Heading as="h2" spacing="mb-0">Data Dosen</Heading>
          {p("dosen.create") && <Button onClick={openAdd}>+ Tambah Dosen</Button>}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <input type="text" placeholder="Cari dosen..." value={search} onChange={(e) => { setSearch(e.target.value); resetPage(); }} className="flex-grow px-3 py-1.5 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm" />
          <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); resetPage(); }} className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring focus:ring-blue-300">
            <option value="nama">Sort by Nama</option>
            <option value="nidn">Sort by NIDN</option>
            <option value="email">Sort by Email</option>
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
                <th className="px-4 py-3 font-medium">NIDN</th>
                <th className="px-4 py-3 font-medium">Nama</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Telepon</th>
                <th className="px-4 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dosen.map((d, i) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{(page - 1) * limit + i + 1}</td>
                  <td className="px-4 py-3 font-mono text-xs">{d.nidn}</td>
                  <td className="px-4 py-3 font-medium">{d.nama}</td>
                  <td className="px-4 py-3 text-gray-500">{d.email}</td>
                  <td className="px-4 py-3 text-gray-500">{d.telp}</td>
                  <td className="px-4 py-3 flex gap-2">
                    {p("dosen.update") && <Button size="sm" variant="info" onClick={() => openEdit(d)}>Edit</Button>}
                    {p("dosen.delete") && <Button size="sm" variant="danger" onClick={() => handleDelete(d.id, d.nama)}>Hapus</Button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {dosen.length === 0 && <p className="text-center text-gray-400 py-8">Belum ada data dosen</p>}
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
              <h2 className="text-lg font-semibold">{editId ? "Edit Dosen" : "Tambah Dosen"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 text-2xl cursor-pointer">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIDN</label>
                <input type="text" value={form.nidn} onChange={(e) => setForm({ ...form, nidn: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input type="text" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                <input type="text" value={form.telp} onChange={(e) => setForm({ ...form, telp: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                <textarea value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })} rows={3} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm"></textarea>
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
export default Dosen;
