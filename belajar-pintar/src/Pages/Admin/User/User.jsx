import { useState } from "react";
import Card from "../Components/Card";
import Heading from "../Components/Heading";
import Button from "../Components/Button";
import Swal from "sweetalert2";
import { useAuthStateContext } from "../../../utils/Contexts/AuthContext";
import { useUsers, useUpdateUser, useDeleteUser } from "../../../utils/Hooks/useUser";

const permissionGroups = {
  Dashboard: ["dashboard.page"],
  Kelas: ["kelas.page"],
  Dosen: ["dosen.page", "dosen.read", "dosen.create", "dosen.update", "dosen.delete"],
  Matakuliah: ["matakuliah.page", "matakuliah.read", "matakuliah.create", "matakuliah.update", "matakuliah.delete"],
  User: ["user.page", "user.read", "user.create", "user.update", "user.delete"],
};

const allPermissions = Object.values(permissionGroups).flat();

const rolePresets = {
  admin: [...allPermissions],
  mahasiswa: ["dashboard.page", "kelas.page"],
};

const User = () => {
  const { user: currentUser } = useAuthStateContext();
  const p = (perm) => currentUser?.permission?.includes(perm);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const { data: result = { data: [], total: 0 }, isLoading } = useUsers({
    q: search || undefined,
    _sort: sortBy,
    _order: sortOrder,
    _page: page,
    _limit: limit,
  });

  const users = result.data;
  const totalPages = Math.ceil(result.total / limit);

  const { mutate: update } = useUpdateUser();
  const { mutate: remove } = useDeleteUser();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "mahasiswa", permission: [] });

  const resetPage = () => setPage(1);

  const openEdit = (u) => {
    setEditId(u.id);
    setForm({ name: u.name, email: u.email, password: "", role: u.role, permission: [...u.permission] });
    setShowModal(true);
  };

  const togglePermission = (perm) => {
    setForm((prev) => ({
      ...prev,
      permission: prev.permission.includes(perm)
        ? prev.permission.filter((p) => p !== perm)
        : [...prev.permission, perm],
    }));
  };

  const toggleGroup = (groupPerms) => {
    const allSelected = groupPerms.every((perm) => form.permission.includes(perm));
    setForm((prev) => ({
      ...prev,
      permission: allSelected
        ? prev.permission.filter((p) => !groupPerms.includes(p))
        : [...new Set([...prev.permission, ...groupPerms])],
    }));
  };

  const applyRolePreset = () => {
    setForm((prev) => ({ ...prev, permission: [...(rolePresets[prev.role] || [])] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form };
    if (!data.password) delete data.password;
    update({ id: editId, data });
    setShowModal(false);
  };

  const handleDelete = (id, name) => {
    Swal.fire({
      title: "Hapus user?",
      text: `Yakin ingin menghapus ${name}?`,
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
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Heading as="h2" spacing="mb-0">Manajemen User</Heading>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <input type="text" placeholder="Cari user..." value={search} onChange={(e) => { setSearch(e.target.value); resetPage(); }} className="flex-grow px-3 py-1.5 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm" />
          <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); resetPage(); }} className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring focus:ring-blue-300">
            <option value="name">Sort by Nama</option>
            <option value="email">Sort by Email</option>
            <option value="role">Sort by Role</option>
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
                <th className="px-4 py-3 font-medium">Nama</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Permission</th>
                <th className="px-4 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((u, i) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{(page - 1) * limit + i + 1}</td>
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {u.permission.slice(0, 3).map((perm) => (
                        <span key={perm} className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">{perm}</span>
                      ))}
                      {u.permission.length > 3 && (
                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">+{u.permission.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    {p("user.update") && <Button size="sm" variant="info" onClick={() => openEdit(u)}>Edit</Button>}
                    {p("user.delete") && u.id !== currentUser?.id && <Button size="sm" variant="danger" onClick={() => handleDelete(u.id, u.name)}>Hapus</Button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <p className="text-center text-gray-400 py-8">Belum ada data user</p>}
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
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold">Edit User</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 text-2xl cursor-pointer">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password {editId && <span className="text-gray-400 font-normal">(biarkan kosong jika tidak diubah)</span>}</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm" placeholder={editId ? "Kosongkan jika tidak diubah" : "Masukkan password"} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm">
                  <option value="mahasiswa">Mahasiswa</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Permission</label>
                  <Button type="button" size="sm" variant="secondary" onClick={applyRolePreset}>Set Sesuai Role</Button>
                </div>
                <div className="space-y-3 border rounded-lg p-4 bg-gray-50">
                  {Object.entries(permissionGroups).map(([group, perms]) => {
                    const allSelected = perms.every((perm) => form.permission.includes(perm));
                    return (
                      <div key={group}>
                        <div className="flex items-center gap-2 mb-1">
                          <input type="checkbox" checked={allSelected} onChange={() => toggleGroup(perms)} className="rounded cursor-pointer" id={`group-${group}`} />
                          <label htmlFor={`group-${group}`} className="text-sm font-semibold text-gray-700 cursor-pointer">{group}</label>
                        </div>
                        <div className="flex flex-wrap gap-2 ml-5">
                          {perms.map((perm) => (
                            <label key={perm} className="flex items-center gap-1 text-xs text-gray-600 cursor-pointer">
                              <input type="checkbox" checked={form.permission.includes(perm)} onChange={() => togglePermission(perm)} className="rounded cursor-pointer" />
                              {perm}
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Batal</Button>
                <Button type="submit">Simpan</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default User;
