import { useState } from "react";
import { Star, CornerDownRight, MessageCircle } from "lucide-react";
import "./CommentItem.css";
import type { Review } from "../../services/api";

interface CommentItemProps {
  review: Review;
  onReply: (parentId: string, text: string) => void;
}

export function CommentItem({ review, onReply }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    onReply(String(review.id), replyText);
    setReplyText("");
    setIsReplying(false);
  };

  return (
    <div
      className={`comment-node ${review.parent_id ? "is-reply" : "is-main"}`}
    >
      <div className="comment-header">
        {review.parent_id && <CornerDownRight size={14} color="#3483fa" />}
        <div className="stars-mini">
          {" "}
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={12}
              className="star-icon"
              fill={i < (review.rating || 0) ? "#3483fa" : "none"}
              color="#3483fa"
            />
          ))}
        </div>
        <strong className="user-name">
          {review.user?.name || review.user_name || "Cliente Vital"}
        </strong>
      </div>

      <p className="comment-text">{review.comment}</p>

      <button
        type="button"
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
          <button
            type="button"
            className="btn-submit-reply"
            onClick={handleSendReply}
          >
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
