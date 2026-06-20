import { useState, useEffect } from "react";
import Card from "../Components/Card";
import Heading from "../Components/Heading";
import Button from "../Components/Button";
import Swal from "sweetalert2";
import { useAuthStateContext } from "../../../Utils/Contexts/AuthContext";
import { getAllUsers, updateUser, deleteUser } from "../../../Utils/Apis/UserApi";
import { toastSuccess, toastError } from "../../../Utils/Helpers/ToastHelpers";

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
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "mahasiswa", permission: [] });

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch { toastError("Gagal mengambil data user"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []); // eslint-disable-line react-hooks/set-state-in-effect

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form };
      if (!data.password) delete data.password;
      await updateUser(editId, data);
      toastSuccess("Data user berhasil diupdate");
      setShowModal(false);
      fetchUsers();
    } catch { toastError("Gagal menyimpan data"); }
  };

  const handleDelete = (id, name) => {
    Swal.fire({
      title: "Hapus user?",
      text: `Yakin ingin menghapus ${name}?`,
      icon: "warning", showCancelButton: true, confirmButtonColor: "#dc2626",
      confirmButtonText: "Ya, hapus", cancelButtonText: "Batal",
    }).then((res) => {
      if (res.isConfirmed) {
        deleteUser(id).then(() => { toastSuccess("User berhasil dihapus"); fetchUsers(); }).catch(() => toastError("Gagal menghapus user"));
      }
    });
  };

  if (loading) return <p className="text-center text-gray-500">Memuat data...</p>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <Heading as="h2" spacing="mb-0">Manajemen User</Heading>
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
                  <td className="px-4 py-3">{i + 1}</td>
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
