import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById, type Product } from "../services/api"; // Importando o Tipo Product
import { ShoppingCart, Star } from "lucide-react";
import "./ProductDetail.css";

export function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      // 2. Buscamos os dados
      const data = await getProductById(id);

      // 3. VERIFICAÇÃO DE SEGURANÇA: Só executa se 'data' não for null
      if (data) {
        setProduct(data);
        // Define a primeira imagem da lista como a principal ao carregar
        setMainImage(data.image?.[0]?.url || "");
      }

      setLoading(false);
    }
    loadProduct();
  }, [id]);

  // 4. Estados de carregamento e erro
  if (loading) return <div className="loading">Carregando detalhes...</div>;

  if (!product) {
    return <div className="error-container">Produto não encontrado.</div>;
  }

  return (
    <div className="product-detail-container">
      <div className="product-main-section">
        {/* ESQUERDA: Galeria */}
        <div className="product-gallery">
          <div className="thumbnails">
            {product.image?.map((img, index) => (
              <img
                key={index}
                src={img.url}
                onClick={() => setMainImage(img.url)}
                alt={`Miniatura ${index}`}
                className={`thumb-img ${mainImage === img.url ? "active-thumb" : ""}`}
              />
            ))}
          </div>
          <div className="main-image-wrapper">
            <img
              src={mainImage}
              alt={product.name}
              className="featured-image"
            />
          </div>
        </div>

        {/* DIREITA: Conteúdo */}
        <div className="product-info-sidebar">
          <span className="badge-new">Novo | +100 vendidos</span>
          <h1 className="product-title">{product.name}</h1>

          <div className="rating-summary">
            <div className="stars-container">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`star-icon ${i < (product.rating || 0) ? "filled" : ""}`}
                />
              ))}
            </div>
            <span className="rating-text">({product.rating || 0}/5)</span>
          </div>

          <div className="price-container">
            <span className="currency">R$</span>
            <span className="price-value">{product.price.toFixed(2)}</span>
          </div>

          <p className="shipping-notice">Entrega grátis em Maceió e região</p>

          <div className="action-buttons">
            <button type="button" className="btn-buy">
              Comprar agora
            </button>
            <button type="button" className="btn-add-cart">
              <ShoppingCart size={20} /> Adicionar ao carrinho
            </button>
          </div>
        </div>
      </div>

      <section className="product-extra-info">
        <h2>Descrição</h2>
        <p className="description-text">{product.description}</p>
      </section>
    </div>
  );
}
