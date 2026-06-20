import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllMatakuliah,
  storeMatakuliah,
  updateMatakuliah,
  deleteMatakuliah,
} from "../Apis/MatakuliahApi";
import { toastSuccess, toastError } from "../../utils/Helpers/ToastHelpers";

export const useMatakuliah = (query = {}) =>
  useQuery({
    queryKey: ["matakuliah", query],
    queryFn: () => getAllMatakuliah(query),
    select: (res) => ({
      data: res?.data ?? [],
      total: parseInt(res?.headers?.["x-total-count"] ?? "0", 10),
    }),
    placeholderData: (prev) => prev,
  });

export const useStoreMatakuliah = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: storeMatakuliah,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["matakuliah"] });
      toastSuccess("Data matakuliah berhasil ditambahkan");
    },
    onError: () => toastError("Gagal menyimpan data"),
  });
};

export const useUpdateMatakuliah = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateMatakuliah(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["matakuliah"] });
      toastSuccess("Data matakuliah berhasil diupdate");
    },
    onError: () => toastError("Gagal menyimpan data"),
  });
};

export const useDeleteMatakuliah = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteMatakuliah,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["matakuliah"] });
      toastSuccess("Matakuliah berhasil dihapus");
    },
    onError: () => toastError("Gagal menghapus matakuliah"),
  });
};
