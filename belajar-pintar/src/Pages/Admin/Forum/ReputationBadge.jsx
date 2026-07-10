const levels = [
  { name: "Legenda", min: 500, color: "text-yellow-500" },
  { name: "Bintang", min: 100, color: "text-purple-500" },
  { name: "Kontributor", min: 50, color: "text-green-500" },
  { name: "Aktif", min: 10, color: "text-blue-500" },
  { name: "Pemula", min: 0, color: "text-gray-400" },
];

const ReputationBadge = ({ upvotes = 0 }) => {
  const level = levels.find((l) => upvotes >= l.min) || levels[levels.length - 1];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${level.color}`}>
      <span className="text-sm">&#9733;</span>
      <span>{level.name}</span>
      <span className="text-gray-400">({upvotes})</span>
    </span>
  );
};
export default ReputationBadge;
