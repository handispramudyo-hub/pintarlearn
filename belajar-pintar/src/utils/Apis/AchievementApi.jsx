import AxiosInstance from "../AxiosInstance";

export const getAllAchievements = (params = {}) => AxiosInstance.get("/achievements", { params });
export const getAchievements = (id) => AxiosInstance.get(`/achievements/${id}`);
export const storeAchievements = (data) => AxiosInstance.post("/achievements", data);
export const updateAchievements = (id, data) => AxiosInstance.put(`/achievements/${id}`, data);
export const deleteAchievements = (id) => AxiosInstance.delete(`/achievements/${id}`);

export const getAllUserAchievements = (params = {}) => AxiosInstance.get("/user_achievements", { params });
export const getUserAchievements = (id) => AxiosInstance.get(`/user_achievements/${id}`);
export const storeUserAchievements = (data) => AxiosInstance.post("/user_achievements", data);
export const updateUserAchievements = (id, data) => AxiosInstance.put(`/user_achievements/${id}`, data);
export const deleteUserAchievements = (id) => AxiosInstance.delete(`/user_achievements/${id}`);
