import AxiosInstance from "../AxiosInstance";

export const getAllMatakuliah = () => AxiosInstance.get("/matakuliah");
export const getMatakuliah = (id) => AxiosInstance.get(`/matakuliah/${id}`);
export const storeMatakuliah = (data) => AxiosInstance.post("/matakuliah", data);
export const updateMatakuliah = (id, data) => AxiosInstance.put(`/matakuliah/${id}`, data);
export const deleteMatakuliah = (id) => AxiosInstance.delete(`/matakuliah/${id}`);
