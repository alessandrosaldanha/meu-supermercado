import { useEffect } from "react";
import { CheckCircle, X, AlertTriangle, XCircle, Info } from "lucide-react";
import "./Toast.css";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
}

export function Toast({ message, type = "success", onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} />;
      case "error":
        return <XCircle size={20} />;
      case "warning":
        return <AlertTriangle size={20} />;
      case "info":
        return <Info size={20} />;
    }
  };

  return (
    <div className={`toast-container toast-${type}`}>
      <div className="toast-icon">{getIcon()}</div>
      <span className="toast-message">{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="toast-close"
        aria-label="Fechar"
      >
        <X size={18} />
      </button>
    </div>
  );
}
