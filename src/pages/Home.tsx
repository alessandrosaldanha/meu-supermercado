import { ProductCard } from "../components/ProductCard";
import { useEffect, useState } from "react";
import { Toast } from "../components/Toast";
import { getProducts, type Product } from "../services/api";
import { useCart } from "../context/CartContext";
import "./Home.css";

export default function Home() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [animatingId, setAnimatingId] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    };
    load();
  }, []);

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
      {/* O BLOCO <header> FOI REMOVIDO DAQUI PORQUE A NAVBAR JÁ ESTÁ NO APP.TSX */}

      <main className="product-section">
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
