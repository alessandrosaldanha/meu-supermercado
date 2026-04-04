import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { getFeaturedProducts, type Product } from "../services/api";
import { ProductCard } from "./ProductCard";

// Estilos do Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./FeaturedSlider.css";

export function FeaturedSlider() {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    getFeaturedProducts().then(setFeatured);
  }, []);

  if (featured.length === 0) return null;

  return (
    <section className="featured-section">
      <h2 className="section-title">🔥 Ofertas Imperdíveis</h2>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1} // Mobile
        navigation
        loop={true}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        breakpoints={{
          640: { slidesPerView: 2.5 },
          1024: { slidesPerView: 4.5 }, // Desktop mostra mais igual ao ML
        }}
        className="featured-swiper"
      >
        {featured.map((product) => (
          <SwiperSlide key={product.id}>
            {/* Passamos false para o erro sumir e o card carregar parado */}
            <ProductCard
              product={product}
              onAdd={() => {}}
              isAnimating={false}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
