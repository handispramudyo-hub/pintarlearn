import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllDosen,
  storeDosen,
  updateDosen,
  deleteDosen,
} from "../Apis/DosenApi";
import { toastSuccess, toastError } from "../../Utils/Helpers/ToastHelpers";

export const useDosen = (query = {}) =>
  useQuery({
    queryKey: ["dosen", query],
    queryFn: () => getAllDosen(query),
    select: (res) => ({
      data: res?.data ?? [],
      total: parseInt(res?.headers?.["x-total-count"] ?? "0", 10),
    }),
    placeholderData: (prev) => prev,
  });

export const useStoreDosen = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: storeDosen,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dosen"] });
      toastSuccess("Data dosen berhasil ditambahkan");
    },
    onError: () => toastError("Gagal menyimpan data"),
  });
};

export const useUpdateDosen = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateDosen(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dosen"] });
      toastSuccess("Data dosen berhasil diupdate");
    },
    onError: () => toastError("Gagal menyimpan data"),
  });
};

export const useDeleteDosen = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteDosen,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dosen"] });
      toastSuccess("Dosen berhasil dihapus");
    },
    onError: () => toastError("Gagal menghapus dosen"),
  });
};
