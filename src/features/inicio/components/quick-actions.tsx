// src/features/inicio/components/QuickActions.tsx
import { Row, Col, Card, Typography } from "antd";
import { DownloadOutlined, FileSearchOutlined } from "@ant-design/icons";
const { Title, Text } = Typography;

export default function QuickActions() {
  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} sm={12} md={8}>
        <Card hoverable bordered={false} className="shadow text-center p-3">
          <FileSearchOutlined style={{ fontSize: 36, color: "#1E3A8A" }} />
          <Title level={4}>Consultas Legales</Title>
          <Text>Gestiona y responde consultas laborales.</Text>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8}>
        <Card hoverable bordered={false} className="shadow text-center p-3">
          <DownloadOutlined style={{ fontSize: 36, color: "#1E3A8A" }} />
          <Title level={4}>Recursos Descargables</Title>
          <Text>Acceso a leyes, jurisprudencia y documentos útiles.</Text>
        </Card>
      </Col>
    </Row>
  );
}
