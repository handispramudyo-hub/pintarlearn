import { useMemo } from "react";
import Card from "../Components/Card";
import Heading from "../Components/Heading";
import Button from "../Components/Button";
import { useAuthStateContext } from "../../../utils/Contexts/AuthContext";
import { getAllUsers } from "../../../utils/Apis/UserApi";
import { getAllQuizAttempts } from "../../../utils/Apis/QuizApi";
import { getAllLearningAnalytics } from "../../../utils/Apis/AnalyticsApi";
import { useQuery } from "@tanstack/react-query";
import { toastInfo } from "../../../utils/Helpers/ToastHelpers";
import { modulist } from "../../../utils/dummyData";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const Instruktur = () => {
  const { user } = useAuthStateContext();

  const { data: usersRes = { data: [] } } = useQuery({
    queryKey: ["users-instruktur"],
    queryFn: () => getAllUsers({ role: "mahasiswa" }),
    select: (res) => ({ data: res?.data ?? [] }),
  });

  const { data: quizRes = { data: [] } } = useQuery({
    queryKey: ["quiz-attempts-all"],
    queryFn: () => getAllQuizAttempts(),
    select: (res) => ({ data: res?.data ?? [] }),
  });

  const { data: analyticsRes = { data: [] } } = useQuery({
    queryKey: ["analytics-all"],
    queryFn: () => getAllLearningAnalytics(),
    select: (res) => ({ data: res?.data ?? [] }),
  });

  const mahasiswa = usersRes.data;
  const quizAttempts = quizRes.data;
  const analytics = analyticsRes.data;

  const overview = useMemo(() => {
    const scores = quizAttempts.map((q) => q.score ?? 0);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    let materiProgress = {};
    try { materiProgress = JSON.parse(localStorage.getItem("materiProgress") || "{}"); } catch { /* empty */ }
    const completed = modulist.filter((m) => {
      const p = materiProgress[m.id];
      return p?.completed || p?.status === "completed" || m.selesai;
    }).length;
    const completionRate = modulist.length > 0 ? Math.round((completed / modulist.length) * 100) : 0;

    const totalMinutes = analytics.reduce((sum, a) => sum + (a.duration_minutes ?? 0), 0);
    const totalHours = Math.round(totalMinutes / 60 * 10) / 10;

    return { avgScore, completionRate, totalHours, totalStudents: mahasiswa.length };
  }, [quizAttempts, analytics, mahasiswa.length]);

  const barData = useMemo(() => {
    const scoreMap = {};
    quizAttempts.forEach((q) => {
      const name = q.user_name || q.user_email || `User ${q.user_id}`;
      if (!scoreMap[name]) scoreMap[name] = { total: 0, count: 0 };
      scoreMap[name].total += q.score ?? 0;
      scoreMap[name].count++;
    });

    return Object.entries(scoreMap)
      .map(([name, v]) => ({ name: name.length > 12 ? name.slice(0, 12) + "..." : name, rata_rata: Math.round(v.total / v.count) }))
      .slice(0, 15);
  }, [quizAttempts]);

  const lineData = useMemo(() => {
    const weekly = {};
    analytics.forEach((a) => {
      const d = new Date(a.date ?? a.created_at);
      const weekKey = `W${Math.ceil(d.getDate() / 7)} ${d.toLocaleString("id", { month: "short" })}`;
      if (!weekly[weekKey]) weekly[weekKey] = { name: weekKey, modul_selesai: 0, quiz_lulus: 0 };
      if (a.type === "module_complete") weekly[weekKey].modul_selesai++;
      if (a.type === "quiz_pass") weekly[weekKey].quiz_lulus++;
    });
    return Object.values(weekly);
  }, [analytics]);

  const strugglingStudents = useMemo(() => {
    const scoreMap = {};
    quizAttempts.forEach((q) => {
      const uid = q.user_id;
      if (!scoreMap[uid]) scoreMap[uid] = { scores: [], total: 0, count: 0, name: q.user_name || q.user_email, user_id: uid };
      scoreMap[uid].scores.push(q.score ?? 0);
      scoreMap[uid].total += q.score ?? 0;
      scoreMap[uid].count++;
    });

    return Object.values(scoreMap)
      .map((s) => ({
        ...s,
        avg: s.count > 0 ? Math.round(s.total / s.count) : 0,
      }))
      .filter((s) => s.avg < 65 || s.count === 0)
      .slice(0, 10);
  }, [quizAttempts]);

  const handleUploadClick = (type) => {
    toastInfo(`Fitur upload ${type} akan segera tersedia`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <Heading as="h2" spacing="mb-1">Dashboard Instruktur</Heading>
        <p className="text-gray-500 text-sm">Selamat datang, {user?.name || "Instruktur"}. Berikut ringkasan performa mahasiswa.</p>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-3xl font-bold text-blue-600">{overview.avgScore}</p>
          <p className="text-gray-500 text-sm mt-1">Rata-rata Nilai Quiz</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-green-600">{overview.completionRate}%</p>
          <p className="text-gray-500 text-sm mt-1">Penyelesaian Modul</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-purple-600">{overview.totalHours} jam</p>
          <p className="text-gray-500 text-sm mt-1">Total Waktu Belajar</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-orange-600">{overview.totalStudents}</p>
          <p className="text-gray-500 text-sm mt-1">Mahasiswa Aktif</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <Heading as="h3" spacing="mb-4">Rata-rata Nilai Quiz per Mahasiswa</Heading>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="rata_rata" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-sm text-center py-10">Belum ada data quiz</p>
          )}
        </Card>

        <Card>
          <Heading as="h3" spacing="mb-4">Progres Penyelesaian Modul</Heading>
          {lineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="modul_selesai" stroke="#82ca9d" strokeWidth={2} name="Modul Selesai" />
                <Line type="monotone" dataKey="quiz_lulus" stroke="#8884d8" strokeWidth={2} name="Quiz Lulus" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-sm text-center py-10">Belum ada data progres</p>
          )}
        </Card>
      </div>

      <Card>
        <Heading as="h3" spacing="mb-4">Mahasiswa yang Kesulitan</Heading>
        <p className="text-gray-500 text-sm mb-3">Mahasiswa dengan rata-rata nilai {'<'} 65 atau belum ada attempts</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 font-medium">No</th>
                <th className="px-4 py-3 font-medium">Nama</th>
                <th className="px-4 py-3 font-medium">Jumlah Attempt</th>
                <th className="px-4 py-3 font-medium">Rata-rata Nilai</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {strugglingStudents.map((s, i) => (
                <tr key={s.user_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{s.name || `User ${s.user_id}`}</td>
                  <td className="px-4 py-3">{s.count}</td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${s.avg < 50 ? "text-red-600" : s.avg < 65 ? "text-yellow-600" : "text-green-600"}`}>
                      {s.count > 0 ? s.avg : "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {s.count === 0 ? (
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Belum Attempt</span>
                    ) : s.avg < 50 ? (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Sangat Perlu Bimbingan</span>
                    ) : (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Perlu Perhatian</span>
                    )}
                  </td>
                </tr>
              ))}
              {strugglingStudents.length === 0 && (
                <tr><td colSpan={5} className="text-center text-gray-400 py-6">Semua mahasiswa dalam performa baik</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <Heading as="h3" spacing="mb-4">Manajemen Konten</Heading>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
            <p className="text-3xl mb-2">🎬</p>
            <p className="font-medium text-gray-700">Upload Video</p>
            <p className="text-xs text-gray-400 mb-3">Unggah materi video pembelajaran</p>
            <Button size="sm" onClick={() => handleUploadClick("video")}>Upload Video</Button>
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition">
            <p className="text-3xl mb-2">📄</p>
            <p className="font-medium text-gray-700">Upload PDF</p>
            <p className="text-xs text-gray-400 mb-3">Unggah dokumen PDF materi</p>
            <Button size="sm" variant="success" onClick={() => handleUploadClick("PDF")}>Upload PDF</Button>
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition">
            <p className="text-3xl mb-2">🖼️</p>
            <p className="font-medium text-gray-700">Upload Gambar</p>
            <p className="text-xs text-gray-400 mb-3">Unggah gambar pendukung materi</p>
            <Button size="sm" variant="purple" onClick={() => handleUploadClick("gambar")}>Upload Gambar</Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <Heading as="h3" spacing="mb-2">Analitik Konten</Heading>
          <p className="text-gray-400 text-sm">Fitur analitik konten akan segera tersedia. Pantau engagement dan efektivitas materi pembelajaran.</p>
          <div className="mt-4 flex items-center justify-center h-32 border border-dashed border-gray-200 rounded-lg">
            <p className="text-gray-300 text-sm">Coming Soon</p>
          </div>
        </Card>
        <Card>
          <Heading as="h3" spacing="mb-2">Koleksi Feedback</Heading>
          <p className="text-gray-400 text-sm">Kumpulan feedback dan rating dari mahasiswa terhadap materi yang telah diunggah.</p>
          <div className="mt-4 flex items-center justify-center h-32 border border-dashed border-gray-200 rounded-lg">
            <p className="text-gray-300 text-sm">Coming Soon</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Instruktur;
