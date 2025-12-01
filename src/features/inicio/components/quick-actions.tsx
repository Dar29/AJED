// src/features/inicio/components/QuickActions.tsx
import { Row, Col, Card, Typography } from "antd";
import { DownloadOutlined, FileSearchOutlined } from "@ant-design/icons";
// 1. Importar useNavigate de React Router
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export default function QuickActions() {
  // 2. Inicializar el hook de navegación
  const navigate = useNavigate();

  // 3. Crear funciones de manejo de clics
  const handleLegalConsultsClick = () => {
    // Redirecciona a la ruta '/consultas-legales'
    navigate("/consultas");
  };

  const handleResourcesClick = () => {
    // Redirecciona a la ruta '/recursos'
    navigate("/recursos");
  };

  return (
    <Row gutter={[24, 24]}>
      {/* Tarjeta de Consultas Legales */}
      <Col xs={24} sm={12} md={8}>
        <Card
          hoverable
          bordered={false}
          className="shadow text-center p-3"
          // 4. Agregar el evento onClick y la función
          onClick={handleLegalConsultsClick}
        >
          <FileSearchOutlined style={{ fontSize: 36, color: "#1E3A8A" }} />
          <Title level={4}>Consultas Legales</Title>
          <Text>Consultas laborales con apoyo del asistente.</Text>
        </Card>
      </Col>

      {/* Tarjeta de Recursos Descargables */}
      <Col xs={24} sm={12} md={8}>
        <Card
          hoverable
          bordered={false}
          className="shadow text-center p-3"
          // 4. Agregar el evento onClick y la función
          onClick={handleResourcesClick}
        >
          <DownloadOutlined style={{ fontSize: 36, color: "#1E3A8A" }} />
          <Title level={4}>Recursos Descargables</Title>
          <Text>Acceso a leyes, jurisprudencia y documentos útiles.</Text>
        </Card>
      </Col>
    </Row>
  );
}
