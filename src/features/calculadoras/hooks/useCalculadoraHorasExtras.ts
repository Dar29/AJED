import { useState } from 'react';

export interface ICalculoHorasExtrasParams {
  salarioMensual: number;
  cantidadHoras: number;
}

export interface IResultadoHorasExtras {
  salarioDiario: number;
  salarioPorHora: number;
  salarioHoraExtra: number;
  pagoTotal: number;
  advertencia: string | null;
}

// Se asume una jornada laboral de 8 horas diarias
const HORAS_JORNADA_DIARIA = 8;
// Límite semanal de horas extras según el Art. 68 del Código del Trabajo
const LIMITE_SEMANAL_HORAS_EXTRAS = 9;

export const useCalculadoraHorasExtras = () => {
  const [resultado, setResultado] = useState<IResultadoHorasExtras | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calcularHorasExtras = ({ salarioMensual, cantidadHoras }: ICalculoHorasExtrasParams) => {
    if (salarioMensual === undefined || cantidadHoras === undefined) {
      setError("Todos los campos son obligatorios.");
      setResultado(null);
      return;
    }
     if (salarioMensual <= 0 || cantidadHoras < 0) {
      setError("El salario y las horas deben ser números positivos.");
      setResultado(null);
      return;
    }

    const salarioDiario = salarioMensual / 30;
    const salarioPorHora = salarioDiario / HORAS_JORNADA_DIARIA;
    // Las horas extras se pagan al 100% de recargo (el doble)
    const salarioHoraExtra = salarioPorHora * 2;
    const pagoTotal = salarioHoraExtra * cantidadHoras;

    let advertencia = null;
    if (cantidadHoras > LIMITE_SEMANAL_HORAS_EXTRAS) {
        advertencia = `Advertencia: Las ${cantidadHoras} horas extras superan el límite legal de ${LIMITE_SEMANAL_HORAS_EXTRAS} horas por semana. El cálculo se ha realizado, pero esto podría infringir el Código del Trabajo.`;
    }

    setError(null);
    setResultado({
      salarioDiario,
      salarioPorHora,
      salarioHoraExtra,
      pagoTotal,
      advertencia,
    });
  };

  return { resultado, error, calcularHorasExtras, setResultado };
};
