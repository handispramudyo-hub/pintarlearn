import AxiosInstance from "../AxiosInstance";

export const getAllLearningAnalytics = (params = {}) => AxiosInstance.get("/learning_analytics", { params });
export const getLearningAnalytics = (id) => AxiosInstance.get(`/learning_analytics/${id}`);
export const storeLearningAnalytics = (data) => AxiosInstance.post("/learning_analytics", data);
export const updateLearningAnalytics = (id, data) => AxiosInstance.put(`/learning_analytics/${id}`, data);
export const deleteLearningAnalytics = (id) => AxiosInstance.delete(`/learning_analytics/${id}`);
