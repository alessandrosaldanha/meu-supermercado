import { useNavigate } from "react-router-dom";
import { ShoppingCart, Eye } from "lucide-react";
import { type Product } from "../../services/api";
import { Button } from "../Buttons/Button";
import "./ProductCard.css";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  isAnimating: boolean;
}

export function ProductCard({ product, onAdd, isAnimating }: ProductCardProps) {
  const navigate = useNavigate();

  const handleGoToDetails = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      className={`product-card ${isAnimating ? "pop-animation" : ""} ${product.is_featured ? "featured-card" : ""}`}
      onClick={handleGoToDetails}
    >
      <div className="product-image-container">
        <img src={product.image?.[0]?.url} alt={product.name} />
        <div className="view-details-overlay">
          <Eye size={20} /> <span>Ver detalhes</span>
        </div>
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-desc">{product.description}</p>

        <div className="product-footer">
          <span className="product-price">R$ {product.price.toFixed(2)}</span>

          {!product.is_featured && (
            <Button
              variant="icon"
              className="add-to-cart-btn"
              onClick={(e) => {
                e.stopPropagation();
                onAdd(product);
              }}
            >
              <ShoppingCart size={20} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
