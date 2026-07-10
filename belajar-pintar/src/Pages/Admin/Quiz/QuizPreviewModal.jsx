const typeLabels = { pilihan_ganda: "Pilihan Ganda", benar_salah: "Benar / Salah", essay: "Essay" };

const QuizPreviewModal = ({ isOpen, onClose, quiz }) => {
  if (!isOpen || !quiz) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[60]" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold">{quiz.judul}</h2>
            <p className="text-xs text-gray-500">{quiz.deskripsi}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 text-2xl cursor-pointer">&times;</button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {quiz.questions?.map((q, idx) => (
            <div key={q.id || idx} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-gray-800">
                  <span className="text-blue-600 font-semibold mr-1">{idx + 1}.</span>
                  {q.soal}
                </p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 whitespace-nowrap">
                  {typeLabels[q.type] || q.type}
                </span>
              </div>

              {q.type === "pilihan_ganda" && q.pilihan && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-2">
                  {q.pilihan.map((opt, i) => (
                    <div
                      key={i}
                      className={`px-3 py-1.5 rounded text-sm border ${
                        q.jawaban === opt
                          ? "bg-green-100 border-green-400 text-green-800 font-medium"
                          : "bg-gray-50 border-gray-200 text-gray-600"
                      }`}
                    >
                      {String.fromCharCode(65 + i)}. {opt}
                    </div>
                  ))}
                </div>
              )}

              {q.type === "benar_salah" && (
                <div className="flex gap-3 mt-2">
                  {["Benar", "Salah"].map((opt) => (
                    <span
                      key={opt}
                      className={`px-3 py-1 rounded text-sm border ${
                        q.jawaban === opt
                          ? "bg-green-100 border-green-400 text-green-800 font-medium"
                          : "bg-gray-50 border-gray-200 text-gray-600"
                      }`}
                    >
                      {opt}
                    </span>
                  ))}
                </div>
              )}

              {q.type === "essay" && (
                <div className="mt-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-500 italic">
                  {q.jawaban ? `Kunci: ${q.jawaban}` : "Jawaban essay - dinilai manual"}
                </div>
              )}
            </div>
          ))}

          {(!quiz.questions || quiz.questions.length === 0) && (
            <p className="text-center text-gray-400 py-8">Belum ada soal</p>
          )}
        </div>

        <div className="p-4 border-t flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizPreviewModal;
