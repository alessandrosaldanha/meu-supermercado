import React, { useState } from "react";
import { Star, CornerDownRight, MessageCircle } from "lucide-react";
import "./CommentItem.css"; // NÃO ESQUEÇA DE IMPORTAR O CSS AQUI

// Representa a estrutura de um comentário vindo do Xano
interface Review {
  id: string;
  user_name: string;
  comment: string;
  rating: number;
  parent_id?: string | null;
  replies?: Review[]; // Um comentário pode ter uma lista de outros comentários (recursividade)
}

interface CommentItemProps {
  review: Review; // Agora usamos a interface em vez de 'any'
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

      {/* Renderização das respostas com tipagem correta */}
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
