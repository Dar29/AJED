import { Card, Col, Row, Typography } from "antd";

const { Title, Text } = Typography;

export default function HeaderBar() {
  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <Row align="middle" justify="space-between">
        <Col>
          <Title level={3} className="text-blue-800 mb-0">
            Calculadoras Laborales
          </Title>
          <Text type="secondary">
            Realiza cálculos de liquidación, horas extras y más según la ley de Nicaragua.
          </Text>
        </Col>
      </Row>
    </Card>
  );
}
