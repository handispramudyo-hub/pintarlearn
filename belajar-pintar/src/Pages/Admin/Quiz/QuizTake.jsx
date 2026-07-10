import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import Button from "../Components/Button";
import { useQuizById, useStoreQuizAttempt } from "../../../utils/Hooks/useQuiz";
import { useAuthStateContext } from "../../../utils/Contexts/AuthContext";
import QuizResult from "./QuizResult";

function loadSavedState(key) {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return null;
}

const QuizTake = () => {
  const { id } = useParams();
  const { user } = useAuthStateContext();

  const { data: quiz, isLoading } = useQuizById(id);
  const { mutate: storeAttempt } = useStoreQuizAttempt();

  const storageKey = `quiz-answers-${id}-${user?.id}`;
  const savedState = loadSavedState(storageKey);

  const [currentIdx, setCurrentIdx] = useState(savedState?.currentIdx || 0);
  const [answers, setAnswers] = useState(savedState?.answers || {});
  const [marked, setMarked] = useState(savedState?.marked || {});
  const [timeLeft, setTimeLeft] = useState(() => savedState?.timeLeft ?? null);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const startTimeRef = useRef(null);
  const submittedRef = useRef(false);

  if (quiz && timeLeft === null && !savedState?.timeLeft) {
    setTimeLeft(quiz.waktu * 60);
  }

  useEffect(() => {
    if (submitted || timeLeft === null || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted, timeLeft]);

  useEffect(() => {
    if (submitted || timeLeft === null) return;
    localStorage.setItem(storageKey, JSON.stringify({ answers, marked, currentIdx, timeLeft }));
  }, [answers, marked, currentIdx, timeLeft, storageKey, submitted]);

  const handleSubmit = useCallback(() => {
    if (!quiz || submittedRef.current) return;
    submittedRef.current = true;
    const elapsed = startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : 0;
    const questions = quiz.questions || [];
    let benar = 0;
    let salah = 0;

    const detail = questions.map((q) => {
      const jawaban = answers[q.id] || "";
      const isCorrect = q.type === "essay"
        ? jawaban.trim().toLowerCase() === (q.jawaban || "").trim().toLowerCase()
        : jawaban === q.jawaban;
      if (isCorrect) benar++;
      else salah++;
      return { question_id: q.id, jawaban, benar: isCorrect };
    });

    const totalSoal = questions.length;
    const score = totalSoal > 0 ? Math.round((benar / totalSoal) * 100) : 0;
    const lulus = score >= (quiz.nilai_lulus || 70);

    const attemptData = {
      user_id: user?.id,
      quiz_id: quiz.id,
      score,
      total_soal: totalSoal,
      jawaban_benar: benar,
      jawaban_salah: salah,
      waktu_pengerjaan: elapsed,
      answers: detail,
      tanggal: new Date().toISOString(),
      lulus,
    };

    storeAttempt(attemptData);
    setResult(attemptData);
    setSubmitted(true);
    localStorage.removeItem(storageKey);
  }, [quiz, answers, user, storeAttempt, storageKey]);

  useEffect(() => {
    if (timeLeft !== 0 || !quiz || submitted || Object.keys(answers).length === 0) return;
    handleSubmit();
  }, [timeLeft, quiz, submitted, answers, handleSubmit]);

  const formatTime = useCallback((secs) => {
    if (secs == null) return "--:--";
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, []);

  const setAnswer = (qId, value) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const toggleMark = (qId) => {
    setMarked((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  if (isLoading) return <p className="text-center text-gray-500">Memuat quiz...</p>;
  if (!quiz) return <p className="text-center text-gray-500">Quiz tidak ditemukan</p>;
  if (result) return <QuizResult result={result} quiz={quiz} />;

  const questions = quiz.questions || [];
  const current = questions[currentIdx];

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="bg-white rounded-lg shadow p-4 flex flex-wrap justify-between items-center gap-3">
        <div>
          <h2 className="font-semibold text-lg">{quiz.judul}</h2>
          <p className="text-xs text-gray-500">
            Soal {currentIdx + 1} dari {questions.length} | Lulus: {quiz.nilai_lulus}%
          </p>
        </div>
        <div className={`text-xl font-mono font-bold ${timeLeft != null && timeLeft <= 60 ? "text-red-600 animate-pulse" : "text-gray-800"}`}>
          ⏱ {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {questions.map((q, idx) => (
          <button
            key={q.id}
            onClick={() => setCurrentIdx(idx)}
            className={`w-9 h-9 rounded text-xs font-medium transition cursor-pointer ${
              idx === currentIdx
                ? "bg-blue-600 text-white"
                : answers[q.id]
                ? marked[q.id]
                  ? "bg-yellow-400 text-white"
                  : "bg-green-500 text-white"
                : marked[q.id]
                ? "bg-yellow-300 text-gray-800"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {current && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex justify-between items-start">
            <p className="font-medium text-sm">
              <span className="text-blue-600 font-semibold mr-1">Soal {currentIdx + 1}.</span>
              {current.soal}
            </p>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 whitespace-nowrap ml-2">
              {current.type === "pilihan_ganda" ? "PG" : current.type === "benar_salah" ? "B/S" : "Essay"}
            </span>
          </div>

          {current.type === "pilihan_ganda" && (
            <div className="space-y-2">
              {current.pilihan?.map((opt, i) => (
                <label
                  key={i}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border cursor-pointer transition ${
                    answers[current.id] === opt
                      ? "bg-blue-50 border-blue-400"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${current.id}`}
                    checked={answers[current.id] === opt}
                    onChange={() => setAnswer(current.id, opt)}
                    className="cursor-pointer"
                  />
                  <span className="text-sm">
                    <span className="font-medium text-gray-500 mr-2">{String.fromCharCode(65 + i)}.</span>
                    {opt}
                  </span>
                </label>
              ))}
            </div>
          )}

          {current.type === "benar_salah" && (
            <div className="flex gap-3">
              {["Benar", "Salah"].map((opt) => (
                <label
                  key={opt}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition ${
                    answers[current.id] === opt
                      ? "bg-blue-50 border-blue-400"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${current.id}`}
                    checked={answers[current.id] === opt}
                    onChange={() => setAnswer(current.id, opt)}
                    className="cursor-pointer"
                  />
                  <span className="text-sm font-medium">{opt}</span>
                </label>
              ))}
            </div>
          )}

          {current.type === "essay" && (
            <textarea
              value={answers[current.id] || ""}
              onChange={(e) => setAnswer(current.id, e.target.value)}
              rows={5}
              placeholder="Tuliskan jawaban Anda..."
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-sm"
            />
          )}

          <div className="flex justify-between items-center pt-2">
            <Button
              size="sm"
              variant={marked[current.id] ? "warning" : "secondary"}
              onClick={() => toggleMark(current.id)}
            >
              {marked[current.id] ? "★ Ditandai" : "☆ Tandai Review"}
            </Button>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setCurrentIdx((i) => Math.max(i - 1, 0))}
                disabled={currentIdx === 0}
              >
                ← Sebelumnya
              </Button>
              {currentIdx < questions.length - 1 ? (
                <Button size="sm" onClick={() => setCurrentIdx((i) => i + 1)}>
                  Berikutnya →
                </Button>
              ) : (
                <Button size="sm" variant="success" onClick={() => setShowConfirm(true)}>
                  Selesai & Submit
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={() => setShowConfirm(false)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold">Konfirmasi Submit</h2>
            <p className="text-sm text-gray-600">
              Anda yakin ingin menyelesaikan quiz ini? Pastikan semua soal sudah dijawab.
            </p>
            <div className="text-sm text-gray-500 space-y-1">
              <p>Total soal: {questions.length}</p>
              <p>Sudah dijawab: {Object.keys(answers).filter((k) => answers[k]).length}</p>
              <p>Belum dijawab: {questions.length - Object.keys(answers).filter((k) => answers[k]).length}</p>
              <p>Ditandai review: {Object.values(marked).filter(Boolean).length}</p>
              <p>Sisa waktu: {formatTime(timeLeft)}</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowConfirm(false)}>Batal</Button>
              <Button variant="success" onClick={handleSubmit}>Ya, Submit</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizTake;
