import { Modal, Form, Input, InputNumber } from "antd";
import type { AIResult } from "../hooks/useAIAnalysis";
import { useEffect } from "react";

const { TextArea } = Input;

interface DemandaFormProps {
  visible: boolean;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  aiResult: AIResult | null;
}

export default function DemandaForm({
  visible,
  onSubmit,
  onCancel,
  aiResult,
}: DemandaFormProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (aiResult) {
      const jurisprudenciaText = aiResult.jurisprudencia
        .map((j) => `${j.nombre}: ${j.extracto}`)
        .join("\n- ");

      form.setFieldsValue({
        caso_descripcion:
          `Resumen del caso: ${aiResult.resumen}\n\n` +
          `Posible resolución: ${aiResult.resolucion.decision}\n` +
          `Fundamento: ${aiResult.resolucion.fundamento}\n\n` +
          (jurisprudenciaText
            ? `Jurisprudencia relevante:\n- ${jurisprudenciaText}`
            : ""),
      });
    } else {
      form.resetFields();
    }
  }, [aiResult, form, visible]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values);
        form.resetFields(); // Reset fields after successful submission
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <Modal
      title="Generar Nueva Demanda"
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      width={800}
      okText="Generar Documento"
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical" name="demanda_form">
        <Form.Item
          name="demandante_nombre"
          label="Nombre del Demandante"
          rules={[{ required: true, message: "Este campo es requerido." }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="demandante_cedula"
          label="Cédula del Demandante"
          rules={[{ required: true, message: "Este campo es requerido." }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="demandado_nombre"
          label="Nombre del Demandado"
          rules={[{ required: true, message: "Este campo es requerido." }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="demandado_domicilio"
          label="Domicilio del Demandado"
          rules={[{ required: true, message: "Este campo es requerido." }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="caso_descripcion"
          label="Descripción del Caso"
          rules={[{ required: true, message: "Este campo es requerido." }]}
        >
          <TextArea rows={10} />
        </Form.Item>
        <Form.Item
          name="pretensiones"
          label="Pretensiones"
          rules={[{ required: true, message: "Este campo es requerido." }]}
        >
          <TextArea rows={3} />
        </Form.Item>
        <Form.Item
          name="monto_total"
          label="Monto Total Reclamado (C$)"
          rules={[{ required: true, message: "Este campo es requerido." }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
