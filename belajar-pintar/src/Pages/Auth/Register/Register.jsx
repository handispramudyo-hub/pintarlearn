import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../Components/Input";
import Label from "../Components/Label";
import Button from "../Components/Button";
import Link from "../Components/Link";
import Card from "../Components/Card";
import Form from "../Components/Form";
import { register } from "../../../utils/Apis/AuthApi";
import { toastSuccess, toastError } from "../../../utils/Helpers/ToastHelpers";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", role: "mahasiswa" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toastError("Konfirmasi password tidak cocok"); return; }
    setLoading(true);
    try {
      const permission = form.role === "admin"
        ? ["dashboard.page", "kelas.page", "dosen.page", "dosen.read", "dosen.create", "dosen.update", "dosen.delete", "matakuliah.page", "matakuliah.read", "matakuliah.create", "matakuliah.update", "matakuliah.delete"]
        : ["dashboard.page", "kelas.page"];
      await register({ name: form.name, email: form.email, password: form.password, role: form.role, permission });
      toastSuccess("Registrasi berhasil! Silakan login.");
      navigate("/");
    } catch (err) {
      toastError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="bg-blue-600 text-white text-center py-6 -mx-5 -mt-5 md:-mx-8 md:-mt-8 mb-6">
        <div className="text-4xl mb-2">📚</div>
        <h1 className="text-2xl font-bold">Daftar Akun</h1>
        <p className="text-blue-100 text-sm mt-1">Buat akun baru untuk mulai belajar</p>
      </div>
      <Form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="name">Nama Lengkap</Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
            <Input type="text" name="name" placeholder="Masukkan nama" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="pl-10" />
          </div>
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📧</span>
            <Input type="email" name="email" placeholder="contoh@mail.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="pl-10" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
              <Input type="password" name="password" placeholder="Buat password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="pl-10" />
            </div>
          </div>
          <div>
            <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
              <Input type="password" name="confirmPassword" placeholder="Ulangi password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className="pl-10" />
            </div>
          </div>
        </div>
        <div>
          <Label htmlFor="role">Daftar Sebagai</Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🎓</span>
            <select name="role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm appearance-none bg-white">
              <option value="mahasiswa">Mahasiswa</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        <Button type="submit" className="w-full py-2.5" disabled={loading}>
          {loading ? "Mendaftarkan..." : "Buat Akun"}
        </Button>
      </Form>
      <p className="text-center text-sm text-gray-500 mt-6">
        Sudah punya akun?{" "}
        <Link href="/">Masuk</Link>
      </p>
    </Card>
  );
};
export default Register;