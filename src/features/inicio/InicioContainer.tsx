import { Row, Col, Space, Button, Divider } from "antd";
import HeaderWelcome from "./components/header-welcome";
import QuickActions from "./components/quick-actions";
import NewsJurisprudencia from "./components/news-jurisprudencia";
import { useNavigate } from "react-router-dom";
import BannersCarrusel from "./components/banners-carrusel"; // Importar el carrusel

export default function InicioContainer() {
  const noticias = [
    {
      titulo: "Reforma del Código Laboral…",
      fecha: "Octubre 2025",
      resumen: "Análisis de las últimas modificaciones y su impacto.",
    },
    {
      titulo: "Corte Suprema falla en caso de subcontratación",
      fecha: "Septiembre 2025",
      resumen: "Implicaciones para empleadores y trabajadores.",
    },
    {
      titulo: "Nueva regulación sobre teletrabajo",
      fecha: "Agosto 2025",
      resumen: "Derechos y obligaciones en la modalidad a distancia.",
    },
  ];

  const navigate = useNavigate();

  const handleLegalConsultsClick = () => {
    navigate("/consultas");
  };

  return (
    <Space direction="vertical" size="small" className="w-full">
      <HeaderWelcome
        title="Bienvenido a la Plataforma Jurídica"
        subtitle="Su asistente especializado en Derecho Laboral de Nicaragua"
      />

      <BannersCarrusel />

      <div style={{ textAlign: "center", margin: "4px 0" }}>
        <Button type="primary" size="large" onClick={handleLegalConsultsClick}>
          Realizar una Nueva Consulta
        </Button>
      </div>

      <Divider />

      <Row gutter={[24, 24]} align="top">
        <Col xs={24} lg={16}>
          <NewsJurisprudencia noticias={noticias} />
        </Col>
        <Col xs={24} lg={8}>
          <QuickActions />
        </Col>
      </Row>
    </Space>
  );
}
