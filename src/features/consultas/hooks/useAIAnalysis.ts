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
      // 1. Construir un prompt detallado para enviar al backend
      const prompt = `
        Por favor, actúa como un asistente legal experto en la legislación de Nicaragua.
        Analiza el siguiente caso y proporciona un resumen y los pasos a seguir.

        **Categoría del caso:** ${payload.categoria}
        **Asunto:** ${payload.asunto}
        **Resumen de los hechos:** ${payload.resumen}
        **Prioridad:** ${payload.prioridad || "No especificada"}
      `;

      const url = "http://127.0.0.1:8000/api/analyze";
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }), // El backend espera un objeto { "prompt": "..." }
      };

      console.log("Realizando petición a:", url, options);

      // 2. Llamar al endpoint del backend
      const response = await fetch(url, options);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Ocurrió un error en el servidor.");
      }

      const data = await response.json(); // El backend ahora devuelve el objeto AIResult directamente.
      console.log("Datos recibidos del backend:", data); // <-- DEBUGGING LINE
      // 3. El resultado del backend ya coincide con el tipo AIResult. Lo asignamos directamente.
      setResult(data as AIResult);

    } catch (e) {
      const message = e instanceof Error ? e.message : "No se pudo completar el análisis.";
      setError(message);
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
