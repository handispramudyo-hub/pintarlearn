import axios from "axios";
import localApi from "./LocalDb";

const isLocal = import.meta.env.VITE_USE_LOCAL_API !== "false";

const localAdapter = async (config) => {
  const url = new URL(config.url, config.baseURL);
  const segments = url.pathname.split("/").filter(Boolean);
  const resource = segments[0];
  const id = segments[1];
  const params = { ...Object.fromEntries(url.searchParams.entries()), ...(config.params || {}) };

  if (id) params.id = id;

  let data = config.data;
  if (typeof data === "string") {
    try { data = JSON.parse(data); } catch {}
  }

  let result;
  switch (config.method) {
    case "get":
      result = localApi.get(resource, params);
      break;
    case "post":
      result = localApi.post(resource, data || {});
      break;
    case "put":
      result = localApi.put(resource, id, data || {});
      break;
    case "delete":
      result = localApi.delete(resource, id);
      break;
    default:
      throw new Error("Not found");
  }

  if (result.status >= 400) {
    throw new Error("Not found");
  }

  return {
    data: result.data,
    status: result.status,
    statusText: "OK",
    headers: result.headers || {},
    config,
  };
};

const AxiosInstance = axios.create({
  baseURL: "http://localhost:3001",
  headers: { "Content-Type": "application/json" },
});

if (isLocal) {
  AxiosInstance.interceptors.request.use((config) => {
    config.adapter = localAdapter;
    return config;
  });
}

export default AxiosInstance;
