import { useState, useEffect } from "react";
import Card from "../Components/Card";
import Heading from "../Components/Heading";
import MateriAccordion from "./MateriAccordion";
import TanyaDosenModal from "./TanyaDosenModal";
import { modulist } from "../../../utils/dummyData";
import { getAllMatakuliah } from "../../../utils/Apis/MatakuliahApi";
import { toastSuccess, toastError } from "../../../utils/Helpers/ToastHelpers";

const Kelas = () => {
  const [materi, setMateri] = useState([]);
  const [matakuliah, setMatakuliah] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeMatkul, setActiveMatkul] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllMatakuliah({ _limit: 100 });
        setMatakuliah(res.data);
      } catch { toastError("Gagal memuat data matakuliah"); }
      const saved = localStorage.getItem("materiProgress");
      setMateri(saved ? JSON.parse(saved) : modulist);
      setLoading(false);
    };
    fetchData();
  }, []);

  const getModulesByMatkul = (mkId) =>
    materi.filter((m) => m.matakuliah_id === mkId);

  const handleTandaiSelesai = (id) => {
    if (materi.find((m) => m.id === id)?.selesai) { toastError("Materi ini sudah ditandai selesai."); return; }
    const updated = materi.map((m) => m.id === id ? { ...m, selesai: true } : m);
    setMateri(updated);
    localStorage.setItem("materiProgress", JSON.stringify(updated));
    toastSuccess("Materi berhasil ditandai selesai! 🎉");
    setActiveIndex(null);
  };

  const allModules = materi;
  const total = allModules.length;
  const done = allModules.filter((m) => m.selesai).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  if (loading) return <p className="text-center text-gray-500 py-8">Memuat data...</p>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <Heading as="h2" spacing="mb-0" className="text-left">Daftar Materi Belajar</Heading>
          <div className="w-full md:w-64">
            <div className="flex justify-between text-sm mb-1"><span>Progress Keseluruhan</span><span className="font-bold">{done}/{total} ({pct}%)</span></div>
            <div className="w-full bg-gray-200 rounded-full h-3"><div className="bg-blue-600 h-3 rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div></div>
          </div>
        </div>

        <div className="space-y-6">
          {matakuliah.map((mk) => {
            const modules = getModulesByMatkul(mk.id);
            const mkDone = modules.filter((m) => m.selesai).length;
            const mkPct = modules.length > 0 ? Math.round((mkDone / modules.length) * 100) : 0;
            const isActive = activeMatkul === mk.id;

            return (
              <div key={mk.id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
                <button
                  onClick={() => setActiveMatkul(isActive ? null : mk.id)}
                  className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 transition cursor-pointer"
                >
                  <div className="text-left">
                    <h3 className="font-semibold text-blue-800">{mk.nama}</h3>
                    <p className="text-xs text-gray-500">{mk.kode} | {mk.sks} SKS | Semester {mk.semester}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium px-2 py-1 rounded bg-white text-blue-600">{mkDone}/{modules.length} ({mkPct}%)</span>
                    <span className="text-gray-500 transition-transform">{isActive ? "▲" : "▼"}</span>
                  </div>
                </button>

                {isActive && (
                  <div className="p-4 space-y-3">
                    {modules.length === 0 ? (
                      <p className="text-gray-400 text-sm text-center py-4">Belum ada materi untuk mata kuliah ini</p>
                    ) : (
                      modules.map((item, index) => {
                        const globalIdx = materi.findIndex((m) => m.id === item.id);
                        return (
                          <MateriAccordion
                            key={item.id}
                            item={item}
                            index={index}
                            isActive={activeIndex === globalIdx}
                            onToggle={() => setActiveIndex(activeIndex === globalIdx ? null : globalIdx)}
                            onTandaiSelesai={() => handleTandaiSelesai(item.id)}
                            onTanyaDosen={() => setModalData({ ...item, matkul: mk.nama })}
                          />
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
      <TanyaDosenModal isOpen={!!modalData} materi={modalData} onClose={() => setModalData(null)} />
    </div>
  );
};
export default Kelas;
