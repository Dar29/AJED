import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  FileTextOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";

const { Sider } = Layout;

export default function Sidebar({ collapsed }: { collapsed: boolean }) {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedKeys = useMemo(() => {
    const p = location.pathname;
    if (p.startsWith("/consultas")) return ["consultas"];
    if (p.startsWith("/recursos")) return ["recursos_descargables"];
    return ["inicio"];
  }, [location.pathname]);

  const items = [
    { key: "inicio", icon: <HomeOutlined />, label: "Inicio" },
    { key: "consultas", icon: <FileTextOutlined />, label: "Consultas" },
    {
      key: "recursos",
      icon: <DownloadOutlined />,
      label: "Recursos Descargables",
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      breakpoint="lg"
      collapsedWidth={80}
      width={240}
      style={{ borderRight: "1px solid #0d2a44" }}
      theme="dark"
    >
      {/* Marca del sidebar (evita logo roto si no existe) */}
      <div
        style={{
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          paddingInline: collapsed ? 0 : 16,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          color: "#dbeafe",
          fontWeight: 600,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        title="Asistente Jurídico"
      >
        {collapsed ? "AJ" : "Asistente Jurídico"}
      </div>

      <Menu
        mode="inline"
        selectedKeys={selectedKeys}
        items={items}
        onClick={({ key }) => {
          const map: Record<string, string> = {
            inicio: "/",
            consultas: "/consultas",
            recursos: "/recursos",
          };
          navigate(map[key] || "/");
        }}
        style={{ borderRight: 0, padding: 8 }}
        theme="dark"
      />
    </Sider>
  );
}
