import AxiosInstance from "../AxiosInstance";

export const getAllMatakuliah = (params = {}) => AxiosInstance.get("/matakuliah", { params });
export const getMatakuliah = (id) => AxiosInstance.get(`/matakuliah/${id}`);
export const storeMatakuliah = (data) => AxiosInstance.post("/matakuliah", data);
export const updateMatakuliah = (id, data) => AxiosInstance.put(`/matakuliah/${id}`, data);
export const deleteMatakuliah = (id) => AxiosInstance.delete(`/matakuliah/${id}`);
