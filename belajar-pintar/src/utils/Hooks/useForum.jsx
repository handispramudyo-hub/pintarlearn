import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllForumCategories,
  getAllForumThreads,
  getForumThreads,
  storeForumThreads,
  updateForumThreads,
  deleteForumThreads,
  getAllForumReplies,
  storeForumReplies,
  deleteForumReplies,
} from "../Apis/ForumApi";
import { toastSuccess, toastError } from "../Helpers/ToastHelpers";

export const useForumCategories = (query = {}) =>
  useQuery({
    queryKey: ["forum-categories", query],
    queryFn: () => getAllForumCategories(query),
    select: (res) => ({
      data: res?.data ?? [],
      total: parseInt(res?.headers?.["x-total-count"] ?? "0", 10),
    }),
    placeholderData: (prev) => prev,
  });

export const useForumThreads = (query = {}) =>
  useQuery({
    queryKey: ["forum-threads", query],
    queryFn: () => getAllForumThreads(query),
    select: (res) => ({
      data: res?.data ?? [],
      total: parseInt(res?.headers?.["x-total-count"] ?? "0", 10),
    }),
    placeholderData: (prev) => prev,
  });

export const useForumThread = (id) =>
  useQuery({
    queryKey: ["forum-threads", id],
    queryFn: () => getForumThreads(id),
    select: (res) => res?.data,
    enabled: !!id,
  });

export const useStoreThread = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: storeForumThreads,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["forum-threads"] });
      qc.invalidateQueries({ queryKey: ["achievement"] });
      toastSuccess("Thread berhasil dibuat");
    },
    onError: () => toastError("Gagal membuat thread"),
  });
};

export const useUpdateThread = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateForumThreads(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["forum-threads"] });
      toastSuccess("Thread berhasil diupdate");
    },
    onError: () => toastError("Gagal mengupdate thread"),
  });
};

export const useDeleteThread = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteForumThreads,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["forum-threads"] });
      toastSuccess("Thread berhasil dihapus");
    },
    onError: () => toastError("Gagal menghapus thread"),
  });
};

export const useForumReplies = (threadId, query = {}) =>
  useQuery({
    queryKey: ["forum-replies", threadId, query],
    queryFn: () => getAllForumReplies({ thread_id: threadId, ...query }),
    select: (res) => ({
      data: res?.data ?? [],
      total: parseInt(res?.headers?.["x-total-count"] ?? "0", 10),
    }),
    enabled: !!threadId,
    placeholderData: (prev) => prev,
  });

export const useStoreReply = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: storeForumReplies,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["forum-replies"] });
      qc.invalidateQueries({ queryKey: ["achievement"] });
      toastSuccess("Balasan berhasil dikirim");
    },
    onError: () => toastError("Gagal mengirim balasan"),
  });
};

export const useDeleteReply = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteForumReplies,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["forum-replies"] });
      toastSuccess("Balasan berhasil dihapus");
    },
    onError: () => toastError("Gagal menghapus balasan"),
  });
};
