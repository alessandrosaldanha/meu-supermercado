import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Toast } from "../components/Toast";
import {
  ShoppingCart,
  Star,
  CheckCircle,
  ChevronLeft,
  CornerDownRight,
  MessageCircle,
} from "lucide-react";
import { getProductById, postReview, type Product } from "../services/api";
import "./ProductDetail.css";
import "../components/CommentItem.css";

interface Review {
  id: string;
  user_name: string;
  comment: string;
  rating: number;
  parent_id?: string | null;
  replies?: Review[];
}

// 2. Sub-componente CommentItem
interface CommentItemProps {
  review: Review;
  onReply: (parentId: string, text: string) => void;
}

function CommentItem({ review, onReply }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    onReply(review.id, replyText);
    setReplyText("");
    setIsReplying(false);
  };

  return (
    <div
      className={`comment-node ${review.parent_id ? "is-reply" : "is-main"}`}
    >
      <div className="comment-header">
        {review.parent_id && <CornerDownRight size={14} color="#3483fa" />}
        <div className="stars-mini" style={{ display: "flex" }}>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={12}
              fill={i < (review.rating || 0) ? "#3483fa" : "none"}
              color="#3483fa"
            />
          ))}
        </div>
        <strong className="user-name">
          {review.user_name || "Cliente Vital"}
        </strong>
      </div>

      <p className="comment-text">{review.comment}</p>

      <button
        className="btn-reply-action"
        onClick={() => setIsReplying(!isReplying)}
      >
        <MessageCircle size={14} />
        {isReplying ? "Cancelar" : "Responder"}
      </button>

      {isReplying && (
        <div className="reply-form-container">
          <textarea
            className="reply-textarea"
            rows={2}
            placeholder="Escreva sua resposta..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button className="btn-submit-reply" onClick={handleSendReply}>
            Enviar Resposta
          </button>
        </div>
      )}

      {review.replies && review.replies.length > 0 && (
        <div className="replies-wrapper">
          {review.replies.map((reply) => (
            <CommentItem key={reply.id} review={reply} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
}

// 3. Componente Principal
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

  const handleBuyNow = () => {
    if (product) {
      addToCart(product);
      navigate("/cart");
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setToastMessage(`${product.name} adicionado ao carrinho!`);
      setShowToast(false);
      setTimeout(() => setShowToast(true), 10);
    }
  };

  // Função para enviar avaliação ou RESPOSTA
  const handleSendReview = async (parentId?: string, replyText?: string) => {
    const finalComment = replyText || comment;
    const finalRating = parentId ? 5 : userRating;

    if (!finalComment.trim()) {
      alert("Escreva algo antes de enviar!");
      return;
    }

    setIsSubmitting(true);
    try {
      const savedUser = localStorage.getItem("user");
      const parsedUser = savedUser ? JSON.parse(savedUser) : null;
      const userId = parsedUser?.id || localStorage.getItem("userId");

      if (!userId) {
        alert("Você precisa estar logado para enviar uma avaliação.");
        return;
      }

      await postReview(
        id!,
        finalRating,
        finalComment,
        parentId || null,
        Number(userId),
      );

      alert(parentId ? "Resposta enviada!" : "Avaliação enviada!");
      setComment("");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar. Verifique se você está logado.");
    } finally {
      setIsSubmitting(false);
    }
  }; // <--- ESSA CHAVE ESTAVA FALTANDO OU NO LUGAR ERRADO

  useEffect(() => {
    let isMounted = true;
    async function loadProduct() {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getProductById(id);
        if (data && isMounted) {
          setProduct(data);
          setMainImage(data.image?.[0]?.url || "");
        }
      } catch (err) {
        console.error(err);
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
            <h3>O que você achou do produto?</h3>
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
              placeholder="Conte sua experiência..."
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
          <p>Faça login para avaliar.</p>
        )}

        <div className="comments-list">
          {product.reviews?.map(
            (rev: Review) =>
              !rev.parent_id && (
                <CommentItem
                  key={rev.id}
                  review={rev}
                  onReply={(parentId, text) => handleSendReview(parentId, text)}
                />
              ),
          )}
        </div>
      </section>
    </div>
  );
}
