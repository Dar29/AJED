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
  CopyOutlined,
  FileWordOutlined,
  ExclamationCircleOutlined,
  BookOutlined,
} from "@ant-design/icons";
import type { AIResult } from "../hooks/useAIAnalysis";
import { useState } from "react";
import DemandaForm from "./demanda-form";

const { Title, Text, Paragraph } = Typography;

export default function AIAnalysisPanel({
  loading,
  error,
  result,
  onRegenerate,
}: {
  loading: boolean;
  error: string | null;
  result: AIResult | null;
  onRegenerate: () => void;
}) {
  const [isDemandaModalVisible, setIsDemandaModalVisible] = useState(false);

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

  const handleGenerarDemanda = async (values: any) => {
    setIsDemandaModalVisible(false);

    const key = "generating-demanda";

    message.loading({ content: "Generando documento con IA...", key });

    const url = "http://localhost:8000/api/generar-demanda-v2";

    const dataToSend = {
      caso_descripcion: values.caso_descripcion,
      demandante_nombre: values.demandante_nombre,
      demandante_cedula: values.demandante_cedula,
      demandado_nombre: values.demandado_nombre,
      demandado_domicilio: values.demandado_domicilio,
      monto_total: String(values.monto_total) + " C$",
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error del servidor:", errorData.detail);
        throw new Error(
          `¡Error HTTP! estado: ${response.status} - ${errorData.detail}`
        );
      }

      const blob = await response.blob();

      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = downloadUrl;
      a.download = "demanda_generada_v2.docx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
      message.success({ content: "Documento generado y descargado.", key });
    } catch (error: any) {
      console.error("Hubo un problema con la operación fetch:", error);

      message.error({
        content: `No se pudo generar el documento. Revise la consola para más detalles. Error: ${error.message}`,
        key,
      });
    }
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
    a.download = "Respuesta.doc";
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
              Exportar Análisis
            </Button>
            <Button
              type="primary"
              icon={<FileWordOutlined />}
              onClick={() => setIsDemandaModalVisible(true)}
              disabled={!result}
            >
              Generar Demanda
            </Button>
          </Space>
        </Space>
      )}

      <DemandaForm
        visible={isDemandaModalVisible}
        onSubmit={handleGenerarDemanda}
        onCancel={() => setIsDemandaModalVisible(false)}
        aiResult={result}
      />
    </Card>
  );
}
