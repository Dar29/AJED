import { Layout, ConfigProvider, theme } from "antd";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const { Content, Footer } = Layout;

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: { colorPrimary: "#1f497d", borderRadius: 8 },
        components: {
          Layout: { siderBg: "#0b1e30", headerBg: "#fff" },
          Menu: {
            darkItemBg: "#0b1e30",
            darkItemSelectedBg: "#15304a",
            darkItemColor: "#dbeafe",
            darkItemSelectedColor: "#ffffff",
            darkSubMenuItemBg: "#0b1e30",
          },
        },
      }}
    >
      <Layout style={{ height: "100vh", overflow: "hidden" }}>
        <Sidebar collapsed={collapsed} />

        <Layout
          style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header fijo arriba */}
          <div style={{ position: "sticky", top: 0, zIndex: 10 }}>
            <Navbar
              onToggleSidebar={() => setCollapsed((c) => !c)}
              collapsed={collapsed}
            />
          </div>

          <Content
            style={{
              padding: 16,
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: 16,
                borderRadius: 8, // ELIMINA ESTA LÍNEA: height: "100%", // <-- ¡QUITAR!
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
