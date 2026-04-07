import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Toast } from "../components/Toast";
import { ShoppingCart, Star, ChevronLeft } from "lucide-react";
import { getProductById, postReview } from "../services/api";
// Importe o componente que criamos fora
import { CommentItem } from "../components/CommentItem";

import "./ProductDetail.css";

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any | null>(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comment, setComment] = useState("");
  const [userRating, setUserRating] = useState(5);

  const isLoggedIn = !!localStorage.getItem("token");

  const loadProductData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const productData = await getProductById(id);
      console.log("Dados que chegaram do Xano:", productData);

      if (productData) {
        setProduct(productData);

        if (!mainImage && productData.image?.[0]?.url) {
          setMainImage(productData.image[0].url);
        }
      }
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  }, [id, mainImage]);

  useEffect(() => {
    loadProductData();
  }, [loadProductData]);

  const handleSendReview = async (parentId?: string, replyText?: string) => {
    const finalComment = replyText || comment;
    const finalRating = parentId ? 5 : userRating;

    if (!finalComment.trim()) return;

    setIsSubmitting(true);
    try {
      const savedUser = localStorage.getItem("user");
      const parsedUser = savedUser ? JSON.parse(savedUser) : null;
      const userId = parsedUser?.id || localStorage.getItem("userId");

      const newReview = await postReview(
        id!,
        finalRating,
        finalComment,
        parentId || null,
        Number(userId),
      );

      if (product) {
        const reviewParaExibir = {
          ...newReview,
          user_name: parsedUser?.name || "Alessandro",
          replies: [],
        };

        setProduct({
          ...product,
          reviews: [reviewParaExibir, ...(product.reviews || [])],
        });
      }

      setComment("");
      alert(parentId ? "Resposta enviada!" : "Avaliação enviada!");
    } catch (err) {
      console.error("Erro ao enviar:", err);
      alert("Erro ao enviar. Verifique o console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product);
      navigate("/cart");
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setToastMessage(`${product.name} adicionado!`);
      setShowToast(true);
    }
  };

  if (loading)
    return <div className="loading-screen">Carregando Mercado Vital...</div>;
  if (!product)
    return (
      <div className="error-container">
        <h2>Produto não encontrado</h2>
      </div>
    );

  return (
    <div className="product-detail-container">
      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}

      <button className="btn-back" onClick={() => navigate(-1)}>
        <ChevronLeft size={20} /> Voltar
      </button>

      <div className="product-main-section">
        <div className="product-gallery">
          <div className="thumbnails">
            {product.image?.map((img: any, index: number) => (
              <img
                key={index}
                src={img.url}
                onMouseEnter={() => setMainImage(img.url)}
                className={`thumb-img ${mainImage === img.url ? "active-thumb" : ""}`}
                alt=""
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
          <div className="price-container">
            <span className="currency">R$</span>
            <span className="price-value">{product.price.toFixed(2)}</span>
          </div>
          <div className="action-buttons">
            <button className="btn-buy" onClick={handleBuyNow}>
              Comprar agora
            </button>
            <button className="btn-add-cart" onClick={handleAddToCart}>
              <ShoppingCart size={20} /> Carrinho
            </button>
          </div>
        </div>
      </div>

      <section className="product-extra-info">
        <h2>Descrição</h2>
        <p className="description-text">{product.description}</p>
      </section>

      <section className="reviews-section">
        <h2>Opiniões sobre o produto</h2>

        {isLoggedIn ? (
          <div className="comment-form">
            <h3>Avaliar produto</h3>
            <div className="star-rating-input">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={24}
                  fill={s <= userRating ? "#3483fa" : "none"}
                  color="#3483fa"
                  onClick={() => setUserRating(s)}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </div>
            <textarea
              className="comment-textarea"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Escreva sua opinião..."
            />
            <button
              className="btn-send-review"
              onClick={() => handleSendReview()}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
            </button>
          </div>
        ) : (
          <div className="login-notice">
            Faça login para avaliar este produto.
          </div>
        )}

        <div className="comments-list">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews
              .filter((rev: any) => !rev.parent_id)
              .map((rev: any) => (
                <CommentItem
                  key={rev.id}
                  review={rev}
                  onReply={(parentId: string, text: string) =>
                    handleSendReview(parentId, text)
                  }
                />
              ))
          ) : (
            <p className="no-reviews">
              Ainda não há avaliações para este produto.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
