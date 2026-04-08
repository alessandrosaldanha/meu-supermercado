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

  useEffect(() => {
    const load = async () => {
      setLoading(true); // Começa a carregar
      const data = await getProducts(page);

      // Se o Xano devolver dados, a gente atualiza
      if (data && data.length > 0) {
        setProducts(data);
      }

      setLoading(false); // Para de carregar
      window.scrollTo({ top: 0, behavior: "smooth" });
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

  return (
    <div className="home-container">
      <main className="product-section">
        <FeaturedSlider />
        <h2 className="section-title">Ofertas em Destaque</h2>

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
          <button
            type="button"
            className="page-btn"
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Anterior
          </button>

          <span className="page-indicator">
            Página <strong>{page}</strong>
          </span>

          <button
            type="button"
            className="page-btn"
            /* Se vieram menos de 12 itens, o botão Próxima trava */
            disabled={products.length < 12}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Próxima
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
