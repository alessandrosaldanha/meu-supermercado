import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Toast, type ToastType } from "../components/Toasts/Toast";

interface ToastContextData {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{
    id: number;
    message: string;
    type: ToastType;
  } | null>(null);
  const nextId = useRef(0);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    nextId.current += 1;
    setToast({ id: nextId.current, message, type });
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
