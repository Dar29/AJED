import { useState } from "react";
import { Card, Input, Button, List, Avatar, Space, Typography } from "antd";
import { SendOutlined, RobotOutlined, UserOutlined } from "@ant-design/icons";
import type { AIResult } from "../hooks/useAIAnalysis";

const { Text } = Typography;

type Msg = { role: "user" | "assistant"; content: string };

export default function AIClarifyChat({
  context,
}: {
  context: AIResult | null;
}) {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "¿Tienes dudas sobre la propuesta o la jurisprudencia aplicada? Puedo aclararlas.",
    },
  ]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!text.trim() || !context) return;
    const q = text.trim();
    setMsgs((prev) => [...prev, { role: "user", content: q }]);
    setText("");
    setSending(true);

    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: q,
          context: context,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al conectar con el asistente. Inténtalo de nuevo.");
      }

      const result = await response.json();
      setMsgs((prev) => [...prev, { role: "assistant", content: result.answer }]);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Error desconocido.";
      setMsgs((prev) => [...prev, { role: "assistant", content: `Error: ${errorMsg}` }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <Card
      className="shadow-md"
      title={
        <span className="text-blue-800 font-semibold">
          Aclaraciones sobre esta respuesta
        </span>
      }
    >
      <List
        dataSource={msgs}
        renderItem={(m, i) => (
          <List.Item key={i}>
            <List.Item.Meta
              avatar={
                m.role === "assistant" ? (
                  <Avatar icon={<RobotOutlined />} />
                ) : (
                  <Avatar icon={<UserOutlined />} />
                )
              }
              title={
                <Text type="secondary">
                  {m.role === "assistant" ? "Asistente" : "Tú"}
                </Text>
              }
              description={
                <div style={{ whiteSpace: "pre-wrap" }}>{m.content}</div>
              }
            />
          </List.Item>
        )}
        style={{ maxHeight: 260, overflowY: "auto", paddingRight: 8 }}
      />

      <Space.Compact style={{ width: "100%", marginTop: 8 }}>
        <Input.TextArea
          autoSize={{ minRows: 1, maxRows: 3 }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe tu pregunta aquí…"
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={send}
          loading={sending}
        >
          Enviar
        </Button>
      </Space.Compact>
    </Card>
  );
}
