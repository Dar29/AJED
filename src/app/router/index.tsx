import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import Inicio from "../../pages/Inicio";
import Consultas from "../../pages/Consultas";
import Recursos from "../../pages/Recursos";
import Calculadoras from "../../pages/Calculadora";

export const router = createBrowserRouter([
  {
    element: <AppLayout />, // ← Layout global
    children: [
      { path: "/", element: <Inicio /> },
      { path: "/consultas", element: <Consultas /> },
      { path: "/recursos", element: <Recursos /> },
      { path: "/calculadoras", element: <Calculadoras /> },
    ],
  },
]);
