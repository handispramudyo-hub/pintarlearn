import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../Components/Input";
import Label from "../Components/Label";
import Button from "../Components/Button";
import Link from "../Components/Link";
import Card from "../Components/Card";
import Heading from "../Components/Heading";
import Form from "../Components/Form";
import { register } from "../../../Utils/Apis/AuthApi";
import { toastSuccess, toastError } from "../../../Utils/Helpers/ToastHelpers";

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
    <Card>
      <Heading as="h2">Daftar Akun</Heading>
      <p className="text-center text-gray-500 mb-6 -mt-4">Buat akun baru untuk mulai belajar</p>
      <Form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="name">Nama Lengkap</Label>
          <Input type="text" name="name" placeholder="Masukkan nama" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input type="email" name="email" placeholder="contoh@mail.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input type="password" name="password" placeholder="Buat password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
          <Input type="password" name="confirmPassword" placeholder="Ulangi password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="role">Daftar Sebagai</Label>
          <select name="role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm">
            <option value="mahasiswa">Mahasiswa</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Mendaftarkan..." : "Daftar"}</Button>
      </Form>
      <p className="text-center text-sm text-gray-500 mt-4">Sudah punya akun? <Link href="/">Login</Link></p>
    </Card>
  );
};
export default Register;
