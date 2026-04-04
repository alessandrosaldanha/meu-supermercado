import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Toast } from "../components/Toast";
import { ShoppingCart, Star, CheckCircle, ChevronLeft } from "lucide-react";
import { getProductById, postReview, type Product } from "../services/api";
import "./ProductDetail.css";

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  const [comment, setComment] = useState("");
  const [userRating, setUserRating] = useState(5);
  const [toastMessage, setToastMessage] = useState("");
  const isLoggedIn = !!localStorage.getItem("token");
  const handleBuyNow = () => {
    if (product) {
      addToCart(product);
      navigate("/cart"); // Ou "/checkout" se você já tiver essa rota
    }
  };

  const handleSendReview = async () => {
    if (!comment.trim()) {
      // Se você não tiver a biblioteca toast instalada, use alert:
      alert("Escreva um comentário antes de enviar!");
      return;
    }

    try {
      await postReview(id as string, userRating, comment);
      alert("Avaliação enviada com sucesso!");
      setComment("");
      setUserRating(5);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar avaliação. Verifique se você está logado.");
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setToastMessage(`${product.name} adicionado ao carrinho!`);
      setShowToast(false);
      setTimeout(() => {
        setShowToast(true);
      }, 10);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function loadProduct() {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getProductById(id);
        if (data && isMounted) {
          setProduct(data);
          // BUG FIX: Verifica se existe imagem antes de setar a principal
          setMainImage(data.image?.[0]?.url || "");
        }
      } catch (err) {
        console.error("Erro ao carregar produto:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadProduct();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading)
    return <div className="loading-screen">Carregando detalhes...</div>;

  if (!product)
    return (
      <div className="error-container">
        <h2>Produto não encontrado</h2>
        <button onClick={() => navigate("/")}>Voltar para o início</button>
      </div>
    );

  return (
    <div className="product-detail-container">
      {/* Toast flutuante */}
      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}

      {/* Botão de Voltar (UX Melhorada) */}
      <button className="btn-back" onClick={() => navigate(-1)}>
        <ChevronLeft size={20} /> Voltar
      </button>

      <div className="product-main-section">
        <div className="product-gallery">
          <div className="thumbnails">
            {product.image?.map((img, index) => (
              <img
                key={index}
                src={img.url}
                onMouseEnter={() => setMainImage(img.url)}
                alt=""
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

        <div className="product-info-sidebar">
          <span className="badge-new">Novo | +100 vendidos</span>
          <h1 className="product-title">{product.name}</h1>

          <div className="rating-summary">
            <div className="stars-container">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  fill={i < (product.rating || 0) ? "#3483fa" : "none"}
                  color="#3483fa"
                />
              ))}
            </div>
            <span className="rating-text">({product.rating || 0}/5)</span>
          </div>

          <div className="price-container">
            <span className="currency">R$</span>
            <span className="price-value">{product.price.toFixed(2)}</span>
          </div>

          <div className="benefits">
            <p>
              <CheckCircle size={16} color="#00a650" />{" "}
              <span>Frete grátis</span> em Maceió
            </p>
          </div>

          <div className="action-buttons">
            <button type="button" className="btn-buy" onClick={handleBuyNow}>
              Comprar agora
            </button>
            <button
              type="button"
              className="btn-add-cart"
              onClick={handleAddToCart}
            >
              <ShoppingCart size={20} /> Adicionar ao carrinho
            </button>
          </div>
        </div>
      </div>

      <section className="product-extra-info">
        <h2>Descrição</h2>
        <p className="description-text">{product.description}</p>
      </section>

      {/* Seção de Comentários */}
      <section className="reviews-section">
        <h2>Opiniões sobre o produto</h2>
        {isLoggedIn ? (
          <div className="comment-form">
            <h3>Deixe sua avaliação</h3>
            <div className="star-rating-input">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={24}
                  style={{ cursor: "pointer" }}
                  fill={s <= userRating ? "#3483fa" : "none"}
                  color="#3483fa"
                  onClick={() => setUserRating(s)}
                />
              ))}
            </div>
            <textarea
              placeholder="O que você achou deste produto?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="comment-textarea"
            />
            <button className="btn-send-review" onClick={handleSendReview}>
              Enviar Avaliação
            </button>
          </div>
        ) : (
          <div className="login-notice-card">
            <p>Para avaliar, você precisa estar conectado.</p>
            <button
              className="btn-login-redirect"
              onClick={() => navigate("/login")}
            >
              Fazer Login
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
