// src/features/inicio/components/header-welcome.tsx
import { Typography } from "antd";
const { Title, Text } = Typography;

export default function HeaderWelcome({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div style={{ textAlign: "center", marginBottom: "16px" }}>
      <Title level={2} className="text-blue-900 mb-1">
        {title}
      </Title>
      <Text type="secondary" style={{ fontSize: "1.1rem" }}>
        {subtitle}
      </Text>
    </div>
  );
}
