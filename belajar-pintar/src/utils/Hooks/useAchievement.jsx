import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllAchievements,
  getAllUserAchievements,
  storeUserAchievements,
} from "../Apis/AchievementApi";
import { toastSuccess, toastError } from "../Helpers/ToastHelpers";

export const useAchievements = (query = {}) =>
  useQuery({
    queryKey: ["achievement", query],
    queryFn: () => getAllAchievements(query),
    select: (res) => ({
      data: res?.data ?? [],
      total: parseInt(res?.headers?.["x-total-count"] ?? "0", 10),
    }),
    placeholderData: (prev) => prev,
  });

export const useUserAchievements = (userId) =>
  useQuery({
    queryKey: ["user-achievements", userId],
    queryFn: () => getAllUserAchievements({ user_id: userId }),
    select: (res) => ({
      data: res?.data ?? [],
      total: parseInt(res?.headers?.["x-total-count"] ?? "0", 10),
    }),
    enabled: !!userId,
    placeholderData: (prev) => prev,
  });

export const useStoreUserAchievement = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: storeUserAchievements,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["user-achievements"] });
      toastSuccess("Pencapaian berhasil didapatkan!");
    },
    onError: () => toastError("Gagal menyimpan pencapaian"),
  });
};

export const useCheckAndUnlockAchievements = () => {
  const qc = useQueryClient();
  return async (userId, stats) => {
    try {
      const { data: achievements } = await getAllAchievements();
      const { data: unlocked } = await getAllUserAchievements({ user_id: userId });
      const unlockedIds = unlocked.map((a) => a.achievement_id);

      for (const achievement of achievements) {
        if (unlockedIds.includes(achievement.id)) continue;

        let earned = false;
        switch (achievement.condition?.type) {
          case "modules_completed":
            earned = (stats.completedModules ?? 0) >= achievement.condition.value;
            break;
          case "points_earned":
            earned = (stats.points ?? 0) >= achievement.condition.value;
            break;
          case "quizzes_passed":
            earned = (stats.quizzesPassed ?? 0) >= achievement.condition.value;
            break;
          case "forum_threads":
            earned = (stats.forumThreads ?? 0) >= achievement.condition.value;
            break;
          case "streak_days":
            earned = (stats.streak ?? 0) >= achievement.condition.value;
            break;
          default:
            break;
        }

        if (earned) {
          await storeUserAchievements({ user_id: userId, achievement_id: achievement.id, unlocked_at: new Date().toISOString() });
        }
      }

      qc.invalidateQueries({ queryKey: ["user-achievements"] });
    } catch {
      toastError("Gagal memeriksa pencapaian");
    }
  };
};
