import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllUsers,
  updateUser,
  deleteUser,
} from "../Apis/UserApi";
import { toastSuccess, toastError } from "../../utils/Helpers/ToastHelpers";

export const useUsers = (query = {}) =>
  useQuery({
    queryKey: ["users", query],
    queryFn: () => getAllUsers(query),
    select: (res) => ({
      data: res?.data ?? [],
      total: parseInt(res?.headers?.["x-total-count"] ?? "0", 10),
    }),
    placeholderData: (prev) => prev,
  });

export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      toastSuccess("Data user berhasil diupdate");
    },
    onError: () => toastError("Gagal menyimpan data"),
  });
};

export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      toastSuccess("User berhasil dihapus");
    },
    onError: () => toastError("Gagal menghapus user"),
  });
};
