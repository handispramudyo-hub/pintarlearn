import { useEffect, useState } from "react";
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
          <div className="w-full bg-gray-200 rounded-full h-4"><div className="bg-blue-600 h-4 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div></div>
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
              <div key={m.id} className="flex items-center justify-between p-4 rounded-lg border ${isDone ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}">
                <div className="flex items-center gap-3"><span className="text-lg">${isDone ? '✅' : '⏳'}</span><div><p className="font-medium">{m.judul}</p><p className="text-sm text-gray-500">{m.deskripsi}</p></div></div>
                <span className="text-xs font-medium px-2 py-1 rounded ${isDone ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}">${isDone ? 'Selesai' : 'Belum'}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
export default Dashboard;