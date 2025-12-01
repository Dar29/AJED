import { Space } from "antd";
import HeaderWelcome from "./components/header-welcome";
import QuickActions from "./components/quick-actions";
import NewsJurisprudencia from "./components/news-jurisprudencia";
import { useNavigate } from "react-router-dom";

export default function InicioContainer() {
  const noticias = [
    {
      titulo: "Reforma del Código Laboral…",
      fecha: "Octubre 2025",
      resumen: "…",
    },
    { titulo: "Corte Suprema…", fecha: "Septiembre 2025", resumen: "…" },
    { titulo: "Mediación obligatoria…", fecha: "Agosto 2025", resumen: "…" },
  ];

  const navigate = useNavigate();

  // 3. Crear funciones de manejo de clics
  const handleLegalConsultsClick = () => {
    // Redirecciona a la ruta '/consultas-legales'
    navigate("/consultas");
  };

  return (
    <Space direction="vertical" size="large" className="w-full">
      <HeaderWelcome
        title="⚖️ Bienvenido/a"
        subtitle="Plataforma especializada en Derecho Laboral de Nicaragua"
        ctaLabel="Nueva Consulta"
        onCta={() => {
          handleLegalConsultsClick();
        }}
      />
      <QuickActions /> {/* 3 tarjetas: Consultas, Usuarios, Ajustes */}
      <NewsJurisprudencia noticias={noticias} /> {/* tarjetas de noticias */}
    </Space>
  );
}
