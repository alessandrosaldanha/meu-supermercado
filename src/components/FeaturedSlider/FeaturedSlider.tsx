import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { getFeaturedProducts, type Product } from "../../services/api";
import { ProductCard } from "../ProductCard/ProductCard";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";

// Estilos do Swiper
import "swiper/css";
import "swiper/css/navigation";
import "./FeaturedSlider.css";

export function FeaturedSlider() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [animatingId, setAnimatingId] = useState<number | null>(null);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    getFeaturedProducts().then(setFeatured);
  }, []);

  const handleAdd = (product: Product) => {
    addToCart(product);
    setAnimatingId(product.id);
    showToast("Produto adicionado ao carrinho!", "success");
    setTimeout(() => setAnimatingId(null), 300);
  };

  if (featured.length === 0) return null;

  return (
    <section className="featured-section">
      <div className="featured-header">
        <h2 className="section-title">Ofertas em destaque</h2>
        <Link to="/products" className="featured-link">
          Ver todos os produtos
        </Link>
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={14}
        slidesPerView={1.2}
        navigation
        watchSlidesProgress={true}
        breakpoints={{
          520: { slidesPerView: 2.2 },
          768: { slidesPerView: 3.2 },
          1024: { slidesPerView: 4 },
          1440: { slidesPerView: 5 },
        }}
        className="featured-swiper"
      >
        {featured.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard
              product={product}
              onAdd={handleAdd}
              isAnimating={animatingId === product.id}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
