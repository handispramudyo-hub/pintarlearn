import { useState } from "react";
import Button from "../Components/Button";
import { useStoreQuiz, useUpdateQuiz } from "../../../utils/Hooks/useQuiz";
import QuizPreviewModal from "./QuizPreviewModal";

const emptyQuestion = () => ({
  id: `q${Date.now()}`,
  type: "pilihan_ganda",
  soal: "",
  jawaban: "",
  pilihan: ["", "", "", ""],
});

const QuizFormModal = ({ isOpen, onClose, quiz, matakuliahList }) => {
  const { mutate: store } = useStoreQuiz();
  const { mutate: update } = useUpdateQuiz();

  const [form, setForm] = useState({
    judul: quiz?.judul || "",
    deskripsi: quiz?.deskripsi || "",
    matakuliah_id: quiz?.matakuliah_id || "",
    waktu: quiz?.waktu || 30,
    nilai_lulus: quiz?.nilai_lulus || 70,
    published: quiz?.published ?? true,
    questions: quiz?.questions?.map((q) => ({ ...q, pilihan: q.pilihan || [] })) || [],
  });

  const [showPreview, setShowPreview] = useState(false);

  if (!isOpen) return null;

  const addQuestion = () => {
    setForm({ ...form, questions: [...form.questions, emptyQuestion()] });
  };

  const removeQuestion = (idx) => {
    setForm({ ...form, questions: form.questions.filter((_, i) => i !== idx) });
  };

  const updateQuestion = (idx, field, value) => {
    const updated = [...form.questions];
    updated[idx] = { ...updated[idx], [field]: value };

    if (field === "type") {
      if (value === "benar_salah") {
        updated[idx].pilihan = ["Benar", "Salah"];
        updated[idx].jawaban = "";
      } else if (value === "essay") {
        updated[idx].pilihan = [];
        updated[idx].jawaban = "";
      } else {
        updated[idx].pilihan = ["", "", "", ""];
        updated[idx].jawaban = "";
      }
    }

    setForm({ ...form, questions: updated });
  };

  const updatePilihan = (qIdx, pIdx, value) => {
    const updated = [...form.questions];
    const pilihan = [...updated[qIdx].pilihan];
    pilihan[pIdx] = value;
    updated[qIdx] = { ...updated[qIdx], pilihan };
    setForm({ ...form, questions: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.questions.length === 0) return;
    const payload = { ...form, matakuliah_id: Number(form.matakuliah_id) };
    if (quiz) {
      update({ id: quiz.id, data: payload });
    } else {
      store(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b flex justify-between items-center flex-shrink-0">
          <h2 className="text-lg font-semibold">{quiz ? "Edit Quiz" : "Tambah Quiz"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 text-2xl cursor-pointer">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Quiz</label>
            <input
              type="text"
              value={form.judul}
              onChange={(e) => setForm({ ...form, judul: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              value={form.deskripsi}
              onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Matakuliah</label>
              <select
                value={form.matakuliah_id}
                onChange={(e) => setForm({ ...form, matakuliah_id: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm"
                required
              >
                <option value="">-- Pilih Matakuliah --</option>
                {matakuliahList.map((mk) => (
                  <option key={mk.id} value={mk.id}>{mk.nama}</option>
                ))}
              </select>
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium text-gray-700 mb-1">Waktu (menit)</label>
              <input
                type="number"
                value={form.waktu}
                onChange={(e) => setForm({ ...form, waktu: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm"
                min="1"
                required
              />
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nilai Lulus (%)</label>
              <input
                type="number"
                value={form.nilai_lulus}
                onChange={(e) => setForm({ ...form, nilai_lulus: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm"
                min="0"
                max="100"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="published" className="text-sm text-gray-700">Publish Quiz</label>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Soal ({form.questions.length})</h3>
              <Button type="button" size="sm" variant="success" onClick={addQuestion}>
                + Tambah Soal
              </Button>
            </div>

            {form.questions.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">Belum ada soal. Klik "Tambah Soal" untuk menambahkan.</p>
            )}

            <div className="space-y-4">
              {form.questions.map((q, idx) => (
                <div key={q.id} className="border rounded-lg p-3 bg-gray-50 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-500">Soal #{idx + 1}</span>
                    <div className="flex gap-2 items-center">
                      <select
                        value={q.type}
                        onChange={(e) => updateQuestion(idx, "type", e.target.value)}
                        className="px-2 py-1 border rounded text-xs focus:outline-none focus:ring focus:ring-blue-300"
                      >
                        <option value="pilihan_ganda">Pilihan Ganda</option>
                        <option value="benar_salah">Benar / Salah</option>
                        <option value="essay">Essay</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => removeQuestion(idx)}
                        className="text-red-400 hover:text-red-600 text-sm cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={q.soal}
                    onChange={(e) => updateQuestion(idx, "soal", e.target.value)}
                    rows={2}
                    placeholder="Tuliskan soal..."
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm bg-white"
                    required
                  />

                  {q.type === "pilihan_ganda" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.pilihan.map((p, pIdx) => (
                        <div key={pIdx} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`jawaban-${q.id}`}
                            checked={q.jawaban === p}
                            onChange={() => updateQuestion(idx, "jawaban", p)}
                            className="cursor-pointer"
                          />
                          <input
                            type="text"
                            value={p}
                            onChange={(e) => updatePilihan(idx, pIdx, e.target.value)}
                            placeholder={`Pilihan ${pIdx + 1}`}
                            className="w-full px-2 py-1 border rounded text-xs focus:outline-none focus:ring focus:ring-blue-300 bg-white"
                            required
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === "benar_salah" && (
                    <div className="flex gap-4">
                      {["Benar", "Salah"].map((opt) => (
                        <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="radio"
                            name={`jawaban-${q.id}`}
                            checked={q.jawaban === opt}
                            onChange={() => updateQuestion(idx, "jawaban", opt)}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  )}

                  {q.type === "essay" && (
                    <div>
                      <label className="text-xs text-gray-500">Kunci jawaban (opsional untuk otomatis):</label>
                      <input
                        type="text"
                        value={q.jawaban}
                        onChange={(e) => updateQuestion(idx, "jawaban", e.target.value)}
                        placeholder="Kunci jawaban..."
                        className="w-full px-2 py-1 border rounded text-xs focus:outline-none focus:ring focus:ring-blue-300 bg-white mt-1"
                      />
                    </div>
                  )}

                  {q.type === "pilihan_ganda" && !q.jawaban && q.pilihan.some((p) => p) && (
                    <p className="text-xs text-amber-600">Pilih jawaban yang benar dengan klik radio button</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
            <Button type="button" variant="info" onClick={() => setShowPreview(true)}>Preview</Button>
            <Button type="submit">{quiz ? "Update" : "Simpan"}</Button>
          </div>
        </form>

        {showPreview && (
          <QuizPreviewModal
            isOpen={showPreview}
            onClose={() => setShowPreview(false)}
            quiz={{ ...form, id: "preview" }}
          />
        )}
      </div>
    </div>
  );
};

export default QuizFormModal;
