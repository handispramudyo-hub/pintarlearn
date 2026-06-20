import AxiosInstance from "../AxiosInstance";

export const getAllDosen = (params = {}) => AxiosInstance.get("/dosen", { params });
export const getDosen = (id) => AxiosInstance.get(`/dosen/${id}`);
export const storeDosen = (data) => AxiosInstance.post("/dosen", data);
export const updateDosen = (id, data) => AxiosInstance.put(`/dosen/${id}`, data);
export const deleteDosen = (id) => AxiosInstance.delete(`/dosen/${id}`);
