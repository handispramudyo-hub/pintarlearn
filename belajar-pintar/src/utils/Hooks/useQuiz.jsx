import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllQuiz,
  getQuiz,
  storeQuiz,
  updateQuiz,
  deleteQuiz,
  getAllQuizAttempts,
  storeQuizAttempts,
} from "../Apis/QuizApi";
import { toastSuccess, toastError } from "../Helpers/ToastHelpers";

export const useQuiz = (query = {}) =>
  useQuery({
    queryKey: ["quiz", query],
    queryFn: () => getAllQuiz(query),
    select: (res) => ({
      data: res?.data ?? [],
      total: parseInt(res?.headers?.["x-total-count"] ?? "0", 10),
    }),
    placeholderData: (prev) => prev,
  });

export const useQuizById = (id) =>
  useQuery({
    queryKey: ["quiz", id],
    queryFn: () => getQuiz(id),
    select: (res) => res?.data,
    enabled: !!id,
  });

export const useStoreQuiz = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: storeQuiz,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["quiz"] });
      toastSuccess("Quiz berhasil ditambahkan");
    },
    onError: () => toastError("Gagal menyimpan quiz"),
  });
};

export const useUpdateQuiz = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateQuiz(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["quiz"] });
      toastSuccess("Quiz berhasil diupdate");
    },
    onError: () => toastError("Gagal menyimpan quiz"),
  });
};

export const useDeleteQuiz = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteQuiz,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["quiz"] });
      toastSuccess("Quiz berhasil dihapus");
    },
    onError: () => toastError("Gagal menghapus quiz"),
  });
};

export const useQuizAttempts = (query = {}) =>
  useQuery({
    queryKey: ["quiz-attempts", query],
    queryFn: () => getAllQuizAttempts(query),
    select: (res) => ({
      data: res?.data ?? [],
      total: parseInt(res?.headers?.["x-total-count"] ?? "0", 10),
    }),
    placeholderData: (prev) => prev,
  });

export const useStoreQuizAttempt = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: storeQuizAttempts,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["quiz-attempts"] });
      qc.invalidateQueries({ queryKey: ["achievement"] });
      qc.invalidateQueries({ queryKey: ["analytics"] });
      toastSuccess("Jawaban quiz berhasil disimpan");
    },
    onError: () => toastError("Gagal menyimpan jawaban quiz"),
  });
};
