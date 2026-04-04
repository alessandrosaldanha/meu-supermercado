import { Plus } from "lucide-react";
import { type Product } from "../services/api";
import { Button } from "./Button";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  isAnimating: boolean;
}

export function ProductCard({ product, onAdd, isAnimating }: ProductCardProps) {
  return (
    <div className={`product-card ${isAnimating ? "pop-animation" : ""}`}>
      <div className="product-image-container">
        <img src={product.image?.url} alt={product.name} />
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">R$ {product.price.toFixed(2)}</span>
          <Button variant="icon" onClick={() => onAdd(product)}>
            <Plus size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
