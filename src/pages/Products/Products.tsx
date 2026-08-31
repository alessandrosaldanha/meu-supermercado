import { useEffect, useState } from "react";
import { ProductCard } from "../../components/ProductCard/ProductCard";
import { getProducts, type Product } from "../../services/api";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import "./Products.css";

export default function Products() {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
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
    showToast("Produto adicionado ao carrinho!", "success");

    setTimeout(() => {
      setAnimatingId(null);
    }, 300);
  };

  return (
    <div className="products-page">
      <main className="product-section">
        <h1 className="page-title">Todos os produtos</h1>

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
            disabled={page === totalPages}
            onClick={() => {
              setPage(totalPages);
            }}
            title="Última página"
          >
            {">>"}
          </button>
        </div>
      </main>
    </div>
  );
}
