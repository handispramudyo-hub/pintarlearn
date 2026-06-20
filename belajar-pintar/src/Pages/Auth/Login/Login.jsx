import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Input from "../Components/Input";
import Label from "../Components/Label";
import Button from "../Components/Button";
import Link from "../Components/Link";
import Card from "../Components/Card";
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
    <Card className="overflow-hidden">
      <div className="bg-blue-600 text-white text-center py-6 -mx-5 -mt-5 md:-mx-8 md:-mt-8 mb-6">
        <div className="text-4xl mb-2">📚</div>
        <h1 className="text-2xl font-bold">Belajar Pintar</h1>
        <p className="text-blue-100 text-sm mt-1">Platform Pembelajaran Digital</p>
      </div>
      <Form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="email">Email</Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📧</span>
            <Input type="email" name="email" placeholder="admin@mail.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="pl-10" />
          </div>
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
            <Input type="password" name="password" placeholder="Masukkan password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="pl-10" />
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded text-blue-600" />
            <span className="text-gray-600">Ingat saya</span>
          </label>
          <Link href="#">Lupa password?</Link>
        </div>
        <Button type="submit" className="w-full py-2.5" disabled={loading}>
          {loading ? "Memproses..." : "Masuk"}
        </Button>
      </Form>
      <p className="text-center text-sm text-gray-500 mt-6">
        Belum punya akun?{" "}
        <Link href="/register">Daftar sekarang</Link>
      </p>
    </Card>
  );
};
export default Login;