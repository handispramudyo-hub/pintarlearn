import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import Card from "../Components/Card";
import Button from "../Components/Button";
import Heading from "../Components/Heading";
import { modulist } from "../../../utils/dummyData";
import { useChartData } from "../../../utils/Hooks/useChart";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

const Dashboard = () => {
  const navigate = useNavigate();
  const userName = JSON.parse(localStorage.getItem("user"))?.name || "Mahasiswa";
  const progress = useMemo(() => {
    const saved = localStorage.getItem("materiProgress");
    const data = saved ? JSON.parse(saved) : modulist;
    const selesai = data.filter((m) => m.selesai).length;
    return Math.round((selesai / data.length) * 100);
  }, []);

  const { data: chartData = {}, isLoading } = useChartData();
  const { matkulPerSemester = [], userByRole = [] } = chartData;



  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="text-center py-6 md:py-10">
        <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-2">Selamat Datang, {userName}! 👋</h2>
        <p className="text-gray-500 mb-6 md:mb-8">Ayo lanjutkan belajarmu hari ini.</p>
        <div className="max-w-md mx-auto mb-6 md:mb-8">
          <div className="flex justify-between text-sm font-medium text-gray-600 mb-2"><span>Progress Belajar</span><span>{progress}%</span></div>
          <div className="w-full bg-gray-200 rounded-full h-4"><div className="bg-blue-600 h-4 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div></div>
        </div>
        <Button onClick={() => navigate("/admin/kelas")} className="px-8 py-3 text-lg">Lanjutkan Belajar</Button>
      </Card>

      {isLoading ? (
        <p className="text-center text-gray-400 py-8">Memuat data dashboard...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">📊</span>
              <Heading as="h3" spacing="mb-0">Matakuliah per Semester</Heading>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={matkulPerSemester}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semester" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">👥</span>
              <Heading as="h3" spacing="mb-0">User by Role</Heading>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={userByRole} dataKey="count" nameKey="role" cx="50%" cy="50%" outerRadius={90} label={({ role, count }) => `${role}: ${count}`}>
                  {userByRole.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">📖</span>
              <Heading as="h3" spacing="mb-0">Ringkasan Materi</Heading>
            </div>
            {(() => {
              const saved = localStorage.getItem("materiProgress");
              const data = saved ? JSON.parse(saved) : modulist;
              const selesai = data.filter((m) => m.selesai).length;
              const total = data.length;
              const pct = total > 0 ? Math.round((selesai / total) * 100) : 0;
              return (
                <div className="flex flex-col justify-center h-[280px] space-y-4">
                  <div className="text-center">
                    <span className="text-5xl font-bold text-blue-600">{pct}%</span>
                    <p className="text-gray-500 mt-1">Progress Belajar</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4"><div className="bg-blue-500 h-4 rounded-full transition-all" style={{ width: `${pct}%` }}></div></div>
                  <p className="text-sm text-gray-400 text-center">{selesai} dari {total} materi selesai</p>
                  <Button onClick={() => navigate("/admin/kelas")} className="w-full" size="sm">Lihat Detail</Button>
                </div>
              );
            })()}
          </Card>
        </div>
      )}
    </div>
  );
};
export default Dashboard;
