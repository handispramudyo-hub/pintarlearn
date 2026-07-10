import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from "recharts";
import Card from "../Components/Card";
import Button from "../Components/Button";
import Heading from "../Components/Heading";
import { modulist } from "../../../utils/dummyData";
import { useChartData } from "../../../utils/Hooks/useChart";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#ff6b6b", "#48dbfb", "#ff9ff3"];
const PIE_COLORS = ["#22c55e", "#f59e0b", "#94a3b8"];

const StatCard = ({ icon, label, value, sub, color = "blue" }) => {
  const bg = { blue: "from-blue-500 to-blue-600", green: "from-green-500 to-green-600", purple: "from-purple-500 to-purple-600", orange: "from-orange-500 to-orange-600", red: "from-red-500 to-red-600" };
  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-20 h-20 rounded-bl-full bg-gradient-to-br ${bg[color]} opacity-10`} />
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${bg[color]} flex items-center justify-center text-white text-xl shadow-lg`}>{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-800 truncate">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
      </div>
    </Card>
  );
};

const ChartCard = ({ icon, title, children, className = "" }) => (
  <Card className={`flex flex-col ${className}`}>
    <div className="flex items-center gap-2 mb-4">
      <span className="text-xl">{icon}</span>
      <Heading as="h3" spacing="mb-0">{title}</Heading>
    </div>
    <div className="flex-1 min-h-[280px]">{children}</div>
  </Card>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const userName = JSON.parse(localStorage.getItem("user"))?.name || "Mahasiswa";

  const progress = useMemo(() => {
    const saved = localStorage.getItem("materiProgress");
    const data = saved ? JSON.parse(saved) : modulist;
    const selesai = Array.isArray(data)
      ? data.filter((m) => m.selesai).length
      : Object.values(data).filter((m) => m.completed || m.selesai || m.status === "completed").length;
    const total = Array.isArray(data) ? data.length : Object.keys(data).length;
    return { selesai, total, pct: total > 0 ? Math.round((selesai / total) * 100) : 0 };
  }, []);

  const { isLoading } = useChartData();

  const weeklyProgress = useMemo(() => [
    { minggu: "Minggu 1", modulSelesai: 2, kuisLulus: 1, menit: 180 },
    { minggu: "Minggu 2", modulSelesai: 3, kuisLulus: 2, menit: 240 },
    { minggu: "Minggu 3", modulSelesai: 1, kuisLulus: 1, menit: 150 },
    { minggu: "Minggu 4", modulSelesai: 4, kuisLulus: 3, menit: 320 },
  ], []);

  const categoryTime = useMemo(() => [
    { kategori: "Pemrograman", jam: 12.5 },
    { kategori: "Basis Data", jam: 8.3 },
    { kategori: "Jaringan", jam: 6.7 },
    { kategori: "Sistem Operasi", jam: 5.2 },
    { kategori: "Kecerdasan Buatan", jam: 9.1 },
  ], []);

  const moduleStatus = useMemo(() => [
    { status: "Selesai", count: progress.selesai },
    { status: "Sedang Berjalan", count: Math.min(3, progress.total - progress.selesai) },
    { status: "Belum Dimulai", count: Math.max(0, progress.total - progress.selesai - 3) },
  ], [progress]);

  const accumulatedHours = useMemo(() => {
    const increments = [0.8, 1.2, 0.5, 1.4, 0.9, 1.1, 0.7, 1.3, 0.6, 1.0, 0.4, 1.5, 0.8, 1.1];
    return increments.reduce((acc, inc, i) => {
      const prev = i > 0 ? acc[i - 1].jam : 0;
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      acc.push({ tanggal: `${d.getDate()}/${d.getMonth() + 1}`, jam: +(prev + inc).toFixed(2) });
      return acc;
    }, []);
  }, []);

  const skillRadar = useMemo(() => [
    { kemampuan: "Pemrograman", skor: 78 },
    { kemampuan: "Basis Data", skor: 65 },
    { kemampuan: "Jaringan", skor: 55 },
    { kemampuan: "Sistem Operasi", skor: 45 },
    { kemampuan: "Kecerdasan Buatan", skor: 70 },
    { kemampuan: "Data Mining", skor: 60 },
  ], []);

  const streak = useMemo(() => {
    const saved = localStorage.getItem("learning_streak");
    return saved ? parseInt(saved, 10) : 5;
  }, []);

  const achievementPoints = useMemo(() => {
    return progress.selesai * 50 + streak * 10 + 120;
  }, [progress.selesai, streak]);

  const todayTarget = useMemo(() => {
    const total = 3;
    const done = Math.min(progress.selesai, total);
    return { done, total, pct: Math.round((done / total) * 100) };
  }, [progress.selesai]);

  const nextModule = useMemo(() => {
    const saved = localStorage.getItem("materiProgress");
    const data = saved ? JSON.parse(saved) : modulist;
    const list = Array.isArray(data) ? data : modulist;
    return list.find((m) => !m.selesai && !m.completed) || list[0];
  }, []);

  const recentBookmarks = useMemo(() => {
    const saved = localStorage.getItem("bookmarks");
    const bm = saved ? JSON.parse(saved) : [];
    return Array.isArray(bm) ? bm.slice(0, 3) : [];
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-1">Selamat Datang, {userName}!</h2>
            <p className="text-blue-100">Ayo lanjutkan belajarmu hari ini. Kamu sudah hebat!</p>
          </div>
          <Button variant="secondary" onClick={() => navigate("/admin/kelas")} className="bg-white/20 hover:bg-white/30 text-white border-0 whitespace-nowrap">
            Lanjutkan Belajar
          </Button>
        </div>
      </Card>

      {/* Ringkasan Progress */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📚" label="Modul Selesai" value={`${progress.selesai} / ${progress.total}`} sub={`${progress.pct}% selesai`} color="blue" />
        <StatCard icon="⏱️" label="Waktu Belajar" value="41.8 jam" sub="Minggu ini: 8.2 jam" color="green" />
        <StatCard icon="🏆" label="Poin Pencapaian" value={`${achievementPoints}`} sub={`+${progress.selesai * 10} minggu ini`} color="purple" />
        <StatCard icon="🔥" label="Streak Belajar" value={`${streak} hari`} sub="Hari berturut-turut" color="orange" />
      </div>

      {/* Progress Bar Harian */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <Heading as="h3" spacing="mb-0">Target Belajar Hari Ini</Heading>
          <span className="text-sm font-medium text-gray-500">{todayTarget.done}/{todayTarget.total} modul</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-700" style={{ width: `${todayTarget.pct}%` }} />
        </div>
        <p className="text-xs text-gray-400 mt-2">{todayTarget.pct}% target hari ini tercapai</p>
      </Card>

      {/* Charts Grid */}
      <Heading as="h2" className="pt-2">Visualisasi Data</Heading>

      {isLoading ? (
        <p className="text-center text-gray-400 py-12">Memuat data visualisasi...</p>
      ) : (
        <>
          {/* Row 1: Line + Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard icon="📈" title="Progress Belajar per Minggu">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="minggu" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                  <Legend />
                  <Line type="monotone" dataKey="modulSelesai" stroke="#8884d8" strokeWidth={3} dot={{ r: 5 }} name="Modul Selesai" />
                  <Line type="monotone" dataKey="kuisLulus" stroke="#82ca9d" strokeWidth={3} dot={{ r: 5 }} name="Kuis Lulus" />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard icon="📊" title="Waktu Belajar per Kategori">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={categoryTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="kategori" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                  <Legend />
                  <Bar dataKey="jam" radius={[6, 6, 0, 0]} name="Jam Belajar">
                    {categoryTime.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Row 2: Pie + Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard icon="🍩" title="Distribusi Status Modul">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={moduleStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={100} innerRadius={55} paddingAngle={3} label={({ status, count }) => `${status}: ${count}`}>
                    {moduleStatus.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard icon="🌊" title="Akumulasi Jam Belajar">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={accumulatedHours}>
                  <defs>
                    <linearGradient id="gradArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="tanggal" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                  <Area type="monotone" dataKey="jam" stroke="#8884d8" strokeWidth={2} fill="url(#gradArea)" name="Jam Kumulatif" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Row 3: Radar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard icon="🎯" title="Penilaian Kemampuan per Kategori">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={skillRadar}>
                  <PolarGrid stroke="#e0e0e0" />
                  <PolarAngleAxis dataKey="kemampuan" tick={{ fontSize: 11, fill: "#666" }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar name="Skor" dataKey="skor" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} strokeWidth={2} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard icon="📋" title="Ringkasan Materi">
              <div className="flex flex-col justify-center h-[300px] space-y-5">
                <div className="text-center">
                  <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{progress.pct}%</span>
                  <p className="text-gray-500 mt-1">Total Progress Belajar</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500" style={{ width: `${progress.pct}%` }} />
                </div>
                <p className="text-sm text-gray-400 text-center">{progress.selesai} dari {progress.total} materi selesai</p>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-green-50 rounded-lg py-2">
                    <p className="font-bold text-green-600 text-lg">{moduleStatus[0].count}</p>
                    <p className="text-green-500">Selesai</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg py-2">
                    <p className="font-bold text-yellow-600 text-lg">{moduleStatus[1].count}</p>
                    <p className="text-yellow-500">Berjalan</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg py-2">
                    <p className="font-bold text-gray-500 text-lg">{moduleStatus[2].count}</p>
                    <p className="text-gray-400">Belum Mulai</p>
                  </div>
                </div>
              </div>
            </ChartCard>
          </div>
        </>
      )}

      {/* Aksi Cepat */}
      <Heading as="h2" className="pt-2">Aksi Cepat</Heading>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/admin/kelas")}>
          <div className="text-center">
            <span className="text-3xl block mb-2">▶️</span>
            <Heading as="h3" spacing="mb-1" className="text-lg">Lanjutkan Modul Terakhir</Heading>
            <p className="text-sm text-gray-500 truncate">{nextModule?.judul || "Mulai belajar"}</p>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <div className="text-center">
            <span className="text-3xl block mb-2">💡</span>
            <Heading as="h3" spacing="mb-1" className="text-lg">Rekomendasi Berikutnya</Heading>
            <p className="text-sm text-gray-500 truncate">{nextModule?.judul || "Tidak ada modul"}</p>
            <p className="text-xs text-gray-400 mt-1">{nextModule?.deskripsi?.slice(0, 40) || ""}...</p>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <div className="text-center">
            <span className="text-3xl block mb-2">📖</span>
            <Heading as="h3" spacing="mb-1" className="text-lg">Target Hari Ini</Heading>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${todayTarget.pct}%` }} />
              </div>
              <p className="text-xs text-gray-400 mt-1">{todayTarget.done}/{todayTarget.total} modul</p>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/admin/kelas")}>
          <div className="text-center">
            <span className="text-3xl block mb-2">🔖</span>
            <Heading as="h3" spacing="mb-1" className="text-lg">Bookmarks</Heading>
            {recentBookmarks.length > 0 ? (
              <ul className="text-sm text-gray-500 space-y-1 mt-2">
                {recentBookmarks.map((bm, i) => (
                  <li key={i} className="truncate">{typeof bm === "string" ? bm : bm.judul || bm.title}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 mt-2">Belum ada bookmark</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
