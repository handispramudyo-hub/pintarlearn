import React from "react";
import ReactDOM from "react-dom/client";
import { Navigate, createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./Utils/Contexts/AuthContext";
import "./App.css";

import AuthLayout from "./Pages/Auth/AuthLayout";
import AdminLayout from "./Pages/Admin/AdminLayout";
import ProtectedRoute from "./Pages/Admin/Components/ProtectedRoute";
import Login from "./Pages/Auth/Login/Login";
import Register from "./Pages/Auth/Register/Register";
import Dashboard from "./Pages/Admin/Dashboard/Dashboard";
import Kelas from "./Pages/Admin/Kelas/Kelas";
import Dosen from "./Pages/Admin/Dosen/Dosen";
import Matakuliah from "./Pages/Admin/Matakuliah/Matakuliah";
import User from "./Pages/Admin/User/User";
import PageNotFound from "./Pages/Error/PageNotFound";

const router = createBrowserRouter([
  { path: "/", element: <AuthLayout />, children: [{ index: true, element: <Login /> }] },
  { path: "/register", element: <AuthLayout />, children: [{ index: true, element: <Register /> }] },
  { path: "/admin", element: <ProtectedRoute><AdminLayout /></ProtectedRoute>, children: [
    { index: true, element: <Navigate to="dashboard" replace /> },
    { path: "dashboard", element: <Dashboard /> },
    { path: "kelas", element: <Kelas /> },
    { path: "dosen", element: <Dosen /> },
    { path: "matakuliah", element: <Matakuliah /> },
    { path: "user", element: <User /> },
  ]},
  { path: "*", element: <PageNotFound /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);