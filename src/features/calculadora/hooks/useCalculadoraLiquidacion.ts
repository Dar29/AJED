import { useState } from 'react';
import dayjs from 'dayjs';

export interface ICalculoParams {
  salarioMensual: number;
  fechaInicio: dayjs.Dayjs;
  fechaFin: dayjs.Dayjs;
  diasVacaciones: number;
}

export interface IResultadoLiquidacion {
  indemnizacion: number;
  vacaciones: number;
  aguinaldo: number;
  total: number;
  aniosServicio: number;
  mesesParaAguinaldo: number;
}

export const useCalculadoraLiquidacion = () => {
  const [resultado, setResultado] = useState<IResultadoLiquidacion | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calcular = ({ salarioMensual, fechaInicio, fechaFin, diasVacaciones }: ICalculoParams) => {
    if (!salarioMensual || !fechaInicio || !fechaFin || diasVacaciones === undefined || diasVacaciones === null) {
      setError("Todos los campos son obligatorios.");
      setResultado(null);
      return;
    }
     if (salarioMensual <= 0) {
      setError("El salario debe ser un número positivo.");
      setResultado(null);
      return;
    }
     if (diasVacaciones < 0) {
        setError("Los días de vacaciones no pueden ser negativos.");
        setResultado(null);
        return;
      }

    if (fechaFin.isBefore(fechaInicio)) {
      setError("La fecha de fin no puede ser anterior a la fecha de inicio.");
      setResultado(null);
      return;
    }

    const salarioDiario = salarioMensual / 30;
    const aniosServicio = fechaFin.diff(fechaInicio, 'year', true);

    // 1. Indemnización por Antigüedad (Art. 45 CT)
    // 1 mes por los primeros 3 años, 20 días por los siguientes. Tope: 5 meses.
    let mesesDeSalarioIndemnizacion = 0;
    if (aniosServicio <= 3) {
      mesesDeSalarioIndemnizacion = aniosServicio; // Proporcional a los años
    } else {
      const aniosAdicionales = aniosServicio - 3;
      mesesDeSalarioIndemnizacion = 3 + (aniosAdicionales * 20 / 30);
    }
    
    if (mesesDeSalarioIndemnizacion > 5) {
      mesesDeSalarioIndemnizacion = 5;
    }
    const indemnizacion = mesesDeSalarioIndemnizacion * salarioMensual;


    // 2. Vacaciones (Art. 82 CT)
    const vacaciones = salarioDiario * diasVacaciones;

    // 3. Aguinaldo o 13er Mes (Ley 260)
    // Proporcional al tiempo trabajado desde el 1 de Diciembre del año anterior y la fecha de fin.
    let inicioPeriodoAguinaldo = dayjs(`${fechaFin.year() - 1}-12-01`);
    if (fechaInicio.isAfter(inicioPeriodoAguinaldo)) {
        inicioPeriodoAguinaldo = fechaInicio;
    }
    const mesesParaAguinaldo = fechaFin.diff(inicioPeriodoAguinaldo, 'month', true);
    const aguinaldo = (salarioMensual / 12) * mesesParaAguinaldo;

    const total = indemnizacion + vacaciones + aguinaldo;
    
    setError(null);
    setResultado({
      indemnizacion,
      vacaciones,
      aguinaldo,
      total,
      aniosServicio,
      mesesParaAguinaldo
    });
  };

  return { resultado, error, calcular, setResultado };
};
