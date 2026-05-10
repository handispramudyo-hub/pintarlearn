import { useNavigate } from "react-router-dom";
import Input from "../Components/Input";
import Label from "../Components/Label";
import Button from "../Components/Button";
import Link from "../Components/Link";
import Card from "../Components/Card";
import Heading from "../Components/Heading";
import Form from "../Components/Form";
import { dummyUser } from "../../../utils/dummyData";
import { toastSuccess, toastError } from "../../../Utils/Helpers/ToastHelpers";

const Login = () => {
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    if (email === dummyUser.email && password === dummyUser.password) {
      localStorage.setItem("user", JSON.stringify(dummyUser));
      toastSuccess("Login berhasil! Mengalihkan...");
      setTimeout(() => navigate("/admin/dashboard"), 1500);
    } else {
      toastError("Email atau password salah!");
    }
  };
  return (
    <Card>
      <Heading as="h2">Belajar Pintar</Heading>
      <p className="text-center text-gray-500 mb-6 -mt-4">Platform Pembelajaran Digital</p>
      <Form onSubmit={handleSubmit}>
        <div><Label htmlFor="email">Email</Label><Input type="email" name="email" placeholder="mahasiswa@belajar.com" /></div>
        <div><Label htmlFor="password">Password</Label><Input type="password" name="password" placeholder="Masukkan password" /></div>
        <div className="flex justify-between items-center">
          <label className="flex items-center cursor-pointer"><input type="checkbox" className="mr-2 rounded" /><span className="text-sm text-gray-600">Ingat saya</span></label>
          <Link href="#" className="text-sm">Lupa password?</Link>
        </div>
        <Button type="submit" className="w-full">Login</Button>
      </Form>
    </Card>
  );
};
export default Login;