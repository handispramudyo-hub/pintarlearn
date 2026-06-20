import { NavLink } from "react-router-dom";
import { useAuthStateContext } from "../../../utils/Contexts/AuthContext";
const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuthStateContext();
  const p = (perm) => user?.permission?.includes(perm);
  const linkClass = ({ isActive }) => `flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${isActive ? "bg-blue-700" : "hover:bg-blue-700"}`;
  return (
    <>
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 bg-blue-800 text-white min-h-screen w-64 flex-shrink-0 transform transition-transform duration-200 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-4 border-b border-blue-700 flex items-center justify-between">
          <span className="text-2xl font-bold">Belajar Pintar</span>
          <button onClick={onClose} className="lg:hidden text-white text-2xl cursor-pointer">&times;</button>
        </div>
        <nav className="p-4 space-y-2">
          {p("dashboard.page") && <NavLink to="/admin/dashboard" onClick={onClose} className={linkClass}><span className="text-lg">🏠</span><span>Dashboard</span></NavLink>}
          {p("kelas.page") && <NavLink to="/admin/kelas" onClick={onClose} className={linkClass}><span className="text-lg">📖</span><span>Kelas</span></NavLink>}
          {p("dosen.page") && <NavLink to="/admin/dosen" onClick={onClose} className={linkClass}><span className="text-lg">👨‍🏫</span><span>Dosen</span></NavLink>}
          {p("matakuliah.page") && <NavLink to="/admin/matakuliah" onClick={onClose} className={linkClass}><span className="text-lg">📚</span><span>Matakuliah</span></NavLink>}
          {p("kelola-kelas.page") && <NavLink to="/admin/kelola-kelas" onClick={onClose} className={linkClass}><span className="text-lg">🏫</span><span>Kelola Kelas</span></NavLink>}
          {p("user.page") && <NavLink to="/admin/user" onClick={onClose} className={linkClass}><span className="text-lg">👥</span><span>User</span></NavLink>}
        </nav>
      </aside>
    </>
  );
};
export default Sidebar;