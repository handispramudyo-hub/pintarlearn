import AxiosInstance from "../AxiosInstance";

export const getAllForumCategories = (params = {}) => AxiosInstance.get("/forum_categories", { params });
export const getForumCategories = (id) => AxiosInstance.get(`/forum_categories/${id}`);
export const storeForumCategories = (data) => AxiosInstance.post("/forum_categories", data);
export const updateForumCategories = (id, data) => AxiosInstance.put(`/forum_categories/${id}`, data);
export const deleteForumCategories = (id) => AxiosInstance.delete(`/forum_categories/${id}`);

export const getAllForumThreads = (params = {}) => AxiosInstance.get("/forum_threads", { params });
export const getForumThreads = (id) => AxiosInstance.get(`/forum_threads/${id}`);
export const storeForumThreads = (data) => AxiosInstance.post("/forum_threads", data);
export const updateForumThreads = (id, data) => AxiosInstance.put(`/forum_threads/${id}`, data);
export const deleteForumThreads = (id) => AxiosInstance.delete(`/forum_threads/${id}`);

export const getAllForumReplies = (params = {}) => AxiosInstance.get("/forum_replies", { params });
export const getForumReplies = (id) => AxiosInstance.get(`/forum_replies/${id}`);
export const storeForumReplies = (data) => AxiosInstance.post("/forum_replies", data);
export const updateForumReplies = (id, data) => AxiosInstance.put(`/forum_replies/${id}`, data);
export const deleteForumReplies = (id) => AxiosInstance.delete(`/forum_replies/${id}`);
