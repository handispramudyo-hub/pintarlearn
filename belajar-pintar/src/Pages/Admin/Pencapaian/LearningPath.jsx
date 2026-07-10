import { useMemo } from "react";
import Card from "../Components/Card";
import Heading from "../Components/Heading";
import { modulist } from "../../../utils/dummyData";
import { getAllMatakuliah } from "../../../utils/Apis/MatakuliahApi";
import { useQuery } from "@tanstack/react-query";

const LearningPath = () => {
  const { data: result = { data: [] } } = useQuery({
    queryKey: ["matakuliah-path"],
    queryFn: () => getAllMatakuliah({ _sort: "semester", _order: "asc" }),
    select: (res) => ({ data: res?.data ?? [] }),
  });

  const matkulList = result.data;

  const progress = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("materiProgress") || "{}");
    } catch {
      return {};
    }
  }, []);

  const pathData = useMemo(() => {
    const grouped = {};
    modulist.forEach((m) => {
      if (!grouped[m.matakuliah_id]) grouped[m.matakuliah_id] = [];
      grouped[m.matakuliah_id].push(m);
    });

    return matkulList.map((mk) => {
      const modules = grouped[mk.id] || grouped[mk.kode] || [];
      const completed = modules.filter((mod) => {
        const p = progress[mod.id];
        return p?.completed || p?.status === "completed" || mod.selesai;
      }).length;
      const total = modules.length || 3;
      const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
      const status = pct === 100 ? "completed" : pct > 0 ? "in-progress" : "not-started";

      return {
        id: mk.id,
        nama: mk.nama,
        semester: mk.semester,
        kode: mk.kode,
        modules,
        completed,
        total,
        pct,
        status,
      };
    });
  }, [matkulList, progress]);

  const s = {
    completed: { bg: "bg-green-500", ring: "ring-green-400", text: "text-green-700", icon: "✓", label: "Selesai" },
    "in-progress": { bg: "bg-blue-500", ring: "ring-blue-400", text: "text-blue-700", icon: "●", label: "Sedang Dipelajari" },
    "not-started": { bg: "bg-gray-300", ring: "ring-gray-300", text: "text-gray-500", icon: "○", label: "Belum Mulai" },
  };

  if (pathData.length === 0) {
    return (
      <Card>
        <Heading as="h3" spacing="mb-2">Learning Path</Heading>
        <p className="text-gray-400 text-sm text-center py-4">Belum ada data matakuliah</p>
      </Card>
    );
  }

  return (
    <Card>
      <Heading as="h3" spacing="mb-6">Learning Path</Heading>
      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        <div className="space-y-0">
          {pathData.map((item) => {
            const style = s[item.status];
            return (
              <div key={item.id} className="relative flex items-start gap-4 pb-6 last:pb-0">
                <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full ring-4 ${style.ring} ${style.bg} text-white font-bold text-sm flex-shrink-0`}>
                  {style.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`rounded-lg border-2 p-4 transition-all ${
                    item.status === "completed" ? "border-green-300 bg-green-50" :
                    item.status === "in-progress" ? "border-blue-300 bg-blue-50" :
                    "border-gray-200 bg-gray-50"
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`text-sm font-bold ${style.text}`}>Semester {item.semester}</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-sm font-semibold text-gray-800 truncate">{item.nama}</span>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        item.status === "completed" ? "bg-green-200 text-green-800" :
                        item.status === "in-progress" ? "bg-blue-200 text-blue-800" :
                        "bg-gray-200 text-gray-600"
                      }`}>
                        {item.pct}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          item.status === "completed" ? "bg-green-500" :
                          item.status === "in-progress" ? "bg-blue-500" :
                          "bg-gray-300"
                        }`}
                        style={{ width: `${item.pct}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {item.completed}/{item.total} modul selesai
                    </p>
                    {item.modules.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.modules.map((mod) => {
                          const mp = progress[mod.id];
                          const done = mp?.completed || mp?.status === "completed" || mod.selesai;
                          return (
                            <span key={mod.id} className={`text-xs px-2 py-0.5 rounded ${
                              done ? "bg-green-200 text-green-800" : "bg-gray-100 text-gray-500"
                            }`}>
                              {done ? "✓ " : ""}{mod.judul}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default LearningPath;
