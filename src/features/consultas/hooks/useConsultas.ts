// src/features/consultas/hooks/useConsultas.ts
import { useMemo, useState } from "react";
import { Form } from "antd";
import type { Estado, Caso } from "../types";

export default function useConsultas() {
  const [form] = Form.useForm();
  const [filtroEstado, setFiltroEstado] = useState<Estado | "Todos">("Todos");
  const [detalle, setDetalle] = useState<Caso | null>(null);

  const data: Caso[] = useMemo(() => [
    { id:"C-2025-001", asunto:"Pago de horas extras…", categoria:"Horas extras / Remuneración", cliente:"Carlos Pérez", fecha:"2025-10-15", prioridad:"Alta", estado:"En análisis", asignado:"L. Jiménez", sla:"24h" },
    { id:"C-2025-002", asunto:"Terminación de contrato…", categoria:"Despido / Terminación", cliente:"Distribuidora El Triunfo", fecha:"2025-10-12", prioridad:"Media", estado:"En revisión", asignado:"M. Gutiérrez", sla:"48h" },
    { id:"C-2025-003", asunto:"Solicitud de vacaciones…", categoria:"Vacaciones / Permisos", cliente:"Ana López", fecha:"2025-10-10", prioridad:"Baja", estado:"Nuevo", sla:"72h" },
  ], []);

  const filtered = useMemo(
    () => (filtroEstado === "Todos" ? data : data.filter(d => d.estado === filtroEstado)),
    [data, filtroEstado]
  );

  const crearCaso = async (values: any) => {
    // llamada a API si aplica
    form.resetFields();
  };

  return { filtroEstado, setFiltroEstado, data, filtered, detalle, setDetalle, crearCaso, form };
}
