// src/features/consultas/ConsultasContainer.tsx
import { Row, Col, Space } from "antd";
import { useNavigate } from "react-router-dom";
import useConsultas from "./hooks/useConsultas";
import HeaderBar from "./components/header-bar";
import ConsultaForm from "./components/consulta-form";
import AIAnalysisPanel from "./components/AI-analysis-panel";
import useAIAnalysis from "./hooks/useAIAnalysis";
import AIClarifyChat from "./components/AI-clarify-chat";

export default function ConsultasContainer() {
  const { setDetalle, crearCaso, form } = useConsultas();

  const ai = useAIAnalysis();
  const navigate = useNavigate();

  const handleNuevaConsulta = () => {
    form.resetFields();
    ai.reset();
    setDetalle(null);
    navigate("/consultas");
  };

  return (
    <Space
      direction="vertical"
      size="large"
      className="w-full"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <HeaderBar onNueva={handleNuevaConsulta} />

      {/* FILA PRINCIPAL: Form (izq) + Asistente/Chat (der) */}
      <Row gutter={[24, 24]} align="top">
        {/* IZQUIERDA: Formulario de Consulta */}
        <Col xs={24} md={10} lg={10}>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <ConsultaForm
              form={form}
              onSubmit={(values) => {
                crearCaso(values);
                ai.start(values); // dispara la IA (mock por ahora)
              }}
            />
            {ai.result && <AIClarifyChat context={ai.result} />}
          </div>
        </Col>

        {/* DERECHA: Asistente + Chat (apilados) */}
        <Col xs={24} md={14} lg={14}>
          <AIAnalysisPanel
            loading={ai.loading}
            error={ai.error}
            result={ai.result}
            onRegenerate={() => ai.start(form.getFieldsValue())}
          />
        </Col>
      </Row>
    </Space>
  );
}
