import { Space } from "antd";
import HeaderBar from "./components/header-bar";
import CalculadoraLiquidacion from "./components/calculadora-liquidacion";

export default function CalculadoraContainer() {
  return (
    <Space
      direction="vertical"
      size="large"
      className="w-full"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <HeaderBar />
      <div style={{ padding: "0 24px" }}>
        <CalculadoraLiquidacion />
      </div>
    </Space>
  );
}
