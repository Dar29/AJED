import { useState } from 'react';
import dayjs from 'dayjs';

export interface ICalculoVacacionesParams {
  salarioMensual: number;
  fechaInicio: dayjs.Dayjs;
  fechaFin: dayjs.Dayjs;
}

export interface IResultadoVacaciones {
  mesesTrabajados: number;
  diasAcumulados: number;
  pagoVacaciones: number;
}

// Según el Art. 82 del Código del Trabajo de Nicaragua, se acumulan 2.5 días por mes.
const DIAS_VACACIONES_POR_MES = 2.5;

export const useCalculadoraVacaciones = () => {
  const [resultado, setResultado] = useState<IResultadoVacaciones | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calcularVacaciones = ({ salarioMensual, fechaInicio, fechaFin }: ICalculoVacacionesParams) => {
    if (!salarioMensual || !fechaInicio || !fechaFin) {
      setError("Todos los campos son obligatorios.");
      setResultado(null);
      return;
    }
    if (salarioMensual <= 0) {
      setError("El salario debe ser un número positivo.");
      setResultado(null);
      return;
    }
    if (fechaFin.isBefore(fechaInicio)) {
      setError("La fecha de fin no puede ser anterior a la fecha de inicio.");
      setResultado(null);
      return;
    }

    const mesesTrabajados = fechaFin.diff(fechaInicio, 'month', true);
    const diasAcumulados = mesesTrabajados * DIAS_VACACIONES_POR_MES;
    const salarioDiario = salarioMensual / 30;
    const pagoVacaciones = salarioDiario * diasAcumulados;

    setError(null);
    setResultado({
      mesesTrabajados,
      diasAcumulados,
      pagoVacaciones,
    });
  };

  return { resultado, error, calcularVacaciones, setResultado };
};
