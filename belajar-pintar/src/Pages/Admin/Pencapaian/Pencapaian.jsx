import { useMemo } from "react";
import Card from "../Components/Card";
import Heading from "../Components/Heading";
import { useAuthStateContext } from "../../../utils/Contexts/AuthContext";
import { useAchievements, useUserAchievements } from "../../../utils/Hooks/useAchievement";
import { useStreak } from "../../../utils/Hooks/useAnalytics";
import { useQuizAttempts } from "../../../utils/Hooks/useQuiz";
import { useForumThreads, useForumReplies } from "../../../utils/Hooks/useForum";
import { modulist } from "../../../utils/dummyData";
import LearningPath from "./LearningPath";

const RARITY_CONFIG = {
  common: { color: "bg-gray-100 border-gray-300 text-gray-600", badge: "bg-gray-400", label: "Common" },
  uncommon: { color: "bg-green-50 border-green-300 text-green-700", badge: "bg-green-500", label: "Uncommon" },
  epic: { color: "bg-purple-50 border-purple-300 text-purple-700", badge: "bg-purple-500", label: "Epic" },
  legendary: { color: "bg-orange-50 border-orange-300 text-orange-700", badge: "bg-orange-500", label: "Legendary" },
};

const CATEGORY_LABELS = {
  modules_completed: "Modul Selesai",
  points_earned: "Poin",
  quizzes_passed: "Quiz Lulus",
  forum_threads: "Forum Aktif",
  streak_days: "Streak Harian",
};

const Pencapaian = () => {
  const { user } = useAuthStateContext();
  const userId = user?.id;

  const { data: achievementsData = { data: [] }, isLoading: loadingAchievements } = useAchievements();
  const { data: userAchievementsData = { data: [] } } = useUserAchievements(userId);
  const streak = useStreak(userId);
  const { data: quizData = { data: [] } } = useQuizAttempts(userId ? { user_id: userId } : {});
  const { data: threadsData = { data: [] } } = useForumThreads(userId ? { user_id: userId } : {});
  const { data: repliesData = { data: [] } } = useForumReplies(null, userId ? { user_id: userId } : {});

  const allAchievements = achievementsData.data;
  const unlockedIds = useMemo(
    () => new Set(userAchievementsData.data.map((a) => a.achievement_id)),
    [userAchievementsData.data]
  );

  const materiProgress = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("materiProgress") || "{}"); } catch { return {}; }
  }, []);

  const stats = useMemo(() => {
    const completedModules = modulist.filter((m) => {
      const p = materiProgress[m.id];
      return p?.completed || p?.status === "completed" || m.selesai;
    }).length;

    const quizzesPassed = quizData.data.filter((q) => (q.score ?? 0) >= 60).length;
    const forumThreads = threadsData.data.length;
    const forumReplies = repliesData.data.length;
    const totalPoints = userAchievementsData.data.reduce((sum, a) => sum + (a.points ?? 10), 0);

    return {
      completedModules,
      quizzesPassed,
      forumThreads,
      forumReplies,
      streak,
      totalPoints,
    };
  }, [materiProgress, quizData.data, threadsData.data, repliesData.data, userAchievementsData.data, streak]);

  const getProgressForAchievement = (achievement) => {
    const condition = achievement.condition;
    if (!condition) return { current: 0, target: 1 };

    let current = 0;
    if (condition.type === "modules_completed") {
      current = stats.completedModules;
    } else if (condition.type === "points_earned") {
      current = stats.totalPoints;
    } else if (condition.type === "quizzes_passed") {
      current = stats.quizzesPassed;
    } else if (condition.type === "forum_threads") {
      current = stats.forumThreads + stats.forumReplies;
    } else if (condition.type === "streak_days") {
      current = stats.streak;
    }
    return { current, target: condition.value ?? 1 };
  };

  const categories = useMemo(() => {
    const map = {};
    allAchievements.forEach((a) => {
      const type = a.condition?.type || "other";
      if (!map[type]) map[type] = { type, total: 0, unlocked: 0, label: CATEGORY_LABELS[type] || type };
      map[type].total++;
      if (unlockedIds.has(a.id)) map[type].unlocked++;
    });
    return Object.values(map);
  }, [allAchievements, unlockedIds]);

  const totalUnlocked = userAchievementsData.data.length;
  const totalAchievements = allAchievements.length;
  const completionPct = totalAchievements > 0 ? Math.round((totalUnlocked / totalAchievements) * 100) : 0;

  const level = useMemo(() => {
    const pts = stats.totalPoints;
    if (pts >= 500) return { name: "Master", icon: "👑" };
    if (pts >= 300) return { name: "Expert", icon: "⭐" };
    if (pts >= 150) return { name: "Intermediate", icon: "🔥" };
    if (pts >= 50) return { name: "Beginner", icon: "🌱" };
    return { name: "Newcomer", icon: "🐣" };
  }, [stats.totalPoints]);

  if (loadingAchievements) {
    return <p className="text-center text-gray-500 py-10">Memuat pencapaian...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">{level.icon} Pencapaian & Gamifikasi</h2>
            <p className="text-blue-100 mt-1">Selamat datang, {user?.name || "Mahasiswa"}!</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{stats.totalPoints}</p>
              <p className="text-blue-200 text-sm">Total Poin</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{level.icon}</p>
              <p className="text-blue-200 text-sm">{level.name}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{streak}</p>
              <p className="text-blue-200 text-sm">Streak Hari</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <p className="text-4xl font-bold text-blue-600">{totalUnlocked}</p>
          <p className="text-gray-500 mt-1">Badge Terbuka</p>
          <p className="text-xs text-gray-400 mt-1">dari {totalAchievements} total</p>
        </Card>
        <Card className="text-center">
          <p className="text-4xl font-bold text-green-600">{completionPct}%</p>
          <p className="text-gray-500 mt-1">Persentase Selesai</p>
        </Card>
        <Card className="text-center">
          <p className="text-4xl font-bold text-purple-600">{stats.completedModules}</p>
          <p className="text-gray-500 mt-1">Modul Selesai</p>
        </Card>
      </div>

      <Card>
        <Heading as="h3" spacing="mb-4">Progress Pencapaian</Heading>
        <div className="space-y-4">
          {categories.map((cat) => (
            <div key={cat.type}>
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                <span>{cat.label}</span>
                <span>{cat.unlocked}/{cat.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${cat.total > 0 ? (cat.unlocked / cat.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-gray-400 text-sm text-center">Belum ada pencapaian yang tersedia</p>
          )}
        </div>
      </Card>

      <Card>
        <Heading as="h3" spacing="mb-4">Koleksi Badge</Heading>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {allAchievements.map((a) => {
            const unlocked = unlockedIds.has(a.id);
            const rarity = RARITY_CONFIG[a.rarity] || RARITY_CONFIG.common;
            const progressInfo = getProgressForAchievement(a);
            const progressPct = Math.min(100, Math.round((progressInfo.current / progressInfo.target) * 100));

            return (
              <div
                key={a.id}
                className={`relative rounded-xl border-2 p-4 text-center transition-all ${
                  unlocked ? rarity.color : "bg-gray-50 border-gray-200 opacity-60"
                }`}
              >
                {unlocked && (
                  <span className={`absolute top-2 right-2 w-3 h-3 rounded-full ${rarity.badge}`}></span>
                )}
                <div className={`text-4xl mb-2 ${unlocked ? "" : "grayscale"}`}>
                  {a.icon || "🏆"}
                </div>
                <p className="font-semibold text-sm text-gray-800 truncate">{a.nama || a.name}</p>
                <p className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block ${
                  unlocked ? `${rarity.badge} text-white` : "bg-gray-200 text-gray-500"
                }`}>
                  {rarity.label}
                </p>
                {!unlocked && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-blue-400 h-1.5 rounded-full" style={{ width: `${progressPct}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{progressInfo.current}/{progressInfo.target}</p>
                  </div>
                )}
              </div>
            );
          })}
          {allAchievements.length === 0 && (
            <p className="col-span-full text-gray-400 text-sm text-center py-8">Belum ada badge yang tersedia</p>
          )}
        </div>
      </Card>

      <LearningPath />
    </div>
  );
};

export default Pencapaian;
