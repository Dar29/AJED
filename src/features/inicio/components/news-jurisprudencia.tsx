// src/features/inicio/components/NewsJurisprudencia.tsx
import { Card, Row, Col, Typography, Tag } from "antd";
import { ReadOutlined } from "@ant-design/icons";
const { Title, Text, Paragraph } = Typography;

export default function NewsJurisprudencia({
  noticias,
}: {
  noticias: { titulo: string; fecha: string; resumen: string }[];
}) {
  return (
    <Card
      title={
        <div className="flex justify-between items-center">
          <span className="text-blue-800 font-semibold" style={{ marginRight: '8px' }}>
            Jurisprudencia y Noticias Laborales
          </span>
          <Tag color="blue">Actualizado</Tag>
        </div>
      }
      bordered={false}
      className="shadow-md"
    >
      <Row gutter={[16, 16]}>
        {noticias.map((n, index) => (
          <Col xs={24} md={8} key={index}>
            <Card hoverable bordered={false} className="h-full">
              <ReadOutlined style={{ fontSize: 28, color: "#1E3A8A" }} />
              <Title level={5} className="mt-2">
                {n.titulo}
              </Title>
              <Text type="secondary">{n.fecha}</Text>
              <Paragraph className="mt-2 text-sm">{n.resumen}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
}
