import { useState, useEffect } from "react";
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
export default Header;