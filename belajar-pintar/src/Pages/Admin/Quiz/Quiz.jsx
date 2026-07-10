import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../Components/Card";
import Heading from "../Components/Heading";
import Button from "../Components/Button";
import Swal from "sweetalert2";
import { useAuthStateContext } from "../../../utils/Contexts/AuthContext";
import { useQuiz, useDeleteQuiz } from "../../../utils/Hooks/useQuiz";
import { useMatakuliah } from "../../../utils/Hooks/useMatakuliah";
import QuizFormModal from "./QuizFormModal";
import QuizPreviewModal from "./QuizPreviewModal";

const Quiz = () => {
  const { user } = useAuthStateContext();
  const p = (perm) => user?.permission?.includes(perm);
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [editQuiz, setEditQuiz] = useState(null);
  const [previewQuiz, setPreviewQuiz] = useState(null);

  const { data: result = { data: [], total: 0 }, isLoading } = useQuiz({
    q: search || undefined,
    _page: page,
    _limit: limit,
  });

  const { data: mkResult = { data: [] } } = useMatakuliah({ _limit: 100 });
  const matakuliahList = mkResult.data;
  const quizzes = result.data;
  const totalPages = Math.ceil(result.total / limit);

  const { mutate: remove } = useDeleteQuiz();

  const resetPage = () => setPage(1);

  const openAdd = () => {
    setEditQuiz(null);
    setShowFormModal(true);
  };

  const openEdit = (q) => {
    setEditQuiz(q);
    setShowFormModal(true);
  };

  const openPreview = (q) => {
    setPreviewQuiz(q);
    setShowPreviewModal(true);
  };

  const handleDelete = (id, judul) => {
    Swal.fire({
      title: "Hapus quiz?",
      text: `Yakin ingin menghapus "${judul}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    }).then((res) => {
      if (res.isConfirmed) {
        remove(id);
      }
    });
  };

  const getMatkulName = (id) => {
    const mk = matakuliahList.find((m) => m.id === id);
    return mk ? mk.nama : "-";
  };

  if (isLoading) return <p className="text-center text-gray-500">Memuat data...</p>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Heading as="h2" spacing="mb-0">Manajemen Quiz</Heading>
          {p("quiz.create") && <Button onClick={openAdd}>+ Tambah Quiz</Button>}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <input
            type="text"
            placeholder="Cari quiz..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); resetPage(); }}
            className="flex-grow px-3 py-1.5 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm"
          />
          <select
            value={limit}
            onChange={(e) => { setLimit(Number(e.target.value)); resetPage(); }}
            className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value={4}>4 / hal</option>
            <option value={8}>8 / hal</option>
            <option value={16}>16 / hal</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {quizzes.map((q) => (
            <div
              key={q.id}
              className={`border rounded-lg p-4 space-y-3 transition hover:shadow-md ${
                q.published ? "bg-white border-gray-200" : "bg-gray-50 border-dashed border-gray-300"
              }`}
            >
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-sm leading-snug">{q.judul}</h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    q.published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {q.published ? "Published" : "Draft"}
                </span>
              </div>
              <p className="text-xs text-gray-500">{getMatkulName(q.matakuliah_id)}</p>
              {q.deskripsi && <p className="text-xs text-gray-400 line-clamp-2">{q.deskripsi}</p>}
              <div className="flex gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">⏱ {q.waktu} menit</span>
                <span className="flex items-center gap-1">✅ Lulus: {q.nilai_lulus}%</span>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                <Button size="sm" variant="info" onClick={() => openPreview(q)}>
                  Preview
                </Button>
                {p("quiz.update") && (
                  <Button size="sm" variant="warning" onClick={() => openEdit(q)}>
                    Edit
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => navigate(`/admin/quiz/kerjakan/${q.id}`)}
                >
                  Kerjakan
                </Button>
                {p("quiz.delete") && (
                  <Button size="sm" variant="danger" onClick={() => handleDelete(q.id, q.judul)}>
                    Hapus
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {quizzes.length === 0 && (
          <p className="text-center text-gray-400 py-8">Belum ada data quiz</p>
        )}

        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500">
              Halaman {page} dari {totalPages} ({result.total} data)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 bg-gray-200 rounded text-sm disabled:opacity-50 cursor-pointer"
              >
                Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3 py-1 bg-gray-200 rounded text-sm disabled:opacity-50 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>

      {showFormModal && (
        <QuizFormModal
          isOpen={showFormModal}
          onClose={() => setShowFormModal(false)}
          quiz={editQuiz}
          matakuliahList={matakuliahList}
        />
      )}

      {showPreviewModal && (
        <QuizPreviewModal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          quiz={previewQuiz}
        />
      )}
    </div>
  );
};

export default Quiz;
