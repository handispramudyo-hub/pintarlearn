import toast from "react-hot-toast";

export const toastSuccess = (message) => toast.success(message, { duration: 3000, position: "top-right", style: { borderRadius: "10px", background: "#333", color: "#fff" } });
export const toastError = (message) => toast.error(message, { duration: 4000, position: "top-right", style: { borderRadius: "10px" } });
export const toastInfo = (message) => toast(message, { duration: 3000, position: "top-right", icon: "ℹ️" });