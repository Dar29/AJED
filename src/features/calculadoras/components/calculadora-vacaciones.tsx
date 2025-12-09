import {
  Card,
  Form,
  InputNumber,
  DatePicker,
  Button,
  Row,
  Col,
  Statistic,
  Alert,
  Divider,
  Typography,
} from "antd";
import { useCalculadoraVacaciones } from "../hooks/useCalculadoraVacaciones";

const { Title, Text, Paragraph } = Typography;

export default function CalculadoraVacaciones() {
  const [form] = Form.useForm();
  const { resultado, error, calcularVacaciones, setResultado } = useCalculadoraVacaciones();

  const onFinish = (values: any) => {
    calcularVacaciones(values);
  };

  const handleClear = () => {
    form.resetFields();
    setResultado(null);
  };

  return (
    <Row gutter={[32, 32]}>
      <Col xs={24} md={10}>
        <Card title="Calculadora de Vacaciones Proporcionales">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Salario Mensual (C$)"
              name="salarioMensual"
              rules={[{ required: true, message: "Por favor, ingrese el salario." }]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                addonBefore="C$"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Form.Item>
            <Form.Item
              label="Fecha de Inicio del Período"
              name="fechaInicio"
              rules={[{ required: true, message: "Por favor, ingrese la fecha de inicio." }]}
            >
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item
              label="Fecha de Fin del Período"
              name="fechaFin"
              rules={[{ required: true, message: "Por favor, ingrese la fecha de fin." }]}
            >
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>
            
            {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 24 }} />}

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                Calcular
              </Button>
              <Button onClick={handleClear}>Limpiar</Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
      <Col xs={24} md={14}>
        <Card title="Resultado del Cálculo">
          {resultado ? (
            <div>
              <Title level={3} style={{ textAlign: "center", color: '#1677ff' }}>
                Total a Recibir por Vacaciones:
              </Title>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <Statistic
                  value={resultado.pagoVacaciones}
                  precision={2}
                  prefix="C$"
                  valueStyle={{ fontSize: '2.5rem', color: '#1677ff' }}
                />
              </div>

              <Divider>Desglose</Divider>

              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Meses Trabajados"
                    value={resultado.mesesTrabajados}
                    precision={2}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Días de Vacaciones Acumulados"
                    value={resultado.diasAcumulados}
                    precision={2}
                  />
                </Col>
              </Row>
              <Divider />
              <Paragraph type="secondary" style={{ fontSize: 12, textAlign: 'center' }}>
                Este es un cálculo estimado basado en el Art. 82 del Código del Trabajo (2.5 días por mes trabajado). No constituye asesoría legal.
              </Paragraph>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <Text type="secondary">Ingrese los datos en el formulario para ver el resultado.</Text>
            </div>
          )}
        </Card>
      </Col>
    </Row>
  );
}