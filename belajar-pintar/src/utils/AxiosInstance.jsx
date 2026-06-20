import axios from "axios";
import localApi from "./LocalDb";

const isLocal = import.meta.env.VITE_USE_LOCAL_API === "true";

const AxiosInstance = axios.create({
  baseURL: "http://localhost:3001",
  headers: { "Content-Type": "application/json" },
});

if (isLocal) {
  AxiosInstance.interceptors.request.use(async (config) => {
    const url = new URL(config.url, "http://localhost");
    const segments = url.pathname.split("/").filter(Boolean);
    const resource = segments[0];
    const id = segments[1];
    const params = Object.fromEntries(url.searchParams.entries());

    if (id) params.id = id;

    let result;
    switch (config.method) {
      case "get":
        result = localApi.get(resource, params);
        break;
      case "post":
        result = localApi.post(resource, config.data || {});
        break;
      case "put":
        result = localApi.put(resource, id, config.data || {});
        break;
      case "delete":
        result = localApi.delete(resource, id);
        break;
      default:
        return config;
    }

    if (result.status >= 400) {
      return Promise.reject(new Error("Not found"));
    }

    return {
      data: result.data,
      status: result.status,
      headers: result.headers || {},
    };
  });
}

export default AxiosInstance;
