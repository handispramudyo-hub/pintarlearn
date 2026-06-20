import { useState } from "react";
import Card from "../Components/Card";
import Heading from "../Components/Heading";
import Button from "../Components/Button";
import Swal from "sweetalert2";
import { useAuthStateContext } from "../../../Utils/Contexts/AuthContext";
import { useKelas, useStoreKelas, useUpdateKelas, useDeleteKelas } from "../../../Utils/Hooks/useKelasManagement";
import { useDosen } from "../../../Utils/Hooks/useDosen";
import { useMatakuliah } from "../../../Utils/Hooks/useMatakuliah";
import { useUsers } from "../../../Utils/Hooks/useUser";

const initialState = { matakuliah_id: "", dosen_id: "", mahasiswa_ids: [] };
const MAX_MHS_PER_KELAS = 30;
const MAX_SKS_PER_SEMESTER = 24;

const SKSBar = ({ current, max }) => {
  const pct = max > 0 ? Math.min((current / max) * 100, 100) : 0;
  const over = current > max;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-200 rounded-full h-2 w-16">
        <div className={`h-2 rounded-full transition-all ${over ? "bg-red-500" : "bg-blue-500"}`} style={{ width: `${pct}%` }}></div>
      </div>
      <span className={`text-xs font-medium whitespace-nowrap ${over ? "text-red-600" : "text-gray-600"}`}>
        {current}/{max}
      </span>
    </div>
  );
};

const KelasManagement = () => {
  const { user } = useAuthStateContext();
  const p = (perm) => user?.permission?.includes(perm);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const { data: result = { data: [], total: 0 }, isLoading: kelasLoading } = useKelas({ _page: page, _limit: limit, q: search || undefined });
  const { data: allKelasResult = { data: [] } } = useKelas({ _limit: 10000 });
  const { data: dosenResult = { data: [] } } = useDosen({ _limit: 100 });
  const { data: matkulResult = { data: [] } } = useMatakuliah({ _limit: 100 });
  const { data: userResult = { data: [] } } = useUsers({ _limit: 100 });

  const kelas = result.data;
  const allKelas = allKelasResult.data;
  const totalPages = Math.ceil(result.total / limit);
  const allDosen = dosenResult.data;
  const allMatkul = matkulResult.data;
  const allMahasiswa = userResult.data.filter((u) => u.role === "mahasiswa");

  const { mutate: store } = useStoreKelas();
  const { mutate: update } = useUpdateKelas();
  const { mutate: remove } = useDeleteKelas();

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(initialState);

  const resetPage = () => setPage(1);

  const getMatkulById = (id) => allMatkul.find((m) => m.id === id);
  const getDosenById = (id) => allDosen.find((d) => d.id === id);

  const calcDosenKelasCount = (dosenId) => allKelas.filter((k) => k.dosen_id === dosenId).length;

  const calcMahasiswaSks = (userId) =>
    allKelas.filter((k) => k.mahasiswa_ids?.includes(userId))
      .reduce((sum, k) => sum + (getMatkulById(k.matakuliah_id)?.sks || 0), 0);

  const calcMahasiswaKelasCount = (userId) => allKelas.filter((k) => k.mahasiswa_ids?.includes(userId)).length;

  const getAvailableMatkul = () => {
    const assigned = new Set(allKelas.filter((k) => k.id !== editId).map((k) => k.matakuliah_id));
    return allMatkul.filter((m) => !assigned.has(m.id));
  };

  const openAdd = () => { setEditId(null); setForm(initialState); setShowModal(true); };

  const openEdit = (k) => {
    setEditId(k.id);
    setForm({ matakuliah_id: k.matakuliah_id, dosen_id: k.dosen_id, mahasiswa_ids: [...(k.mahasiswa_ids || [])] });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.matakuliah_id || !form.dosen_id) return;
    if (editId) {
      update({ id: editId, data: form });
    } else {
      store(form);
    }
    setShowModal(false);
  };

  const handleDelete = (id, label) => {
    Swal.fire({
      title: "Hapus kelas?",
      text: `Yakin ingin menghapus ${label}?`,
      icon: "warning", showCancelButton: true, confirmButtonColor: "#dc2626",
      confirmButtonText: "Ya, hapus", cancelButtonText: "Batal",
    }).then((res) => {
      if (res.isConfirmed) remove(id);
    });
  };

  const toggleMahasiswa = (id) => {
    setForm((prev) => ({
      ...prev,
      mahasiswa_ids: prev.mahasiswa_ids.includes(id)
        ? prev.mahasiswa_ids.filter((x) => x !== id)
        : [...prev.mahasiswa_ids, id],
    }));
  };

  const dosenKelas = allDosen.map((d) => ({ ...d, totalKelas: calcDosenKelasCount(d.id) }));
  const mahasiswaSks = allMahasiswa.map((u) => ({ ...u, totalSks: calcMahasiswaSks(u.id), totalKelas: calcMahasiswaKelasCount(u.id) }));

  const totalSksAll = allKelas.reduce((sum, k) => sum + (getMatkulById(k.matakuliah_id)?.sks || 0), 0);

  if (kelasLoading) return <p className="text-center text-gray-500">Memuat data...</p>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center py-4">
          <p className="text-3xl font-bold text-blue-600">{kelas.length}</p>
          <p className="text-gray-500 text-sm mt-1">Total Kelas</p>
        </Card>
        <Card className="text-center py-4">
          <p className="text-3xl font-bold text-green-600">{totalSksAll}</p>
          <p className="text-gray-500 text-sm mt-1">Total SKS</p>
        </Card>
        <Card className="text-center py-4">
          <p className="text-3xl font-bold text-purple-600">{dosenKelas.filter((d) => d.totalKelas > 0).length}</p>
          <p className="text-gray-500 text-sm mt-1">Dosen Aktif</p>
        </Card>
        <Card className="text-center py-4">
          <p className="text-3xl font-bold text-orange-600">{mahasiswaSks.filter((m) => m.totalKelas > 0).length}</p>
          <p className="text-gray-500 text-sm mt-1">Mahasiswa Terdaftar</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <Heading as="h2" spacing="mb-0">Daftar Kelas</Heading>
              {p("kelola-kelas.create") && <Button onClick={openAdd}>+ Tambah Kelas</Button>}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <input type="text" placeholder="Cari matakuliah..." value={search} onChange={(e) => { setSearch(e.target.value); resetPage(); }} className="flex-grow px-3 py-1.5 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm" />
              <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); resetPage(); }} className="px-3 py-1.5 border rounded-lg text-sm">
                <option value={5}>5/ hal</option>
                <option value={10}>10/ hal</option>
                <option value={25}>25/ hal</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">No</th>
                    <th className="px-4 py-3 font-medium">Matakuliah</th>
                    <th className="px-4 py-3 font-medium">Dosen</th>
                    <th className="px-4 py-3 font-medium">Mahasiswa</th>
                    <th className="px-4 py-3 font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {kelas.map((k, i) => {
                    const mk = getMatkulById(k.matakuliah_id);
                    const d = getDosenById(k.dosen_id);
                    const mhs = (k.mahasiswa_ids || []).map((id) => allMahasiswa.find((u) => u.id === id)).filter(Boolean);
                    const mhsCount = mhs.length;
                    const overLimit = mhsCount > MAX_MHS_PER_KELAS;
                    return (
                      <tr key={k.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{(page - 1) * limit + i + 1}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium">{mk?.nama || "—"}</div>
                          <div className="text-xs text-gray-400">{mk?.kode || ""} — {mk?.sks || "?"} SKS</div>
                        </td>
                        <td className="px-4 py-3">
                          {d ? (
                            <div>
                              <div className="font-medium text-sm">{d.nama}</div>
                              <div className="text-xs text-gray-400 mt-0.5">
                                Mengajar {calcDosenKelasCount(d.id)} kelas
                              </div>
                              <div className={`text-xs font-medium mt-0.5 ${overLimit ? "text-red-600" : "text-green-600"}`}>
                                Mahasiswa: {mhsCount}/{MAX_MHS_PER_KELAS}
                              </div>
                            </div>
                          ) : <span className="text-gray-400">—</span>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1.5">
                            {mhs.length === 0 ? (
                              <span className="text-gray-400">—</span>
                            ) : mhs.map((m) => (
                              <div key={m.id} className="flex items-center gap-2">
                                <span className="text-sm">{m.name}</span>
                                <SKSBar current={calcMahasiswaSks(m.id)} max={MAX_SKS_PER_SEMESTER} />
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            {p("kelola-kelas.update") && <Button size="sm" variant="info" onClick={() => openEdit(k)}>Edit</Button>}
                            {p("kelola-kelas.delete") && <Button size="sm" variant="danger" onClick={() => handleDelete(k.id, mk?.nama || "kelas")}>Hapus</Button>}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {kelas.length === 0 && <p className="text-center text-gray-400 py-8">Belum ada kelas</p>}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-500">Hal {page}/{totalPages} ({result.total} data)</p>
                <div className="flex gap-2">
                  <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1} className="px-3 py-1 bg-gray-200 rounded text-sm disabled:opacity-50 cursor-pointer">Prev</button>
                  <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages} className="px-3 py-1 bg-gray-200 rounded text-sm disabled:opacity-50 cursor-pointer">Next</button>
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <Card>
            <Heading as="h3" spacing="mb-3">Beban Kelas Dosen</Heading>
            <p className="text-xs text-gray-400 mb-2">Maksimal {MAX_MHS_PER_KELAS} mahasiswa per kelas</p>
            <div className="space-y-3">
              {dosenKelas.map((d) => (
                <div key={d.id} className="text-sm">
                  <div className="font-medium truncate">{d.nama.split(",")[0]}</div>
                  <div className="text-xs text-gray-500">Mengajar {d.totalKelas} kelas</div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <Heading as="h3" spacing="mb-3">Beban SKS Mahasiswa</Heading>
            <p className="text-xs text-gray-400 mb-2">Maksimal {MAX_SKS_PER_SEMESTER} SKS per semester</p>
            <div className="space-y-3">
              {mahasiswaSks.map((m) => (
                <div key={m.id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="truncate">{m.name}</span>
                    <span className={m.totalSks > MAX_SKS_PER_SEMESTER ? "text-red-600 font-bold" : "text-gray-500"}>{m.totalSks}/{MAX_SKS_PER_SEMESTER}</span>
                  </div>
                  <SKSBar current={m.totalSks} max={MAX_SKS_PER_SEMESTER} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">{editId ? "Edit Kelas" : "Tambah Kelas"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 text-2xl cursor-pointer">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Matakuliah</label>
                <select value={form.matakuliah_id} onChange={(e) => setForm({ ...form, matakuliah_id: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm" required>
                  <option value="">-- Pilih Matakuliah --</option>
                  {getAvailableMatkul().map((mk) => (
                    <option key={mk.id} value={mk.id}>{mk.nama} ({mk.kode}) — {mk.sks} SKS</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Dosen Pengampu</label>
                <select value={form.dosen_id} onChange={(e) => setForm({ ...form, dosen_id: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm" required>
                  <option value="">-- Pilih Dosen --</option>
                  {allDosen.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nama} (mengajar {calcDosenKelasCount(d.id)} kelas — max {MAX_MHS_PER_KELAS} mahasiswa/kelas)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Daftar Mahasiswa
                  {form.matakuliah_id && (
                    <span className="text-xs text-gray-400 ml-2">
                      (maksimal {MAX_MHS_PER_KELAS} mahasiswa per kelas)
                    </span>
                  )}
                </label>
                {allMahasiswa.length === 0 ? (
                  <p className="text-sm text-gray-400 py-4 text-center">Belum ada mahasiswa terdaftar</p>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-lg p-2">
                      {allMahasiswa.map((m) => {
                        const mkSks = getMatkulById(form.matakuliah_id)?.sks || 0;
                        const editSks = editId ? getMatkulById(allKelas.find((k) => k.id === editId)?.matakuliah_id)?.sks || 0 : 0;
                        const sksAfter = calcMahasiswaSks(m.id) - editSks + mkSks;
                        const sksOver = sksAfter > MAX_SKS_PER_SEMESTER;
                        const checked = form.mahasiswa_ids.includes(m.id);
                        return (
                          <label key={m.id} className={`flex items-center gap-2 p-2 rounded border cursor-pointer text-sm ${checked ? "border-blue-400 bg-blue-50" : "border-gray-200"} ${sksOver && !checked ? "opacity-50" : ""}`}>
                            <input type="checkbox" checked={checked} onChange={() => toggleMahasiswa(m.id)} className="cursor-pointer" />
                            <span className="flex-1">{m.name}</span>
                            <span className={`text-xs font-medium px-1.5 py-0.5 rounded whitespace-nowrap ${sksOver ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                              {sksAfter}/{MAX_SKS_PER_SEMESTER}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                    {form.matakuliah_id && (
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-gray-500">
                          {form.mahasiswa_ids.length} mahasiswa dipilih
                        </p>
                        <p className={`text-xs font-medium ${form.mahasiswa_ids.length > MAX_MHS_PER_KELAS ? "text-red-600" : form.mahasiswa_ids.length === MAX_MHS_PER_KELAS ? "text-yellow-600" : "text-green-600"}`}>
                          {form.mahasiswa_ids.length > MAX_MHS_PER_KELAS
                            ? `Melebihi batas (${MAX_MHS_PER_KELAS})!`
                            : `Sisa: ${MAX_MHS_PER_KELAS - form.mahasiswa_ids.length} kursi`
                          }
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Batal</Button>
                <Button type="submit" disabled={form.mahasiswa_ids.length > MAX_MHS_PER_KELAS}>
                  {editId ? "Update" : "Simpan"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default KelasManagement;
