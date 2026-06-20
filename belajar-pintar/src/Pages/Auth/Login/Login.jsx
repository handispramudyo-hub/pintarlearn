import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Input from "../Components/Input";
import Label from "../Components/Label";
import Button from "../Components/Button";
import Link from "../Components/Link";
import Card from "../Components/Card";
import Heading from "../Components/Heading";
import Form from "../Components/Form";
import { login } from "../../../utils/Apis/AuthApi";
import { useAuthStateContext } from "../../../utils/Contexts/AuthContext";
import { toastSuccess, toastError } from "../../../utils/Helpers/ToastHelpers";

const Login = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStateContext();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  if (user) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      setUser(user);
      toastSuccess("Login berhasil! Mengalihkan...");
      setTimeout(() => navigate("/admin/dashboard"), 10);
    } catch (err) {
      toastError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Heading as="h2">Belajar Pintar</Heading>
      <p className="text-center text-gray-500 mb-6 -mt-4">Platform Pembelajaran Digital</p>
      <Form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input type="email" name="email" placeholder="admin@mail.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input type="password" name="password" placeholder="Masukkan password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <div className="flex justify-between items-center">
          <label className="flex items-center cursor-pointer"><input type="checkbox" className="mr-2 rounded" /><span className="text-sm text-gray-600">Ingat saya</span></label>
          <Link href="#">Lupa password?</Link>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Memproses..." : "Login"}</Button>
      </Form>
      <p className="text-center text-sm text-gray-500 mt-4">Belum punya akun? <Link href="/register">Daftar</Link></p>
    </Card>
  );
};
export default Login;
