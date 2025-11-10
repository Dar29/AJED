import { Space } from "antd";
import HeaderBar from "./components/header-bar";
export default function RecursosContainer() {
  return (
    <Space
      direction="vertical"
      size="large"
      className="w-full"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <HeaderBar />
    </Space>
  );
}
