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
import { useCalculadoraLiquidacion } from "../hooks/useCalculadoraLiquidacion";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;

export default function CalculadoraLiquidacion() {
  const [form] = Form.useForm();
  const { resultado, error, calcular, setResultado } = useCalculadoraLiquidacion();

  const onFinish = (values: any) => {
    calcular({
      ...values,
      diasVacaciones: values.diasVacaciones || 0,
    });
  };

  const handleClear = () => {
    form.resetFields();
    setResultado(null);
  };

  return (
    <Row gutter={[32, 32]}>
      <Col xs={24} md={10}>
        <Card title="Calculadora de Liquidación">
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
              label="Fecha de Inicio"
              name="fechaInicio"
              rules={[{ required: true, message: "Por favor, ingrese la fecha de inicio." }]}
            >
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item
              label="Fecha de Fin"
              name="fechaFin"
              rules={[{ required: true, message: "Por favor, ingrese la fecha de fin." }]}
            >
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item
              label="Días de Vacaciones Pendientes"
              name="diasVacaciones"
              initialValue={0}
              rules={[{ required: true, message: "Ingrese los días de vacaciones pendientes." }]}
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
                Total a Recibir:
              </Title>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <Statistic
                  value={resultado.total}
                  precision={2}
                  prefix="C$"
                  valueStyle={{ fontSize: '2.5rem', color: '#1677ff' }}
                />
              </div>

              <Divider>Desglose</Divider>

              <Row gutter={16}>
                <Col span={8}>
                  <Statistic
                    title="Indemnización"
                    value={resultado.indemnizacion}
                    precision={2}
                    prefix="C$"
                  />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    ({resultado.aniosServicio.toFixed(2)} años de servicio)
                  </Text>
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Vacaciones"
                    value={resultado.vacaciones}
                    precision={2}
                    prefix="C$"
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Aguinaldo Proporcional"
                    value={resultado.aguinaldo}
                    precision={2}
                    prefix="C$"
                  />
                   <Text type="secondary" style={{ fontSize: 12 }}>
                    ({resultado.mesesParaAguinaldo.toFixed(2)} meses)
                  </Text>
                </Col>
              </Row>
              <Divider />
              <Paragraph type="secondary" style={{ fontSize: 12, textAlign: 'center' }}>
                Este es un cálculo estimado basado en el Art. 45 del Código del Trabajo (Indemnización por antigüedad) y la Ley del 13er Mes. No constituye asesoría legal.
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
