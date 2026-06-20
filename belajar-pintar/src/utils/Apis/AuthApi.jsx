import AxiosInstance from "../AxiosInstance";

export const login = async (email, password) => {
  const res = await AxiosInstance.get("/user", { params: { email } });
  const user = res.data[0];
  if (!user) throw new Error("Email tidak ditemukan");
  if (user.password !== password) throw new Error("Password salah");
  return user;
};

export const register = async (data) => {
  const res = await AxiosInstance.get("/user", { params: { email: data.email } });
  if (res.data.length > 0) throw new Error("Email sudah terdaftar");
  return AxiosInstance.post("/user", data);
};
