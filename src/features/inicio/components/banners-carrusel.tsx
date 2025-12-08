// src/features/inicio/components/banners-carrusel.tsx
import { Carousel, Image } from "antd"; // Import Typography
import banner1 from "../assets/banner_01.png";
import banner2 from "../assets/banner_02.png";
import banner3 from "../assets/banner_03.png";
import banner4 from "../assets/banner_04.png";

const banners = [banner1, banner2, banner3, banner4];

export default function BannersCarrusel() {
  return (
    <Carousel
      autoplay
      autoplaySpeed={3000}
      dotPosition="bottom"
      effect="fade"
      className="shadow-lg rounded-lg overflow-hidden mb-6"
      style={{ maxWidth: "1000px", margin: "0 auto" }}
    >
      {banners.map((banner, index) => (
        <div key={index}>
          <Image
            src={banner}
            alt={`Banner ${index + 1}`}
            preview={false}
            style={{ width: "100%", height: "280px", objectFit: "cover" }}
          />
        </div>
      ))}
    </Carousel>
  );
}
