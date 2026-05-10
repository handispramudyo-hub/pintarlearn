import { NavLink } from "react-router-dom";
const Sidebar = () => {
  const linkClass = ({ isActive }) => `flex items-center space-x-2 px-4 py-2 rounded transition ${isActive ? "bg-blue-700" : "hover:bg-blue-700"}`;
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
export default Sidebar;