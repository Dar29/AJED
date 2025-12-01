import { Button, Card, Col, Row, Space, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function HeaderBar({ onNueva }: { onNueva: () => void }) {
  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <Row align="middle" justify="space-between">
        <Col>
          <Title level={3} className="text-blue-800 mb-0">
            Consultas
          </Title>
          <Text type="secondary">
            Consultas laborales con apoyo del asistente.
          </Text>
        </Col>
        <Col>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={onNueva}>
              Nueva
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );
}
