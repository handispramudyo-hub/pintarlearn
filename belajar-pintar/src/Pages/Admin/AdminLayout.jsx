import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import { Outlet } from "react-router-dom";
const AdminLayout = () => { return <div className="min-h-screen bg-gray-100 flex"><Sidebar /><div className="flex flex-col flex-1 overflow-hidden"><Header /><main className="flex-1 p-6 overflow-y-auto"><Outlet /></main><Footer /></div></div>; };
export default AdminLayout;