import { ProductCard } from "../../components/ProductCard/ProductCard";
import { useEffect, useState } from "react";
import { FeaturedSlider } from "../../components/FeaturedSlider/FeaturedSlider";
import { Toast } from "../../components/Toasts/Toast";
import { getProducts, type Product } from "../../services/api";
import { useCart } from "../../context/CartContext";
import "./Home.css";

export default function Home() {
  const { addToCart } = useCart();
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [animatingId, setAnimatingId] = useState<number | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getProducts(page);

      if (data) {
        setProducts(data.items || []);
        setHasNextPage(page < data.pageTotal);
        const total = data.pageTotal || 1;
        setTotalPages(total);
      }
      setLoading(false);
    };
    load();
  }, [page]);

  const handleAddProduct = (product: Product) => {
    addToCart(product);
    setAnimatingId(product.id);

    setShowToast(false);
    setTimeout(() => {
      setShowToast(true);
    }, 10);

    setTimeout(() => {
      setAnimatingId(null);
    }, 300);
  };

  const today = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });

  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="hero-eyebrow">Mercado de bairro, em Maceió</p>
            <h1 className="hero-title">
              O que colhemos hoje, direto pra sua casa.
            </h1>
            <p className="hero-sub">
              Fruta, verdura e mercearia selecionadas nesta manhã. Peça até
              18h e receba ainda hoje.
            </p>
            <a href="#colheita" className="hero-cta">
              Ver o que chegou hoje
            </a>
          </div>
          <div className="hero-stamp" aria-hidden="true">
            <span className="hero-stamp-ring">
              <span className="hero-stamp-top">Colhido hoje</span>
              <span className="hero-stamp-date">{today}</span>
              <span className="hero-stamp-bottom">Mercado Vital · AL</span>
            </span>
          </div>
        </div>
      </section>

      <main className="product-section" id="colheita">
        <FeaturedSlider />
        <h2 className="section-title">Ofertas em destaque</h2>

        {loading ? (
          <div className="loader">Carregando...</div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={handleAddProduct}
                isAnimating={animatingId === product.id}
              />
            ))}
          </div>
        )}
        <div className="pagination-controls">
          {/* Pular para a Primeira Página */}
          <button
            className="page-btn"
            disabled={page === 1}
            onClick={() => setPage(1)}
            title="Primeira página"
          >
            {"<<"}
          </button>

          <button
            className="page-btn"
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Anterior
          </button>

          <span className="page-indicator">
            Página <strong>{page}</strong> de <strong>{totalPages}</strong>
          </span>

          <button
            className="page-btn"
            disabled={!hasNextPage}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Próxima
          </button>

          <button
            className="page-btn"
            onClick={() => {
              setPage(totalPages);
            }}
          >
            {">>"}
          </button>
        </div>
      </main>

      {showToast && (
        <Toast
          message="Produto adicionado ao carrinho!"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
