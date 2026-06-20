import AxiosInstance from "../AxiosInstance";

export const getAllUsers = (params = {}) => AxiosInstance.get("/user", { params });
export const getUser = (id) => AxiosInstance.get(`/user/${id}`);
export const storeUser = (data) => AxiosInstance.post("/user", data);
export const updateUser = (id, data) => AxiosInstance.put(`/user/${id}`, data);
export const deleteUser = (id) => AxiosInstance.delete(`/user/${id}`);
