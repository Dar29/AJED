import {
  Card,
  Typography,
  Tag,
  Space,
  Button,
  Skeleton,
  Flex,
  message,
  Alert,
  List,
} from "antd";
import {
  ReloadOutlined,
  CheckOutlined,
  CopyOutlined,
  FileWordOutlined,
  ExclamationCircleOutlined,
  BookOutlined,
  ScissorOutlined,
} from "@ant-design/icons";
import type { AIResult } from "../hooks/useAIAnalysis";

const { Title, Text, Paragraph } = Typography;

export default function AIAnalysisPanel({
  loading,
  error,
  result,
  onRegenerate,
  onAccept,
}: {
  loading: boolean;
  error: string | null;
  result: AIResult | null;
  onRegenerate: () => void;
  onAccept: () => void;
}) {
  const copy = async () => {
    if (!result) return;
    const txt =
      `${result.titulo}\n\n` +
      `Resumen: ${result.resumen}\n\n` +
      `Posible resolución: ${result.resolucion.decision}\nFundamento: ${
        result.resolucion.fundamento
      }\nProbabilidad: ${(result.resolucion.probabilidad * 100).toFixed(
        0
      )}%\n\n` +
      `Pasos:\n- ${result.pasos.join("\n- ")}\n\n` +
      `Jurisprudencia:\n- ${result.jurisprudencia
        .map((j) => `${j.nombre}: ${j.extracto}`)
        .join("\n- ")}`;
    await navigator.clipboard.writeText(txt);
    message.success("Copiado al portapapeles");
  };

  const exportWord = () => {
    if (!result) return;
    const blob = new Blob(
      [
        `Propuesta de Respuesta\n\n${result.titulo}\n\n` +
          `Resumen\n${result.resumen}\n\n` +
          `Posible resolución\n${result.resolucion.decision}\n\n` +
          `Fundamento\n${result.resolucion.fundamento}\n` +
          `Probabilidad: ${(result.resolucion.probabilidad * 100).toFixed(
            0
          )}%\n\n` +
          `Pasos sugeridos\n- ${result.pasos.join("\n- ")}\n\n` +
          `Jurisprudencia\n- ${result.jurisprudencia
            .map((j) => `${j.nombre} (${j.anio ?? ""}) – ${j.extracto}`)
            .join("\n- ")}\n`,
      ],
      { type: "application/msword" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "respuesta_rapida.doc";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card
      className="shadow-md"
      title={
        <span className="text-blue-800 font-semibold">
          Análisis del asistente
        </span>
      }
      extra={
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={onRegenerate}
            disabled={loading}
          >
            Regenerar
          </Button>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={onAccept}
            disabled={loading || !result}
          >
            Aceptar
          </Button>
        </Space>
      }
    >
      {loading && <Skeleton active paragraph={{ rows: 5 }} />}

      {!loading && error && (
        <Flex gap={8} align="center">
          <ExclamationCircleOutlined style={{ color: "#faad14" }} />
          <Text type="warning">{error}</Text>
        </Flex>
      )}

      {!loading && !error && result && (
        <Space direction="vertical" size="middle" className="w-full">
          <Title level={5} style={{ marginBottom: 0 }}>
            {result.titulo}
          </Title>

          <Space wrap>
            <Tag color="blue">Categoría: {result.categoria}</Tag>
            <Tag
              color={
                result.riesgo === "Alto"
                  ? "error"
                  : result.riesgo === "Medio"
                  ? "gold"
                  : "green"
              }
            >
              Riesgo: {result.riesgo}
            </Tag>
            <Tag color="purple">
              Confianza: {(result.confianza * 100).toFixed(0)}%
            </Tag>
          </Space>

          <Paragraph>{result.resumen}</Paragraph>

          {/* 🔹 Posible resolución */}
          <Alert
            type="success"
            showIcon
            message={<strong>Posible resolución</strong>}
            description={
              <div>
                <Paragraph style={{ marginBottom: 6 }}>
                  {result.resolucion.decision}
                </Paragraph>
                <Text type="secondary">
                  Fundamento: {result.resolucion.fundamento} — Probabilidad
                  estimada: {(result.resolucion.probabilidad * 100).toFixed(0)}%
                </Text>
              </div>
            }
          />

          <Title level={5} style={{ marginTop: 8 }}>
            Fundamento jurisprudencial
          </Title>
          <List
            itemLayout="vertical"
            dataSource={result.jurisprudencia}
            renderItem={(j) => (
              <List.Item
                key={j.id}
                actions={[
                  j.anio && (
                    <Tag key="anio" color="default">
                      {j.anio}
                    </Tag>
                  ),
                  j.tipo && (
                    <Tag key="tipo" icon={<BookOutlined />} color="blue">
                      {j.tipo}
                    </Tag>
                  ),
                ]}
              >
                <List.Item.Meta
                  title={<Text strong>{j.nombre}</Text>}
                  description={<Text type="secondary">{j.extracto}</Text>}
                />
                {j.enlace ? (
                  <a href={j.enlace} target="_blank" rel="noreferrer">
                    Ver documento
                  </a>
                ) : null}
              </List.Item>
            )}
          />

          <Title level={5}>Pasos sugeridos</Title>
          <ul style={{ marginLeft: 18 }}>
            {result.pasos.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>

          <Space style={{ marginTop: 8 }}>
            <Button icon={<CopyOutlined />} onClick={copy}>
              Copiar
            </Button>
            <Button icon={<FileWordOutlined />} onClick={exportWord}>
              Exportar Word
            </Button>
          </Space>
        </Space>
      )}
    </Card>
  );
}
