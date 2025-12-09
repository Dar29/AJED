import { Segmented, Space } from "antd";
import HeaderBar from "./components/header-bar";
import CalculadoraLiquidacion from "./components/calculadora-liquidacion";
import { useState } from "react";
import CalculadoraVacaciones from "./components/calculadora-vacaciones";
import CalculadoraHorasExtras from "./components/calculadora-horas-extras";

const CALCULATOR_TYPES = {
  LIQUIDACION: "Liquidación",
  VACACIONES: "Vacaciones",
  HORAS_EXTRAS: "Horas Extras",
};

export default function CalculadorasContainer() {
  const [calculatorType, setCalculatorType] = useState(
    CALCULATOR_TYPES.LIQUIDACION
  );

  const renderCalculator = () => {
    switch (calculatorType) {
      case CALCULATOR_TYPES.LIQUIDACION:
        return <CalculadoraLiquidacion />;
      case CALCULATOR_TYPES.VACACIONES:
        return <CalculadoraVacaciones />;
      case CALCULATOR_TYPES.HORAS_EXTRAS:
        return <CalculadoraHorasExtras />;
      default:
        return <CalculadoraLiquidacion />;
    }
  };

  return (
    <Space
      direction="vertical"
      size="large"
      className="w-full"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <HeaderBar />
      <div style={{ padding: "0 24px" }}>
        <Segmented
          options={[
            CALCULATOR_TYPES.LIQUIDACION,
            CALCULATOR_TYPES.VACACIONES,
            CALCULATOR_TYPES.HORAS_EXTRAS,
          ]}
          value={calculatorType}
          onChange={(value) => setCalculatorType(value)}
          size="large"
          block
        />
      </div>
      <div style={{ padding: "0 24px" }}>{renderCalculator()}</div>
    </Space>
  );
}
