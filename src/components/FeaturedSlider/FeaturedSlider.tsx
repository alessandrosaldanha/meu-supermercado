import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { getFeaturedProducts, type Product } from "../../services/api";
import { ProductCard } from "../ProductCard/ProductCard";

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
        centeredSlides={true}
        watchSlidesProgress={true}
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1} // Mobile
        navigation
        loop={true}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        breakpoints={{
          768: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3.6 }, // Desktop mostra mais igual ao ML
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
