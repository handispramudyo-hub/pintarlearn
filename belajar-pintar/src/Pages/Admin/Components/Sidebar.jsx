import { NavLink } from "react-router-dom";
import { useAuthStateContext } from "../../../utils/Contexts/AuthContext";
const Sidebar = () => {
  const { user } = useAuthStateContext();
  const p = (perm) => user?.permission?.includes(perm);
  const linkClass = ({ isActive }) => `flex items-center space-x-2 px-4 py-2 rounded transition ${isActive ? "bg-blue-700" : "hover:bg-blue-700"}`;
  return (
    <aside className="bg-blue-800 text-white min-h-screen w-20 lg:w-64 flex-shrink-0">
      <div className="p-4 border-b border-blue-700"><span className="text-2xl font-bold hidden lg:block">Belajar Pintar</span><span className="text-2xl lg:hidden">📚</span></div>
      <nav className="p-4 space-y-2">
        {p("dashboard.page") && <NavLink to="/admin/dashboard" className={linkClass}><span className="text-lg">🏠</span><span className="hidden lg:inline">Dashboard</span></NavLink>}
        {p("kelas.page") && <NavLink to="/admin/kelas" className={linkClass}><span className="text-lg">📖</span><span className="hidden lg:inline">Kelas</span></NavLink>}
        {p("dosen.page") && <NavLink to="/admin/dosen" className={linkClass}><span className="text-lg">👨‍🏫</span><span className="hidden lg:inline">Dosen</span></NavLink>}
        {p("matakuliah.page") && <NavLink to="/admin/matakuliah" className={linkClass}><span className="text-lg">📚</span><span className="hidden lg:inline">Matakuliah</span></NavLink>}
        {p("kelola-kelas.page") && <NavLink to="/admin/kelola-kelas" className={linkClass}><span className="text-lg">🏫</span><span className="hidden lg:inline">Kelola Kelas</span></NavLink>}
        {p("user.page") && <NavLink to="/admin/user" className={linkClass}><span className="text-lg">👥</span><span className="hidden lg:inline">User</span></NavLink>}
      </nav>
    </aside>
  );
};
export default Sidebar;