import { useRef } from "react";
import { Card, Carousel, Tag, Typography, Button } from "antd";
import type { CarouselRef } from "antd/es/carousel";

const { Title, Paragraph } = Typography;

/** Mantengo tus rutas tal cual */
const banners = [
  {
    src: "/src/features/inicio/assets/banner_01.png",
    titulo: "Jurisprudencia Laboral • Nicaragua",
    desc: "Coberturas y noticias recientes en materia de Derecho Laboral.",
  },
  {
    src: "/src/features/inicio/assets/banner_02.png",
    titulo: "Reformas y Regulaciones",
    desc: "Cambios normativos y lineamientos oficiales del MITRAB y Poder Judicial.",
  },
  {
    src: "/src/features/inicio/assets/banner_03.png",
    titulo: "Horas Extras y Remuneración",
    desc: "Criterios y fallos destacados sobre pago de jornadas y recargos.",
  },
  {
    src: "/src/features/inicio/assets/banner_04.png",
    titulo: "Mediación y Conciliación",
    desc: "Precedentes y buenas prácticas en resolución alternativa de conflictos.",
  },
];

/** Resolver rutas dentro de /src (Vite) */
const resolveSrc = (p: string) => new URL(p, import.meta.url).href;

export default function PortadaNoticias() {
  const ref = useRef<CarouselRef>(null);

  /** Altura responsiva del slide: ajusta a tu gusto */
  const SLIDE_HEIGHT = "clamp(180px, 22vw, 280px)";

  return (
    <Card
      className="shadow-md mb-8"
      bordered={false}
      title={
        <div className="flex justify-between items-center">
          <span className="text-blue-800 font-semibold">
            Portadas – Actualidad Laboral
          </span>
          <Tag color="blue">Auto</Tag>
        </div>
      }
      style={{ overflow: "hidden" }}
    >
      <div style={{ position: "relative" }}>
        {/* Mantén una altura mínima para que no “salte” al cargar */}
        <div style={{ minHeight: SLIDE_HEIGHT }}>
          <Carousel
            ref={ref}
            autoplay
            autoplaySpeed={5000}
            pauseOnHover
            effect="fade"
            dots
          >
            {banners.map((b, i) => (
              <div key={i}>
                {/* Contenedor con altura fija y bordes */}
                <div
                  style={{
                    height: SLIDE_HEIGHT,
                    width: "100%",
                    borderRadius: 12,
                    overflow: "hidden",
                    position: "relative",
                    background: "#EEF2FF",
                  }}
                >
                  {/* La imagen ocupa TODO el contenedor */}
                  <img
                    src={resolveSrc(b.src)}
                    alt={b.titulo}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />

                  {/* Capa de degradado + textos encima */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(0,0,0,.45), rgba(0,0,0,.15))",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      left: 24,
                      bottom: 20,
                      right: 24,
                      color: "white",
                      textShadow: "0 1px 2px rgba(0,0,0,.4)",
                    }}
                  >
                    <Title level={3} style={{ color: "white", margin: 0 }}>
                      {b.titulo}
                    </Title>
                    <Paragraph
                      style={{
                        color: "#E6F0FF",
                        marginTop: 4,
                        marginBottom: 0,
                      }}
                    >
                      {b.desc}
                    </Paragraph>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        {/* Botones prev/next (opcional) */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 8,
            transform: "translateY(-50%)",
            display: "flex",
            gap: 8,
          }}
        >
          <Button
            shape="circle"
            onClick={() => ref.current?.prev()}
            aria-label="Anterior"
          >
            ‹
          </Button>
        </div>
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: 8,
            transform: "translateY(-50%)",
          }}
        >
          <Button
            shape="circle"
            onClick={() => ref.current?.next()}
            aria-label="Siguiente"
          >
            ›
          </Button>
        </div>
      </div>
    </Card>
  );
}
