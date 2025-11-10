import {
  Layout,
  Input,
  Space,
  Badge,
  Dropdown,
  Avatar,
  Typography,
  Button,
} from "antd";
import type { MenuProps } from "antd";
import {
  BellOutlined,
  UserOutlined,
  SearchOutlined,
  LogoutOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

const { Header } = Layout;
const { Text } = Typography;

type Props = {
  onToggleSidebar?: () => void;
  collapsed?: boolean;
};

const menuItems: MenuProps["items"] = [
  { key: "settings", label: "Configuración", icon: <SettingOutlined /> },
  { type: "divider" },
  {
    key: "logout",
    label: "Cerrar sesión",
    icon: <LogoutOutlined />,
    danger: true,
  },
];

export default function Navbar({ onToggleSidebar, collapsed }: Props) {
  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        flexShrink: 0,
        overflow: "hidden",
        background: "#fff",
        height: 56,
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #f0f0f0",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
      }}
    >
      <Space align="center">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggleSidebar}
          style={{ fontSize: 18 }}
        />
        <Text style={{ color: "#667085" }}>Asistente Jurídico</Text>
      </Space>

      {/* Centro: búsqueda (responsiva) */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          paddingInline: 16,
        }}
      >
        <Input
          placeholder="Buscar…"
          prefix={<SearchOutlined style={{ color: "#aaa" }} />}
          style={{ width: "100%", maxWidth: 520, borderRadius: 6 }}
          allowClear
        />
      </div>
    </Header>
  );
}
