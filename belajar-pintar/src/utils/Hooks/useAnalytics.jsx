import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllLearningAnalytics } from "../Apis/AnalyticsApi";

const getProgressList = () => {
  try {
    return JSON.parse(localStorage.getItem("materiProgress") || "[]");
  } catch {
    return [];
  }
};

export const useLearningAnalytics = (userId) =>
  useQuery({
    queryKey: ["analytics", userId],
    queryFn: () => getAllLearningAnalytics({ user_id: userId }),
    select: (res) => res?.data ?? [],
    enabled: !!userId,
    placeholderData: (prev) => prev,
  });

export const useWeeklyProgress = (userId) => {
  const { data: analytics } = useLearningAnalytics(userId);

  return useMemo(() => {
    const weeks = [];
    const now = new Date();
    for (let i = 3; i >= 0; i--) {
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay() - i * 7);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);

      const label = `${start.getDate()}/${start.getMonth() + 1}`;
      const weekEntries = (analytics ?? []).filter((a) => {
        const d = new Date(a.date ?? a.created_at);
        return d >= start && d <= end;
      });

      const modulesCompleted = weekEntries.filter((a) => a.type === "module_complete").length;
      const quizzesPassed = weekEntries.filter((a) => a.type === "quiz_pass").length;
      const totalMinutes = weekEntries.reduce((sum, a) => sum + (a.duration_minutes ?? 0), 0);

      weeks.push({ label, modulesCompleted, quizzesPassed, totalMinutes });
    }
    return weeks;
  }, [analytics]);
};

export const useCategoryTime = (userId) => {
  const { data: analytics } = useLearningAnalytics(userId);

  return useMemo(() => {
    const map = {};
    (analytics ?? []).forEach((a) => {
      const cat = a.category ?? "Lainnya";
      map[cat] = (map[cat] ?? 0) + (a.duration_minutes ?? 0);
    });
    return Object.entries(map).map(([category, minutes]) => ({ category, minutes }));
  }, [analytics]);
};

export const useModuleStatus = () => {
  const progress = useMemo(() => getProgressList(), []);

  return useMemo(() => {
    const arr = Array.isArray(progress) ? progress : Object.values(progress);
    const total = arr.length;
    const completed = arr.filter((p) => p.selesai || p.completed || p.status === "completed").length;
    const inProgress = arr.filter(
      (p) => !p.selesai && !p.completed && p.status !== "completed" && (p.progress ?? 0) > 0
    ).length;
    const notStarted = total - completed - inProgress;

    return [
      { status: "Selesai", count: completed },
      { status: "Sedang Dipelajari", count: inProgress },
      { status: "Belum Mulai", count: Math.max(0, notStarted) },
    ];
  }, [progress]);
};

export const useAccumulatedHours = (userId) => {
  const { data: analytics } = useLearningAnalytics(userId);

  return useMemo(() => {
    const sorted = [...(analytics ?? [])].sort(
      (a, b) => new Date(a.date ?? a.created_at) - new Date(b.date ?? b.created_at)
    );

    const result = [];
    let cumulative = 0;
    for (const a of sorted) {
      cumulative += (a.duration_minutes ?? 0) / 60;
      const d = new Date(a.date ?? a.created_at);
      result.push({
        date: `${d.getDate()}/${d.getMonth() + 1}`,
        hours: Math.round(cumulative * 100) / 100,
      });
    }
    return result;
  }, [analytics]);
};

export const useSkillRadar = (userId) => {
  const { data: analytics } = useLearningAnalytics(userId);

  return useMemo(() => {
    const categories = ["Pemrograman", "Basis Data", "Jaringan", "Matematika", "Bahasa Inggris"];
    const scores = {};

    categories.forEach((cat) => {
      const catAnalytics = (analytics ?? []).filter((a) => a.category === cat);
      const moduleScore = catAnalytics.filter((a) => a.type === "module_complete").length * 20;
      const quizScore = catAnalytics.filter((a) => a.type === "quiz_pass").length * 25;
      const raw = moduleScore + quizScore;
      scores[cat] = Math.min(100, raw);
    });

    return categories.map((subject) => ({ subject, score: scores[subject] ?? 0 }));
  }, [analytics]);
};

export const useStreak = (userId) => {
  const { data: analytics } = useLearningAnalytics(userId);

  return useMemo(() => {
    if (!analytics || analytics.length === 0) return 0;

    const dates = [
      ...new Set(
        (analytics ?? []).map((a) => {
          const d = new Date(a.date ?? a.created_at);
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        })
      ),
    ].sort().reverse();

    let streak = 0;
    const checkDate = new Date();

    for (let i = 0; i < 365; i++) {
      const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, "0")}-${String(checkDate.getDate()).padStart(2, "0")}`;
      if (dates.includes(dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }, [analytics]);
};

export const useLearningStats = (userId) => {
  const progress = useMemo(() => getProgressList(), []);
  const streak = useStreak(userId);
  const { data: analytics } = useLearningAnalytics(userId);

  return useMemo(() => {
    const arr = Array.isArray(progress) ? progress : Object.values(progress);
    const totalModules = arr.length;
    const completedModules = arr.filter((p) => p.selesai || p.completed || p.status === "completed").length;
    const points = (analytics ?? []).reduce((sum, a) => sum + (a.poin ?? a.points ?? 0), 0);

    return { totalModules, completedModules, points, streak };
  }, [progress, analytics, streak]);
};
