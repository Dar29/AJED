import { Card, Col, Row, Typography } from "antd";

const { Title, Text } = Typography;

export default function HeaderBar() {
  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <Row align="middle" justify="space-between">
        <Col>
          <Title level={3} className="text-blue-800 mb-0">
            Recursos Descargables
          </Title>
          <Text type="secondary">
            Accede a leyes, jurisprudencia y documentos útiles para tu práctica
            legal.
          </Text>
        </Col>
      </Row>
    </Card>
  );
}
