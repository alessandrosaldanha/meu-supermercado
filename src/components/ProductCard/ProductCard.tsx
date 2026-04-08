import { useNavigate } from "react-router-dom";
import { Plus, Eye } from "lucide-react";
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

  // Função para ir para a página de detalhes
  const handleGoToDetails = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      className={`product-card ${isAnimating ? "pop-animation" : ""}`}
      onClick={handleGoToDetails} // O card inteiro agora é o link
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

          <Button
            variant="icon"
            onClick={(e) => {
              e.stopPropagation(); // ISSO AQUI resolve o seu problema!
              // O stopPropagation impede que o clique no botão "ative" o clique do card pai.
              onAdd(product);
            }}
          >
            <Plus size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
