import { useEffect } from "react";
import { CheckCircle, X } from "lucide-react";
import "./Toast.css";

interface ToastProps {
  message: string;
  onClose: () => void;
}

export function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Some sozinho após 3 segundos

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast-container">
      <CheckCircle size={20} color="#fff" />
      <span>{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="toast-close"
        aria-label="Fechar notificação"
        title="Fechar"
      >
        <X size={18} />
      </button>
    </div>
  );
}
