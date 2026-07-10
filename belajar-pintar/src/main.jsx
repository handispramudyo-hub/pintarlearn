import React from "react";
import ReactDOM from "react-dom/client";
import {
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./utils/Contexts/AuthContext";
import "./App.css";

const queryClient = new QueryClient();

import AuthLayout from "./Pages/Auth/AuthLayout";
import AdminLayout from "./Pages/Admin/AdminLayout";
import ProtectedRoute from "./Pages/Admin/Components/ProtectedRoute";
import Login from "./Pages/Auth/Login/Login";
import Register from "./Pages/Auth/Register/Register";
import Dashboard from "./Pages/Admin/Dashboard/Dashboard";
import Kelas from "./Pages/Admin/Kelas/Kelas";
import KelasManagement from "./Pages/Admin/KelasManagement/KelasManagement";
import Dosen from "./Pages/Admin/Dosen/Dosen";
import Matakuliah from "./Pages/Admin/Matakuliah/Matakuliah";
import User from "./Pages/Admin/User/User";
import Pencapaian from "./Pages/Admin/Pencapaian/Pencapaian";
import Instruktur from "./Pages/Admin/Instruktur/Instruktur";
import Quiz from "./Pages/Admin/Quiz/Quiz";
import QuizTake from "./Pages/Admin/Quiz/QuizTake";
import Forum from "./Pages/Admin/Forum/Forum";
import ThreadDetail from "./Pages/Admin/Forum/ThreadDetail";
import PageNotFound from "./Pages/Error/PageNotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [{ index: true, element: <Login /> }],
  },
  {
    path: "/register",
    element: <AuthLayout />,
    children: [{ index: true, element: <Register /> }],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "kelas", element: <Kelas /> },
      { path: "kelola-kelas", element: <KelasManagement /> },
      { path: "dosen", element: <Dosen /> },
      { path: "matakuliah", element: <Matakuliah /> },
      { path: "user", element: <User /> },
      { path: "pencapaian", element: <Pencapaian /> },
      { path: "instruktur", element: <Instruktur /> },
      { path: "quiz", element: <Quiz /> },
      { path: "quiz/kerjakan/:id", element: <QuizTake /> },
      { path: "forum", element: <Forum /> },
      { path: "forum/thread/:id", element: <ThreadDetail /> },
    ],
  },
  { path: "*", element: <PageNotFound /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster position="top-right" />
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
