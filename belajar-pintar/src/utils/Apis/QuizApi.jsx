import AxiosInstance from "../AxiosInstance";

export const getAllQuiz = (params = {}) => AxiosInstance.get("/quiz", { params });
export const getQuiz = (id) => AxiosInstance.get(`/quiz/${id}`);
export const storeQuiz = (data) => AxiosInstance.post("/quiz", data);
export const updateQuiz = (id, data) => AxiosInstance.put(`/quiz/${id}`, data);
export const deleteQuiz = (id) => AxiosInstance.delete(`/quiz/${id}`);

export const getAllQuizAttempts = (params = {}) => AxiosInstance.get("/quiz_attempts", { params });
export const getQuizAttempts = (id) => AxiosInstance.get(`/quiz_attempts/${id}`);
export const storeQuizAttempts = (data) => AxiosInstance.post("/quiz_attempts", data);
export const updateQuizAttempts = (id, data) => AxiosInstance.put(`/quiz_attempts/${id}`, data);
export const deleteQuizAttempts = (id) => AxiosInstance.delete(`/quiz_attempts/${id}`);
