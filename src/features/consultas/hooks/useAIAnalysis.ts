import { useState } from "react";

export type JurisItem = {
  id: string;
  nombre: string;      // ej. Sala Civil - Sent. 123/2021
  extracto: string;    // holding/ratio breve
  anio?: string;
  tipo?: string;       // CSJ, Apelación, MITRAB, etc.
  enlace?: string;     // si luego tienes link
};

export type AIResult = {
  titulo: string;
  resumen: string;
  pasos: string[];
  categoria: string;
  riesgo: "Bajo" | "Medio" | "Alto";
  confianza: number; // 0-1
  referencias?: { titulo: string; url?: string }[];

  // 👇 NUEVO
  resolucion: {
    decision: string;        // “Procede reconocimiento parcial…”
    fundamento: string;      // racional breve
    probabilidad: number;    // 0-1
  };
  jurisprudencia: JurisItem[]; // lista de fallos/criterios usados
};

export default function useAIAnalysis() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ⚠️ Mock: reemplazar por tu endpoint luego
  const start = async (payload: {
    categoria: string;
    asunto: string;
    resumen: string;
    prioridad?: string;
    cliente?: string;
    fecha?: string;
  }) => {
    setError(null);
    setLoading(true);
    setResult(null);

    try {
      await new Promise((r) => setTimeout(r, 1200));

      const mock: AIResult = {
        titulo: `Propuesta inicial: ${payload.asunto || "Consulta"}`,
        resumen:
          "Con base en la categoría y hechos descritos, se sugiere documentar evidencias, revisar CT (NI) y considerar mediación previa.",
        pasos: [
          "Reunir contrato, planillas y marcaciones.",
          "Calcular diferencias (si aplica) y redactar minuta/carta.",
          "Citar lineamientos MITRAB y preparar mediación.",
        ],
        categoria: payload.categoria || "General",
        riesgo: "Medio",
        confianza: 0.78,
        referencias: [
          { titulo: "Código del Trabajo (NI)" },
          { titulo: "Guías MITRAB sobre mediación" },
        ],
        resolucion: {
          decision:
            "Procede el reconocimiento de horas extras y recargos por jornadas prolongadas, con base en evidencia documental y control de asistencia.",
          fundamento:
            "La línea jurisprudencial nacional ha establecido que la carga probatoria del empleador respecto al control horario es determinante; ante su deficiencia, prevalecen indicios razonables del trabajador.",
          probabilidad: 0.72,
        },
        jurisprudencia: [
          {
            id: "CSJ-123-2021",
            nombre: "CSJ – Sala Laboral, Sent. 123/2021",
            extracto:
              "Se confirma condena por horas extras al verificarse registros incompletos de asistencia y comunicaciones internas que evidencian labores fuera de jornada.",
            anio: "2021",
            tipo: "CSJ",
          },
          {
            id: "APL-045-2019",
            nombre: "Tribunal de Apelaciones, Sent. 045/2019",
            extracto:
              "Ante duda razonable y falta de control horario, se aplica principio de primacía de la realidad en favor del trabajador.",
            anio: "2019",
            tipo: "Apelación",
          },
        ],
      };

      setResult(mock);
    } catch (e) {
      setError("No se pudo completar el análisis.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setLoading(false);
  };

  return { loading, result, error, start, reset, setResult };
}
