import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import {
  ShoppingCart,
  Star,
  ChevronRight,
  Truck,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import {
  getProductById,
  postReview,
  type Product,
  type Review,
} from "../../services/api";
import { CommentItem } from "../../components/CommentItems/CommentItem";

import "./ProductDetail.css";

const brl = (valor: number) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comment, setComment] = useState("");
  const [userRating, setUserRating] = useState(5);
  const [quantidade, setQuantidade] = useState(1);

  const isLoggedIn = !!localStorage.getItem("token");

  const loadProductData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const productData = await getProductById(id);

      if (productData) {
        setProduct(productData);
        setMainImage(productData.image?.[0]?.url ?? "");
      }
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProductData();
  }, [loadProductData]);

  const avaliacoes = useMemo(
    () => (product?.reviews ?? []).filter((rev) => !rev.parent_id),
    [product],
  );

  const notaMedia = useMemo(() => {
    const notas = avaliacoes.map((r) => r.rating).filter((n) => n > 0);
    if (notas.length === 0) return null;
    return notas.reduce((a, b) => a + b, 0) / notas.length;
  }, [avaliacoes]);

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
        const reviewParaExibir: Review = {
          ...newReview,
          user: {
            name: parsedUser?.name || "Usuário",
          },
          replies: [],
        };

        setProduct({
          ...product,
          reviews: [reviewParaExibir, ...(product.reviews || [])],
        });
      }
      setComment("");
      showToast(
        parentId ? "Resposta enviada!" : "Avaliação enviada!",
        "success",
      );
    } catch (err) {
      console.error("Erro ao enviar:", err);
      showToast("Erro ao enviar. Tente novamente.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const adicionar = (vezes: number) => {
    if (!product) return;
    for (let i = 0; i < vezes; i += 1) addToCart(product);
  };

  const handleBuyNow = () => {
    adicionar(quantidade);
    navigate("/cart");
  };

  const handleAddToCart = () => {
    adicionar(quantidade);
    showToast(`${product?.name} adicionado ao carrinho!`, "success");
  };

  if (loading)
    return <div className="loading-screen">Carregando Mercado Vital...</div>;
  if (!product)
    return (
      <div className="error-container">
        <h2>Produto não encontrado</h2>
        <Link to="/products">Ver todos os produtos</Link>
      </div>
    );

  return (
    <div className="product-detail-page">
      <nav className="breadcrumb" aria-label="Você está em">
        <Link to="/">Início</Link>
        <ChevronRight size={12} />
        <Link to="/products">Todos os produtos</Link>
        <ChevronRight size={12} />
        <span className="breadcrumb-current">{product.name}</span>
      </nav>

      <div className="pd-shell">
        <div className="pd-card">
          <div className="product-gallery">
            <div className="thumbnails">
              {product.image?.map((img, index) => (
                <button
                  type="button"
                  key={index}
                  className={`thumb-img ${mainImage === img.url ? "active-thumb" : ""}`}
                  onMouseEnter={() => setMainImage(img.url)}
                  onFocus={() => setMainImage(img.url)}
                  aria-label={`Ver imagem ${index + 1} de ${product.name}`}
                >
                  <img src={img.url} alt="" />
                </button>
              ))}
            </div>
            <div className="main-image-wrapper">
              {mainImage ? (
                <img
                  key={mainImage}
                  src={mainImage}
                  alt={product.name}
                  className="featured-image"
                />
              ) : (
                <span className="sem-foto">Sem foto</span>
              )}
            </div>
          </div>

          <div className="pd-info">
            {product.category && (
              <span className="pd-category">{product.category}</span>
            )}
            <h1 className="product-title">{product.name}</h1>

            {notaMedia !== null && (
              <div className="pd-rating">
                <strong>{notaMedia.toFixed(1)}</strong>
                <span className="pd-stars" aria-hidden="true">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      fill={s <= Math.round(notaMedia) ? "currentColor" : "none"}
                      strokeWidth={1.6}
                    />
                  ))}
                </span>
                <a href="#avaliacoes">
                  {avaliacoes.length}{" "}
                  {avaliacoes.length === 1 ? "avaliação" : "avaliações"}
                </a>
              </div>
            )}

            <div className="price-container">{brl(product.price)}</div>

            {product.description && (
              <p className="pd-description">{product.description}</p>
            )}
          </div>

          <aside className="pd-buybox">
            <p className="buybox-delivery">
              <Truck size={17} strokeWidth={2} />
              <span>
                <strong>Entrega no mesmo dia</strong> para pedidos até as 18h em
                Maceió.
              </span>
            </p>

            <span className="buybox-label">Quantidade</span>
            <div className="buybox-qty">
              <button
                type="button"
                onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                aria-label="Diminuir quantidade"
              >
                −
              </button>
              <span>{quantidade}</span>
              <button
                type="button"
                onClick={() => setQuantidade((q) => q + 1)}
                aria-label="Aumentar quantidade"
              >
                +
              </button>
            </div>

            <button type="button" className="btn-buy" onClick={handleBuyNow}>
              Comprar agora
            </button>
            <button
              type="button"
              className="btn-add-cart"
              onClick={handleAddToCart}
            >
              <ShoppingCart size={18} /> Adicionar ao carrinho
            </button>

            <ul className="buybox-perks">
              <li>
                <CreditCard size={16} strokeWidth={1.9} />
                <span>
                  <strong>5% de desconto no Pix.</strong> Ou pague na entrega,
                  com cartão ou dinheiro.
                </span>
              </li>
              <li>
                <ShieldCheck size={16} strokeWidth={1.9} />
                <span>
                  <strong>Compra protegida.</strong> Acompanhe o pedido do
                  pendente ao entregue.
                </span>
              </li>
            </ul>
          </aside>
        </div>

        <section className="reviews-section" id="avaliacoes">
          <h2 className="section-title">Opiniões sobre o produto</h2>

          {isLoggedIn ? (
            <div className="comment-form">
              <h3>Avaliar produto</h3>
              <div className="star-rating-input">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    type="button"
                    key={s}
                    className="rating-star"
                    onClick={() => setUserRating(s)}
                    aria-label={`Dar nota ${s}`}
                  >
                    <Star
                      size={24}
                      fill={s <= userRating ? "var(--papaya)" : "none"}
                      color="var(--papaya)"
                    />
                  </button>
                ))}
              </div>
              <textarea
                className="comment-textarea"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Conte como foi sua experiência com este produto..."
              />
              <button
                type="button"
                className="btn-send-review"
                onClick={() => handleSendReview()}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Enviar avaliação"}
              </button>
            </div>
          ) : (
            <div className="login-notice">
              <Link to="/login">Faça login</Link> para avaliar este produto.
            </div>
          )}

          <div className="comments-list">
            {avaliacoes.length > 0 ? (
              avaliacoes.map((rev) => (
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
    </div>
  );
}
