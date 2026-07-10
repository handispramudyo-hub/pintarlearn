import { useNavigate } from "react-router-dom";
import Card from "../Components/Card";
import Heading from "../Components/Heading";
import Button from "../Components/Button";

const QuizResult = ({ result, quiz }) => {
  const navigate = useNavigate();

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    if (m > 0) return `${m} menit ${s} detik`;
    return `${s} detik`;
  };

  const radius = 60;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (result.score / 100) * circumference;

  const questions = quiz?.questions || [];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className="text-center space-y-6">
        <Heading as="h2">Hasil Quiz</Heading>
        <p className="text-sm text-gray-500">{quiz?.judul}</p>

        <div className="flex justify-center">
          <svg height={radius * 2} width={radius * 2}>
            <circle
              stroke="#e5e7eb"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            <circle
              stroke={result.lulus ? "#16a34a" : "#dc2626"}
              fill="transparent"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              style={{ transition: "stroke-dashoffset 1s ease-out", transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
            />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="central"
              className="text-2xl font-bold"
              fill={result.lulus ? "#16a34a" : "#dc2626"}
            >
              {result.score}%
            </text>
          </svg>
        </div>

        <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
          result.lulus ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {result.lulus ? "LULUS" : "TIDAK LULUS"}
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-green-600">{result.jawaban_benar}</p>
            <p className="text-xs text-gray-500">Benar</p>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-red-600">{result.jawaban_salah}</p>
            <p className="text-xs text-gray-500">Salah</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-blue-600">{formatTime(result.waktu_pengerjaan)}</p>
            <p className="text-xs text-gray-500">Waktu</p>
          </div>
        </div>

        <div className="text-sm text-gray-500 space-y-1">
          <p>Total Soal: {result.total_soal}</p>
          <p>Nilai Lulus: {quiz?.nilai_lulus}%</p>
          <p>Tanggal: {new Date(result.tanggal).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
      </Card>

      <Card>
        <Heading as="h3" spacing="mb-4">Analisis Jawaban</Heading>
        <div className="space-y-4">
          {questions.map((q, idx) => {
            const answerData = result.answers?.find((a) => a.question_id === q.id);
            const isCorrect = answerData?.benar;
            const userAnswer = answerData?.jawaban || "(Tidak dijawab)";

            return (
              <div
                key={q.id || idx}
                className={`border rounded-lg p-4 ${
                  isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    isCorrect ? "bg-green-500" : "bg-red-500"
                  }`}>
                    {isCorrect ? "✓" : "✕"}
                  </span>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-gray-800">
                      <span className="text-gray-500 mr-1">{idx + 1}.</span>
                      {q.soal}
                    </p>
                    <div className="text-xs space-y-0.5">
                      <p>
                        <span className="text-gray-500">Jawaban Anda: </span>
                        <span className={isCorrect ? "text-green-700 font-medium" : "text-red-700 font-medium"}>
                          {userAnswer}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p>
                          <span className="text-gray-500">Kunci Jawaban: </span>
                          <span className="text-green-700 font-medium">{q.jawaban || "-"}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="flex justify-center pb-6">
        <Button onClick={() => navigate("/admin/quiz")}>Kembali ke Daftar Quiz</Button>
      </div>
    </div>
  );
};

export default QuizResult;
