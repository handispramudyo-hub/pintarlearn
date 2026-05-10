const fs = require("fs");
const path = require("path");

const files = {
  // ================= UTILS & HELPERS =================
  "src/utils/dummyData.js": `export const dummyUser = {
  email: "mahasiswa@belajar.com",
  password: "123456",
  name: "Budi Santoso"
};

export const modulist = [
  { id: "modul-1", judul: "Pengenalan React", deskripsi: "Dasar-dasar React JS dan komponen", selesai: false },
  { id: "modul-2", judul: "State & Props", deskripsi: "Penelitian tentang state, props, dan one-way data flow", selesai: false },
  { id: "modul-3", judul: "React Router DOM", deskripsi: "Navigasi antar halaman dengan routing", selesai: false }
];`,

  "src/Utils/Helpers/SwalHelpers.jsx": `import Swal from "sweetalert2";

export const confirmLogout = (onConfirm) => {
  Swal.fire({
    title: "Yakin ingin logout?",
    text: "Anda akan dikembalikan ke halaman login",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#2563eb",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Ya, logout",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
      Swal.fire({ title: "Logout Berhasil!", icon: "success", timer: 1500, showConfirmButton: false });
    }
  });
};`,

  "src/Utils/Helpers/ToastHelpers.jsx": `import toast from "react-hot-toast";

export const toastSuccess = (message) => toast.success(message, { duration: 3000, position: "top-right", style: { borderRadius: "10px", background: "#333", color: "#fff" } });
export const toastError = (message) => toast.error(message, { duration: 4000, position: "top-right", style: { borderRadius: "10px" } });
export const toastInfo = (message) => toast(message, { duration: 3000, position: "top-right", icon: "ℹ️" });`,

  // ================= AUTH =================
  "src/Pages/Auth/AuthLayout.jsx": `import { Outlet } from "react-router-dom";
const AuthLayout = () => { return <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4"><div className="w-full max-w-md"><Outlet /></div></div>; };
export default AuthLayout;`,

  "src/Pages/Auth/Components/Input.jsx": `const Input = ({ type, name, required, placeholder, className = "" }) => { return <input type={type} name={name} required={required} placeholder={placeholder} className={\`w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 \${className}\`} />; };
export default Input;`,

  "src/Pages/Auth/Components/Label.jsx": `const Label = ({ htmlFor, children, className = "" }) => { return <label htmlFor={htmlFor} className={\`block text-sm font-medium text-gray-700 \${className}\`}>{children}</label>; };
export default Label;`,

  "src/Pages/Auth/Components/Button.jsx": `const v = { primary: "bg-blue-600 hover:bg-blue-700 text-white", secondary: "bg-gray-600 hover:bg-gray-700 text-white", warning: "bg-yellow-500 hover:bg-yellow-600 text-white", danger: "bg-red-600 hover:bg-red-700 text-white", success: "bg-green-600 hover:bg-green-700 text-white", info: "bg-cyan-600 hover:bg-cyan-700 text-white", purple: "bg-purple-600 hover:bg-purple-700 text-white" };
const s = { sm: "px-3 py-1 text-sm", md: "px-4 py-2" };
const Button = ({ children, type = "button", variant = "primary", size = "md", className = "", onClick, ...props }) => { return <button type={type} className={\`rounded-lg transition font-medium focus:outline-none cursor-pointer \${v[variant]} \${s[size]} \${className}\`} onClick={onClick} {...props}>{children}</button>; };
export default Button;`,

  "src/Pages/Auth/Components/Form.jsx": `const Form = ({ onSubmit, children, className = "" }) => { return <form onSubmit={onSubmit} className={\`space-y-4 \${className}\`}>{children}</form>; };
export default Form;`,

  "src/Pages/Auth/Components/Card.jsx": `const Card = ({ children, className = "" }) => { return <div className={\`w-full bg-white rounded-2xl shadow-lg p-8 \${className}\`}>{children}</div>; };
export default Card;`,

  "src/Pages/Auth/Components/Heading.jsx": `const b = { h1: "text-4xl font-bold", h2: "text-3xl font-semibold" };
const Heading = ({ as = "h2", children, className = "", color = "text-blue-600", spacing = "mb-6" }) => { const Tag = as; return <Tag className={\`\${b[as]} \${color} \${spacing} \${className}\`}>{children}</Tag>; };
export default Heading;`,

  "src/Pages/Auth/Components/Link.jsx": `const Link = ({ href = "#", children, className = "" }) => { return <a href={href} className={\`text-blue-500 hover:underline \${className}\`}>{children}</a>; };
export default Link;`,

  "src/Pages/Auth/Login/Login.jsx": `import { useNavigate } from "react-router-dom";
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
export default Login;`,

  // ================= ADMIN =================
  "src/Pages/Admin/AdminLayout.jsx": `import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import { Outlet } from "react-router-dom";
const AdminLayout = () => { return <div className="min-h-screen bg-gray-100 flex"><Sidebar /><div className="flex flex-col flex-1 overflow-hidden"><Header /><main className="flex-1 p-6 overflow-y-auto"><Outlet /></main><Footer /></div></div>; };
export default AdminLayout;`,

  "src/Pages/Admin/Components/ProtectedRoute.jsx": `import { Navigate } from "react-router-dom";
const ProtectedRoute = ({ children }) => { const user = localStorage.getItem("user"); if (!user) return <Navigate to="/" replace />; return children; };
export default ProtectedRoute;`,

  "src/Pages/Admin/Components/Sidebar.jsx": `import { NavLink } from "react-router-dom";
const Sidebar = () => {
  const linkClass = ({ isActive }) => \`flex items-center space-x-2 px-4 py-2 rounded transition \${isActive ? "bg-blue-700" : "hover:bg-blue-700"}\`;
  return (
    <aside className="bg-blue-800 text-white min-h-screen w-20 lg:w-64 flex-shrink-0">
      <div className="p-4 border-b border-blue-700"><span className="text-2xl font-bold hidden lg:block">Belajar Pintar</span><span className="text-2xl lg:hidden">📚</span></div>
      <nav className="p-4 space-y-2">
        <NavLink to="/admin/dashboard" className={linkClass}><span className="text-lg">🏠</span><span className="hidden lg:inline">Dashboard</span></NavLink>
        <NavLink to="/admin/kelas" className={linkClass}><span className="text-lg">📖</span><span className="hidden lg:inline">Kelas</span></NavLink>
      </nav>
    </aside>
  );
};
export default Sidebar;`,

  "src/Pages/Admin/Components/Header.jsx": `import { useState, useEffect } from "react";
import { confirmLogout } from "../../../Utils/Helpers/SwalHelpers";
const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [userName, setUserName] = useState("");
  useEffect(() => { const user = localStorage.getItem("user"); if (user) setUserName(JSON.parse(user).name); }, []);
  const handleLogout = () => { setShowMenu(false); confirmLogout(() => { localStorage.removeItem("user"); localStorage.removeItem("materiProgress"); window.location.href = "/"; }); };
  return (
    <header className="bg-white shadow-md"><div className="flex justify-between items-center px-6 py-4"><h1 className="text-2xl font-semibold text-gray-800">Belajar Pintar</h1>
      <div className="relative"><button onClick={() => setShowMenu(!showMenu)} className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm cursor-pointer">{userName.charAt(0)}</button>
        {showMenu && (<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-40"><div className="px-4 py-2 border-b"><p className="text-sm font-medium">{userName}</p></div><button onClick={handleLogout} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">Logout</button></div>)}
      </div></div></header>
  );
};
export default Header;`,

  "src/Pages/Admin/Components/Footer.jsx": `const Footer = () => { return <footer className="bg-white text-center py-4 shadow-inner"><p className="text-sm text-gray-600">&copy; 2025 Belajar Pintar. UTS Pemrograman Sisi Klien.</p></footer>; };
export default Footer;`,

  "src/Pages/Admin/Components/Card.jsx": `const Card = ({ children, className = "" }) => { return <div className={\`bg-white shadow rounded-lg p-6 \${className}\`}>{children}</div>; };
export default Card;`,

  "src/Pages/Admin/Components/Heading.jsx": `const b = { h1: "text-4xl font-bold", h2: "text-3xl font-semibold", h3: "text-2xl font-semibold" };
const Heading = ({ as = "h2", children, className = "", color = "text-gray-800", spacing = "mb-4" }) => { const Tag = as; return <Tag className={\`\${b[as]} \${color} \${spacing} \${className}\`}>{children}</Tag>; };
export default Heading;`,

  "src/Pages/Admin/Components/Button.jsx": `const v = { primary: "bg-blue-600 hover:bg-blue-700 text-white", secondary: "bg-gray-600 hover:bg-gray-700 text-white", success: "bg-green-600 hover:bg-green-700 text-white", info: "bg-cyan-600 hover:bg-cyan-700 text-white" };
const s = { sm: "px-3 py-1 text-sm", md: "px-4 py-2", lg: "px-6 py-3 text-lg" };
const Button = ({ children, type = "button", variant = "primary", size = "md", className = "", onClick, ...props }) => { return <button type={type} className={\`rounded-lg transition font-medium focus:outline-none cursor-pointer \${v[variant]} \${s[size]} \${className}\`} onClick={onClick} {...props}>{children}</button>; };
export default Button;`,

  // ================= DASHBOARD =================
  "src/Pages/Admin/Dashboard/Dashboard.jsx": `import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../Components/Card";
import Button from "../Components/Button";
import { modulist } from "../../../utils/dummyData";

const Dashboard = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const userName = JSON.parse(localStorage.getItem("user"))?.name || "Mahasiswa";

  useEffect(() => {
    const saved = localStorage.getItem("materiProgress");
    const data = saved ? JSON.parse(saved) : modulist;
    const selesai = data.filter((m) => m.selesai).length;
    setProgress(Math.round((selesai / data.length) * 100));
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="text-center py-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Selamat Datang, {userName}! 👋</h2>
        <p className="text-gray-500 mb-8">Ayo lanjutkan belajarmu hari ini.</p>
        <div className="max-w-md mx-auto mb-8">
          <div className="flex justify-between text-sm font-medium text-gray-600 mb-2"><span>Progress Belajar</span><span>{progress}%</span></div>
          <div className="w-full bg-gray-200 rounded-full h-4"><div className="bg-blue-600 h-4 rounded-full transition-all duration-500" style={{ width: \`\${progress}%\` }}></div></div>
        </div>
        <Button onClick={() => navigate("/admin/kelas")} className="px-8 py-3 text-lg">Lanjutkan Belajar</Button>
      </Card>
      <Card>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Daftar Modul</h3>
        <div className="space-y-3">
          {modulist.map((m, i) => {
            const saved = localStorage.getItem("materiProgress");
            const data = saved ? JSON.parse(saved) : modulist;
            const isDone = data.find((d) => d.id === m.id)?.selesai;
            return (
              <div key={m.id} className="flex items-center justify-between p-4 rounded-lg border \${isDone ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}">
                <div className="flex items-center gap-3"><span className="text-lg">\${isDone ? '✅' : '⏳'}</span><div><p className="font-medium">{m.judul}</p><p className="text-sm text-gray-500">{m.deskripsi}</p></div></div>
                <span className="text-xs font-medium px-2 py-1 rounded \${isDone ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}">\${isDone ? 'Selesai' : 'Belum'}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
export default Dashboard;`,

  // ================= KELAS (UTS CORE) =================
  "src/Pages/Admin/Kelas/Kelas.jsx": `import { useState, useEffect } from "react";
import Card from "../Components/Card";
import Heading from "../Components/Heading";
import MateriAccordion from "./MateriAccordion";
import TanyaDosenModal from "./TanyaDosenModal";
import { modulist } from "../../../utils/dummyData";
import { toastSuccess, toastError } from "../../../Utils/Helpers/ToastHelpers";

const Kelas = () => {
  const [materi, setMateri] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("materiProgress");
    setMateri(saved ? JSON.parse(saved) : modulist);
  }, []);

  const handleTandaiSelesai = (id) => {
    if (materi.find((m) => m.id === id)?.selesai) { toastError("Materi ini sudah ditandai selesai."); return; }
    const updated = materi.map((m) => m.id === id ? { ...m, selesai: true } : m);
    setMateri(updated);
    localStorage.setItem("materiProgress", JSON.stringify(updated));
    toastSuccess("Materi berhasil ditandai selesai! 🎉");
    setActiveIndex(null);
  };

  const total = materi.length;
  const done = materi.filter((m) => m.selesai).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <Heading as="h2" spacing="mb-0" className="text-left">Daftar Materi Belajar</Heading>
          <div className="w-full md:w-64">
            <div className="flex justify-between text-sm mb-1"><span>Progress</span><span className="font-bold">{done}/{total} ({pct}%)</span></div>
            <div className="w-full bg-gray-200 rounded-full h-3"><div className="bg-blue-600 h-3 rounded-full transition-all duration-500" style={{ width: \`\${pct}%\` }}></div></div>
          </div>
        </div>
        <div className="space-y-3">
          {materi.map((item, index) => (
            <MateriAccordion key={item.id} item={item} index={index} isActive={activeIndex === index} onToggle={() => setActiveIndex(activeIndex === index ? null : index)} onTandaiSelesai={() => handleTandaiSelesai(item.id)} onTanyaDosen={() => setModalData(item)} />
          ))}
        </div>
      </Card>
      <TanyaDosenModal isOpen={!!modalData} materi={modalData} onClose={() => setModalData(null)} />
    </div>
  );
};
export default Kelas;`,

  "src/Pages/Admin/Kelas/MateriAccordion.jsx": `import Button from "../Components/Button";

const MateriAccordion = ({ item, index, isActive, onToggle, onTandaiSelesai, onTanyaDosen }) => {
  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      <button onClick={onToggle} className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition cursor-pointer">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">{item.id}</span>
          <h3 className="font-medium text-gray-800">{item.judul}</h3>
          {item.selesai && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Selesai</span>}
        </div>
        <span className="text-gray-500 transform transition-transform \${isActive ? 'rotate-180' : ''}">▼</span>
      </button>
      {isActive && (
        <div className="p-4 border-t bg-gray-50" style={{ animation: "fadeIn 0.2s ease-in" }}>
          <p className="text-gray-600 mb-6">{item.deskripsi}</p>
          <div className="flex gap-3">
            <Button onClick={(e) => { e.stopPropagation(); onTandaiSelesai(); }} variant={item.selesai ? "secondary" : "success"} size="sm" disabled={item.selesai}>{item.selesai ? "✅ Sudah Selesai" : "📌 Tandai Selesai"}</Button>
            <Button onClick={(e) => { e.stopPropagation(); onTanyaDosen(); }} variant="info" size="sm">💬 Tanya Dosen</Button>
          </div>
        </div>
      )}
      <style>{\`@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }\`}</style>
    </div>
  );
};
export default MateriAccordion;`,

  "src/Pages/Admin/Kelas/TanyaDosenModal.jsx": `import { useState } from "react";
import Button from "../Components/Button";
import { toastSuccess } from "../../../Utils/Helpers/ToastHelpers";

const TanyaDosenModal = ({ isOpen, materi, onClose }) => {
  const [pertanyaan, setPertanyaan] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pertanyaan.trim()) return;
    toastSuccess(\`Pertanyaan untuk modul "\${materi?.judul}" berhasil dikirim!\`);
    setPertanyaan("");
    onClose();
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-4 border-b flex justify-between items-center"><h2 className="text-lg font-semibold">💬 Tanya Dosen</h2><button onClick={onClose} className="text-gray-400 hover:text-red-500 text-2xl cursor-pointer">&times;</button></div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modul: <span className="text-blue-600">{materi?.judul}</span></label>
            <textarea value={pertanyaan} onChange={(e) => setPertanyaan(e.target.value)} rows={4} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm" placeholder="Tuliskan pertanyaan Anda..."></textarea>
          </div>
          <div className="flex justify-end gap-2"><Button type="button" variant="secondary" onClick={onClose}>Batal</Button><Button type="submit">Kirim Pertanyaan</Button></div>
        </form>
      </div>
    </div>
  );
};
export default TanyaDosenModal;`,

  // ================= ERROR =================
  "src/Pages/Error/PageNotFound.jsx": `import { Link } from "react-router-dom";
const PageNotFound = () => { return <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 text-center"><h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1><h2 className="text-2xl font-semibold text-gray-800 mb-2">Halaman Tidak Ditemukan</h2><Link to="/" className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Kembali ke Login</Link></div>; };
export default PageNotFound;`,

  // ================= ROOT =================
  "src/App.jsx": `const App = () => null;
export default App;`,

  "src/main.jsx": `import React from "react";
import ReactDOM from "react-dom/client";
import { Navigate, createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";

import AuthLayout from "./Pages/Auth/AuthLayout";
import AdminLayout from "./Pages/Admin/AdminLayout";
import ProtectedRoute from "./Pages/Admin/Components/ProtectedRoute";
import Login from "./Pages/Auth/Login/Login";
import Dashboard from "./Pages/Admin/Dashboard/Dashboard";
import Kelas from "./Pages/Admin/Kelas/Kelas";
import PageNotFound from "./Pages/Error/PageNotFound";

const router = createBrowserRouter([
  { path: "/", element: <AuthLayout />, children: [{ index: true, element: <Login /> }] },
  { path: "/admin", element: <ProtectedRoute><AdminLayout /></ProtectedRoute>, children: [
    { index: true, element: <Navigate to="dashboard" replace /> },
    { path: "dashboard", element: <Dashboard /> },
    { path: "kelas", element: <Kelas /> },
  ]},
  { path: "*", element: <PageNotFound /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Toaster position="top-right" />
    <RouterProvider router={router} />
  </React.StrictMode>
);`,
};

// Membuat file
Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content, "utf8");
  console.log(`✅ Created: ${filePath}`);
});

console.log("\n🎉 Semua file UTS berhasil dibuat!");
