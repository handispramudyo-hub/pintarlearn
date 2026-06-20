import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllKelas, storeKelas, updateKelas, deleteKelas } from "../Apis/KelasApi";
import { toastSuccess, toastError } from "../../Utils/Helpers/ToastHelpers";

export const useKelas = (query = {}) =>
  useQuery({
    queryKey: ["kelas", query],
    queryFn: () => getAllKelas(query),
    select: (res) => ({
      data: res?.data ?? [],
      total: parseInt(res?.headers?.["x-total-count"] ?? "0", 10),
    }),
    placeholderData: (prev) => prev,
  });

export const useStoreKelas = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: storeKelas,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["kelas"] });
      toastSuccess("Kelas berhasil ditambahkan");
    },
    onError: () => toastError("Gagal menyimpan data"),
  });
};

export const useUpdateKelas = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateKelas(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["kelas"] });
      toastSuccess("Kelas berhasil diupdate");
    },
    onError: () => toastError("Gagal menyimpan data"),
  });
};

export const useDeleteKelas = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteKelas,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["kelas"] });
      toastSuccess("Kelas berhasil dihapus");
    },
    onError: () => toastError("Gagal menghapus kelas"),
  });
};
