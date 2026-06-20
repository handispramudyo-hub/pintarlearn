import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "http://localhost:3001",
  headers: { "Content-Type": "application/json" },
});

export default AxiosInstance;
