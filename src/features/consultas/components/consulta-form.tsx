import { InboxOutlined, FileSearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Upload,
} from "antd";
import type { FormInstance } from "antd/es/form";

const { Dragger } = Upload;
const { TextArea } = Input;

const CATEGORIAS = [
  "Despido / Terminación",
  "Horas extras / Remuneración",
  "Contrato de trabajo",
  "Vacaciones / Permisos",
  "INSS / Seguridad Social",
  "Acoso / Ambiente laboral",
  "Mediación / Conciliación",
  "Otros",
];

export default function ConsultaForm({
  form,
  onSubmit,
}: {
  form: FormInstance;
  onSubmit: (values: any) => void;
}) {
  return (
    <Card title="Nueva consulta (asistida)" className="shadow-md">
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          label="Categoría"
          name="categoria"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Selecciona la categoría"
            options={CATEGORIAS.map((c) => ({ label: c, value: c }))}
          />
        </Form.Item>

        <Form.Item label="Asunto" name="asunto" rules={[{ required: true }]}>
          <Input placeholder="Ej. Pago de horas extras no reconocidas" />
        </Form.Item>

        <Form.Item
          label="Resumen del caso"
          name="resumen"
          rules={[{ required: true }]}
        >
          <TextArea
            rows={4}
            placeholder="Describe los hechos relevantes y fechas"
          />
        </Form.Item>
        <Form.Item
          label="Documentos (opcional)"
          name="adjuntos"
          valuePropName="fileList"
        >
          <Dragger multiple maxCount={5} beforeUpload={() => false}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Arrastra o haz clic para subir</p>
            <p className="ant-upload-hint">
              PDF, imágenes u hojas de cálculo (máx. 5)
            </p>
          </Dragger>
        </Form.Item>

        <Space>
          <Button
            htmlType="submit"
            type="primary"
            icon={<FileSearchOutlined />}
          >
            Pre-analizar
          </Button>
          <Button htmlType="submit">Guardar borrador</Button>
        </Space>
      </Form>
    </Card>
  );
}
