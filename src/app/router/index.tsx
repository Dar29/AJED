import { createBrowserRouter } from "react-router-dom";
import AppLayout from "@/app/layout/AppLayout";
import Inicio from "@/pages/Inicio";
import Consultas from "@/pages/Consultas";
import Recursos from "@/pages/Recursos";

export const router = createBrowserRouter([
  {
    element: <AppLayout />, // ← Layout global
    children: [
      { path: "/", element: <Inicio /> },
      { path: "/consultas", element: <Consultas /> },
      { path: "/recursos", element: <Recursos /> },
    ],
  },
]);
