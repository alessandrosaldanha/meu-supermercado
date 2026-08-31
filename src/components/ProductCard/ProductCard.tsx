import { useNavigate } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { type Product } from "../../services/api";
import "./ProductCard.css";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  isAnimating: boolean;
}

const brl = (valor: number) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function ProductCard({ product, onAdd, isAnimating }: ProductCardProps) {
  const navigate = useNavigate();
  const imagem = product.image?.[0]?.url;

  const handleGoToDetails = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <article
      className={`product-card ${isAnimating ? "pop-animation" : ""}`}
      onClick={handleGoToDetails}
    >
      <div className="product-image-container">
        {product.is_featured && <span className="product-flag">Destaque</span>}
        {imagem ? (
          <img src={imagem} alt={product.name} loading="lazy" />
        ) : (
          <span className="product-image-empty">Sem foto</span>
        )}
      </div>

      <div className="product-info">
        {product.category && (
          <span className="product-category">{product.category}</span>
        )}

        <h3 className="product-name">{product.name}</h3>

        {product.description && (
          <p className="product-desc">{product.description}</p>
        )}

        {product.rating > 0 && (
          <div className="product-rating">
            <Star size={12} fill="currentColor" strokeWidth={0} />
            <span>{product.rating.toFixed(1)}</span>
          </div>
        )}

        <div className="product-footer">
          <span className="product-price">{brl(product.price)}</span>

          <button
            type="button"
            className="add-to-cart-btn"
            aria-label={`Adicionar ${product.name} ao carrinho`}
            onClick={(e) => {
              e.stopPropagation();
              onAdd(product);
            }}
          >
            <ShoppingCart size={15} />
            <span>Adicionar</span>
          </button>
        </div>
      </div>
    </article>
  );
}
