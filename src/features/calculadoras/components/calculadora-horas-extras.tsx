import {
  Card,
  Form,
  InputNumber,
  Button,
  Row,
  Col,
  Statistic,
  Alert,
  Divider,
  Typography,
} from "antd";
import { useCalculadoraHorasExtras } from "../hooks/useCalculadoraHorasExtras";

const { Title, Text, Paragraph } = Typography;

export default function CalculadoraHorasExtras() {
  const [form] = Form.useForm();
  const { resultado, error, calcularHorasExtras, setResultado } = useCalculadoraHorasExtras();

  const onFinish = (values: any) => {
    calcularHorasExtras(values);
  };

  const handleClear = () => {
    form.resetFields();
    setResultado(null);
  };

  return (
    <Row gutter={[32, 32]}>
      <Col xs={24} md={10}>
        <Card title="Calculadora de Horas Extras">
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
              label="Cantidad de Horas Extras"
              name="cantidadHoras"
              rules={[{ required: true, message: "Por favor, ingrese las horas." }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
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
                Total a Recibir por Horas Extras:
              </Title>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <Statistic
                  value={resultado.pagoTotal}
                  precision={2}
                  prefix="C$"
                  valueStyle={{ fontSize: '2.5rem', color: '#1677ff' }}
                />
              </div>

              <Divider>Desglose</Divider>

              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Salario por Hora Normal"
                    value={resultado.salarioPorHora}
                    precision={2}
                    prefix="C$"
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Salario por Hora Extra (Doble)"
                    value={resultado.salarioHoraExtra}
                    precision={2}
                    prefix="C$"
                  />
                </Col>
              </Row>
              
              {resultado.advertencia && (
                  <Alert message={resultado.advertencia} type="warning" showIcon style={{ marginTop: 24 }} />
              )}

              <Divider />
              <Paragraph type="secondary" style={{ fontSize: 12, textAlign: 'center' }}>
                Este es un cálculo estimado basado en el recargo del 100% para horas extras. No constituye asesoría legal.
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