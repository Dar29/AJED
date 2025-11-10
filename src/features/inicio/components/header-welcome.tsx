// src/features/inicio/components/HeaderWelcome.tsx
import { Card, Row, Col, Typography, Button } from "antd";
const { Title, Text } = Typography;

export default function HeaderWelcome({
  title,
  subtitle,
  ctaLabel,
  onCta,
}: {
  title: string;
  subtitle: string;
  ctaLabel: string;
  onCta: () => void;
}) {
  return (
    <Card className="mb-0 bg-white shadow-sm border border-gray-200">
      <Row align="middle" justify="space-between">
        <Col>
          <Title level={3} className="text-blue-800 mb-0">
            {title}
          </Title>
          <Text type="secondary">{subtitle}</Text>
        </Col>
        <Col>
          <Button type="primary" size="large" onClick={onCta}>
            {ctaLabel}
          </Button>
        </Col>
      </Row>
    </Card>
  );
}
