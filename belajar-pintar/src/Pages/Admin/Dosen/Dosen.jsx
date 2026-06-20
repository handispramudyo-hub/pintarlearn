import { useState, useEffect } from "react";
import Card from "../Components/Card";
import Heading from "../Components/Heading";
import Button from "../Components/Button";
import Swal from "sweetalert2";
import { useAuthStateContext } from "../../../Utils/Contexts/AuthContext";
import { getAllDosen, storeDosen, updateDosen, deleteDosen } from "../../../Utils/Apis/DosenApi";
import { toastSuccess, toastError } from "../../../Utils/Helpers/ToastHelpers";

const Dosen = () => {
  const { user } = useAuthStateContext();
  const p = (perm) => user?.permission?.includes(perm);
  const [dosen, setDosen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ nidn: "", nama: "", email: "", telp: "", alamat: "" });

  const fetchDosen = async () => {
    try {
      const res = await getAllDosen();
      setDosen(res.data);
    } catch { toastError("Gagal mengambil data dosen"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDosen(); }, []); // eslint-disable-line react-hooks/set-state-in-effect

  const openAdd = () => { setEditId(null); setForm({ nidn: "", nama: "", email: "", telp: "", alamat: "" }); setShowModal(true); };

  const openEdit = (d) => { setEditId(d.id); setForm({ nidn: d.nidn, nama: d.nama, email: d.email, telp: d.telp, alamat: d.alamat }); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) { await updateDosen(editId, form); toastSuccess("Data dosen berhasil diupdate"); }
      else { await storeDosen(form); toastSuccess("Data dosen berhasil ditambahkan"); }
      setShowModal(false);
      fetchDosen();
    } catch { toastError("Gagal menyimpan data"); }
  };

  const handleDelete = (id, nama) => {
    Swal.fire({
      title: "Hapus dosen?",
      text: `Yakin ingin menghapus ${nama}?`,
      icon: "warning", showCancelButton: true, confirmButtonColor: "#dc2626",
      confirmButtonText: "Ya, hapus", cancelButtonText: "Batal",
    }).then((res) => {
      if (res.isConfirmed) {
        deleteDosen(id).then(() => { toastSuccess("Dosen berhasil dihapus"); fetchDosen(); }).catch(() => toastError("Gagal menghapus dosen"));
      }
    });
  };

  if (loading) return <p className="text-center text-gray-500">Memuat data...</p>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <Heading as="h2" spacing="mb-0">Data Dosen</Heading>
          {p("dosen.create") && <Button onClick={openAdd}>+ Tambah Dosen</Button>}
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
                  <td className="px-4 py-3">{i + 1}</td>
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
