import { useState, useEffect } from "react";
import Card from "../Components/Card";
import Heading from "../Components/Heading";
import MateriAccordion from "./MateriAccordion";
import TanyaDosenModal from "./TanyaDosenModal";
import { modulist } from "../../../utils/dummyData";
import { toastSuccess, toastError } from "../../../Utils/Helpers/ToastHelpers";

const Kelas = () => {
  const [materi, setMateri] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("materiProgress");
    setMateri(saved ? JSON.parse(saved) : modulist);
  }, []);

  const handleTandaiSelesai = (id) => {
    if (materi.find((m) => m.id === id)?.selesai) { toastError("Materi ini sudah ditandai selesai."); return; }
    const updated = materi.map((m) => m.id === id ? { ...m, selesai: true } : m);
    setMateri(updated);
    localStorage.setItem("materiProgress", JSON.stringify(updated));
    toastSuccess("Materi berhasil ditandai selesai! 🎉");
    setActiveIndex(null);
  };

  const total = materi.length;
  const done = materi.filter((m) => m.selesai).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <Heading as="h2" spacing="mb-0" className="text-left">Daftar Materi Belajar</Heading>
          <div className="w-full md:w-64">
            <div className="flex justify-between text-sm mb-1"><span>Progress</span><span className="font-bold">{done}/{total} ({pct}%)</span></div>
            <div className="w-full bg-gray-200 rounded-full h-3"><div className="bg-blue-600 h-3 rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div></div>
          </div>
        </div>
        <div className="space-y-3">
          {materi.map((item, index) => (
            <MateriAccordion key={item.id} item={item} index={index} isActive={activeIndex === index} onToggle={() => setActiveIndex(activeIndex === index ? null : index)} onTandaiSelesai={() => handleTandaiSelesai(item.id)} onTanyaDosen={() => setModalData(item)} />
          ))}
        </div>
      </Card>
      <TanyaDosenModal isOpen={!!modalData} materi={modalData} onClose={() => setModalData(null)} />
    </div>
  );
};
export default Kelas;