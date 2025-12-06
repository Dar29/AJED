import { useState, useEffect } from "react";
import { Space, Button, Card, Upload, Typography } from "antd";
//import type { UploadProps } from "antd";
import HeaderBar from "./components/header-bar";
import { ExportOutlined, FilePdfOutlined, FileImageOutlined } from "@ant-design/icons";

const { Text } = Typography;

/*type Recurso = {
  label: string;
  url: string;
};*/

type Archivo = {
  label: string;
  url: string;
  tipo: "pdf" | "imagen";
};

export default function RecursosContainer() {
  const recursos = [
    {
      label: "Código del Trabajo",
      url: "http://legislacion.asamblea.gob.ni/Normaweb.nsf/%28$All%29/FA251B3C54F5BAEF062571C40055736C",
    },
    {
      label: "Ley Sanitaria",
      url: "http://legislacion.asamblea.gob.ni/normaweb.nsf/09cf45d6fc893868062572650059911e/b71e39f2823169e1062587f40057ad9f",
    },
    {
      label: "Ley de Protección de Datos Personales",
      url: "http://legislacion.asamblea.gob.ni/normaweb.nsf/9e314815a08d4a6206257265005d21f9/e5d37e9b4827fc06062579ed0076ce1d",
    },
    {
      label: "Ley de Personas con Discapacidad",
      url: "http://legislacion.asamblea.gob.ni/Normaweb.nsf/b92aaea87dac762406257265005d21f7/c9379d54ccde27400625791200572c84",
    },
  ];

  const handleRedirect = (url: string) => {
    window.open(url, "_blank");
  };

 const archivos: Archivo[] = [
    {
      label: "Código del Trabajo (PDF)",
      url: "/public/files_leyes/Ley185Nic-1.pdf",
      tipo: "pdf",
    },
    {
      label: "Ley Sanitaria (PDF)",
      url: "/public/files_leyes/Ley No.760.Ley de Carrera Sanitaria.pdf",
      tipo: "pdf",
    },
    {
      label: "Ley de Protección de Datos Personales (PDF)",
      url: "/public/files_leyes/Ley No.787-Ley-de-Proteccion-de-datos-personales.pdf",
      tipo: "pdf",
    },
    {
      label: "Ley de Personas con Discapacidad (PDF)",
      url: "/public/files_leyes/Ley No. 763.pdf",
      tipo: "pdf",
    },
    // Ejemplo si tuvieras una imagen:
    // {
    //   label: "Infografía de Derechos",
    //   url: "/docs/infografia-derechos.png",
    //   tipo: "imagen",
    // },
  ];

  const [archivoSeleccionado, setArchivoSeleccionado] = useState<Archivo | null>(
    null
  );

  const handleSelectArchivo = (archivo: Archivo) => {
    setArchivoSeleccionado(archivo);
  };

  return (
    <Space
      direction="vertical"
      size="large"
      className="w-full"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <HeaderBar />

      {/* Botones de leyes (redireccionan a páginas web) */}
      

      {/* Selector de archivos predefinidos */}
      <Card title="Documentos internos" style={{ margin: "0 24px" }}>
        <Space direction="vertical" size="middle">
          <Text>Selecciona un archivo para visualizarlo:</Text>

          <Space direction="horizontal" size="middle" wrap>
            {archivos.map((a) => (
              <Button
                key={a.label}
                onClick={() => handleSelectArchivo(a)}
                icon={
                  a.tipo === "pdf" ? <FilePdfOutlined /> : <FileImageOutlined />
                }
              >
                {a.label}
              </Button>
            ))}
          </Space>

          {archivoSeleccionado && (
            <Text type="secondary">
              Archivo seleccionado: <b>{archivoSeleccionado.label}</b>
            </Text>
          )}
        </Space>
      </Card>

      {/* Visor del archivo seleccionado */}
      {archivoSeleccionado && (
        <Card
          title="Visor de archivo"
          style={{ margin: "0 24px 24px" }}
          bodyStyle={{ padding: 0 }}
        >
          {archivoSeleccionado.tipo === "imagen" && (
            <img
              src={archivoSeleccionado.url}
              alt={archivoSeleccionado.label}
              style={{ maxWidth: "100%", maxHeight: 600, display: "block" }}
            />
          )}

          {archivoSeleccionado.tipo === "pdf" && (
            <iframe
              src={archivoSeleccionado.url}
              style={{ width: "100%", height: 600, border: "none" }}
              title={archivoSeleccionado.label}
            />
          )}
        </Card>
      )}
      <Space
        direction="horizontal"
        size="middle"
        wrap
        style={{ padding: "0 24px 24px" }}
      >
        {recursos.map((r) => (
          <Button
            key={r.label}
            type="primary"
            icon={<ExportOutlined />}
            onClick={() => handleRedirect(r.url)}
          >
            {r.label}
          </Button>
        ))}
      </Space>
    </Space>
  );
}