export type Estado = "Nuevo" | "En análisis" | "En revisión" | "Cerrado";
export type Prioridad = "Baja" | "Media" | "Alta";

export interface Caso {
  id: string;
  asunto: string;
  categoria: string;
  cliente: string;
  fecha: string;
  prioridad: Prioridad;
  estado: Estado;
  asignado?: string;
  sla?: string;
}

export const ESTADO_COLOR: Record<Estado, string> = {
  "Nuevo": "blue",
  "En análisis": "gold",
  "En revisión": "purple",
  "Cerrado": "green",
};
