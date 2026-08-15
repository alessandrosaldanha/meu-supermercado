import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import api from "../../services/api";
import {
  MapPin,
  CreditCard,
  QrCode,
  Truck,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "../../components/Buttons/Button";
import { Stamp } from "../../components/Stamp/Stamp";
import "./Checkout.css";

const STEPS = [
  { n: 1, label: "Entrega" },
  { n: 2, label: "Pagamento" },
  { n: 3, label: "Revisão" },
];

export default function Checkout() {
  const { cart, cartCount, clearCart } = useCart();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleFinishOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        user_id: user.id,
        items: cart,
        total: total,
        payment_method: paymentMethod,
        status: "pendente",
        address: {
          logradouro: user.logradouro,
          numero: user.numero,
          bairro: user.bairro,
          cidade: user.cidade,
          cep: user.cep,
        },
      };

      await api.post("/orders", orderData);
      showToast("🚀 Pedido realizado com sucesso!", "success");
      clearCart();
      setTimeout(() => {
        navigate("/orders");
      }, 2500);
    } catch (error) {
      showToast("Erro ao finalizar pedido. Tente novamente.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const copyPixCode = () => {
    const pixCode = "00020126330014br.gov.bcb.pix0111...";
    navigator.clipboard.writeText(pixCode);
    showToast("✅ Código Pix copiado!", "success");
  };

  return (
    <div className="checkout-container">
      <div className="checkout-ticket">
        <div className="checkout-steps">
          {STEPS.map((s, i) => (
            <div key={s.n} className="checkout-step-wrap">
              {step > s.n ? (
                <Stamp variant="tag" tone="leaf">
                  <CheckCircle size={12} /> {s.label}
                </Stamp>
              ) : step === s.n ? (
                <Stamp variant="tag" tone="papaya">
                  {s.n}. {s.label}
                </Stamp>
              ) : (
                <span className="checkout-step-pending">
                  {s.n}. {s.label}
                </span>
              )}

              {i < STEPS.length - 1 && (
                <span
                  className={`checkout-step-connector ${step > s.n ? "done" : ""}`}
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="checkout-content">
        {step === 1 && (
          <div className="checkout-card">
            <h2>
              <MapPin size={22} /> Confirmar Endereço
            </h2>
            <div className="address-info">
              <p>
                <strong>{user.name}</strong>
              </p>
              <p>
                {user.logradouro}, {user.numero}
              </p>
              <p>
                {user.bairro} - {user.cidade}
              </p>
              <p>CEP: {user.cep}</p>
            </div>

            <div className="checkout-actions">
              <button
                type="button"
                className="checkout-btn-back"
                onClick={() => navigate("/perfil")}
              >
                Alterar Endereço
              </button>
              <button
                type="button"
                className="checkout-btn-next"
                onClick={() => setStep(2)}
              >
                Ir para pagamento <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="checkout-card">
            <h2>
              <CreditCard size={22} /> Forma de Pagamento
            </h2>
            <div className="payment-options">
              {/* OPÇÃO PIX */}
              <div
                className={`payment-group ${paymentMethod === "pix" ? "active" : ""}`}
              >
                <label
                  className="payment-option"
                  onClick={() => setPaymentMethod("pix")}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "pix"}
                    readOnly
                  />
                  <QrCode size={24} />
                  <span>PIX (5% de desconto)</span>
                </label>

                {paymentMethod === "pix" && (
                  <div className="payment-details-expanded">
                    <div className="mock-qr">
                      <QrCode size={40} />
                      <span>Ambiente de teste</span>
                    </div>
                    <p>
                      Escaneie o QR Code acima ou clique no código abaixo para
                      copiar:
                    </p>

                    {/* Usando a nova classe CSS */}
                    <code
                      className="pix-code-display"
                      onClick={copyPixCode}
                      title="Clique para copiar"
                    >
                      00020126330014br.gov.bcb.pix0111...
                    </code>

                    <Button
                      type="button"
                      variant="secondary"
                      className="btn-copy-pix"
                      onClick={copyPixCode}
                    >
                      Copiar Código Pix
                    </Button>
                  </div>
                )}
              </div>

              {/* OPÇÃO CARTÃO */}
              <div
                className={`payment-group ${paymentMethod === "cartao" ? "active" : ""}`}
              >
                <label
                  className="payment-option"
                  onClick={() => setPaymentMethod("cartao")}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "cartao"}
                    readOnly
                  />
                  <CreditCard size={24} />
                  <span>Cartão de Crédito</span>
                </label>

                {paymentMethod === "cartao" && (
                  <div className="payment-details-expanded">
                    <input
                      type="text"
                      placeholder="Número do Cartão"
                      className="card-input"
                      maxLength={16}
                    />
                    <div className="row">
                      <input
                        type="text"
                        placeholder="Validade (MM/AA)"
                        className="card-input"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="card-input"
                        maxLength={3}
                      />
                    </div>
                    <p className="card-warning">
                      ⚠️ Dados não serão salvos. Apenas para teste.
                    </p>
                  </div>
                )}
              </div>

              {/* OPÇÃO ENTREGA */}
              <label
                className={`payment-option ${paymentMethod === "entrega" ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="payment"
                  onChange={() => setPaymentMethod("entrega")}
                  checked={paymentMethod === "entrega"}
                />
                <Truck size={24} />
                <span>Pagar na Entrega</span>
              </label>
            </div>

            <div className="checkout-actions">
              <button
                className="checkout-btn-back"
                onClick={() => setStep(1)}
              >
                <ChevronLeft size={18} /> Voltar
              </button>
              <button className="checkout-btn-next" onClick={() => setStep(3)}>
                Revisar Pedido <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="checkout-card">
            <h2>
              <CheckCircle size={22} /> Resumo do Pedido
            </h2>
            <div className="order-summary">
              <p>
                Itens no carrinho: <strong>{cartCount}</strong>
              </p>
              <p>
                Forma de Pagamento:{" "}
                <strong>{paymentMethod.toUpperCase()}</strong>
              </p>
              <div className="total-box">
                <span>Total a pagar:</span>
                <span className="price">R$ {total.toFixed(2)}</span>
              </div>
            </div>
            <div className="checkout-actions">
              <button
                type="button"
                className="checkout-btn-back"
                onClick={() => setStep(2)}
              >
                <ChevronLeft size={18} /> Voltar
              </button>
              <button
                type="button"
                className="checkout-btn-finish"
                onClick={handleFinishOrder}
                disabled={loading || cart.length === 0}
              >
                {loading ? "Processando..." : "Confirmar e Finalizar"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
