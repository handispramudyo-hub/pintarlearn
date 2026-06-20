import { Navigate } from "react-router-dom";
import { useAuthStateContext } from "../../../Utils/Contexts/AuthContext";
const ProtectedRoute = ({ children }) => { const { user } = useAuthStateContext(); if (!user) return <Navigate to="/" replace />; return children; };
export default ProtectedRoute;