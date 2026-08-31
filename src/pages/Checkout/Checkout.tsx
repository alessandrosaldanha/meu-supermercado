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
  Check,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import "./Checkout.css";

const STEPS = [
  { n: 1, label: "Entrega" },
  { n: 2, label: "Pagamento" },
  { n: 3, label: "Revisão" },
];

const PIX_CODE = "00020126330014br.gov.bcb.pix0111...";
const DESCONTO_PIX = 0.05;

interface CheckoutUser {
  id: number;
  name?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  cep?: string;
  complemento?: string;
}

const brl = (valor: number) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const ROTULO_PAGAMENTO: Record<string, string> = {
  pix: "Pix",
  cartao: "Cartão de crédito",
  entrega: "Pagar na entrega",
};

export default function Checkout() {
  const { cart, cartCount, clearCart } = useCart();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [user, setUser] = useState<CheckoutUser | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const desconto = paymentMethod === "pix" ? subtotal * DESCONTO_PIX : 0;
  const total = subtotal - desconto;

  const handleFinishOrder = async () => {
    if (!user) return;
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
      showToast("Pedido realizado com sucesso!", "success");
      clearCart();
      setTimeout(() => {
        navigate("/orders");
      }, 2500);
    } catch {
      showToast("Erro ao finalizar pedido. Tente novamente.", "error");
    } finally {
      setLoading(false);
    }
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(PIX_CODE);
    showToast("Código Pix copiado!", "success");
  };

  if (!user) return null;

  return (
    <div className="checkout-page">
      <div className="checkout-shell">
        <ol className="checkout-steps">
          {STEPS.map((s, i) => (
            <li key={s.n} className="checkout-step">
              <span
                className={`step-badge ${step > s.n ? "done" : ""} ${step === s.n ? "atual" : ""}`}
              >
                {step > s.n ? <Check size={15} strokeWidth={3} /> : s.n}
              </span>
              <span className="step-label">
                <small>Passo {s.n}</small>
                <strong className={step < s.n ? "pendente" : ""}>
                  {s.label}
                </strong>
              </span>
              {i < STEPS.length - 1 && (
                <span
                  className={`step-connector ${step > s.n ? "done" : ""}`}
                  aria-hidden="true"
                />
              )}
            </li>
          ))}
        </ol>

        <div className="checkout-layout">
          <section className="checkout-main">
            {step === 1 && (
              <div className="checkout-card">
                <h2>
                  <MapPin size={20} /> Onde vamos entregar
                </h2>
                <div className="address-info">
                  <p className="address-name">{user.name}</p>
                  <p>
                    {user.logradouro}
                    {user.numero ? `, ${user.numero}` : ""}
                    {user.complemento ? ` — ${user.complemento}` : ""}
                  </p>
                  <p>
                    {[user.bairro, user.cidade].filter(Boolean).join(" · ")}
                    {user.cep ? ` · ${user.cep}` : ""}
                  </p>
                </div>

                <div className="checkout-actions">
                  <button
                    type="button"
                    className="checkout-btn-back"
                    onClick={() => navigate("/perfil")}
                  >
                    Alterar endereço
                  </button>
                  <button
                    type="button"
                    className="checkout-btn-next"
                    onClick={() => setStep(2)}
                  >
                    Ir para pagamento <ChevronRight size={17} />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="checkout-card">
                <h2>
                  <CreditCard size={20} /> Como você quer pagar?
                </h2>

                <div className="payment-options">
                  <div
                    className={`payment-group ${paymentMethod === "pix" ? "active" : ""}`}
                  >
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "pix"}
                        onChange={() => setPaymentMethod("pix")}
                      />
                      <QrCode size={21} />
                      <span className="payment-name">Pix</span>
                      <span className="payment-tag">5% de desconto</span>
                      <span className="payment-value">
                        {brl(subtotal * (1 - DESCONTO_PIX))}
                      </span>
                    </label>

                    {paymentMethod === "pix" && (
                      <div className="payment-details-expanded">
                        <div className="mock-qr">
                          <QrCode size={54} />
                          <span>Ambiente de teste</span>
                        </div>
                        <div className="pix-instructions">
                          <p>
                            Escaneie o QR code no app do seu banco ou copie o
                            código abaixo. O pedido é liberado assim que o
                            pagamento for confirmado.
                          </p>
                          <div className="pix-code-row">
                            <code
                              className="pix-code-display"
                              onClick={copyPixCode}
                              title="Clique para copiar"
                            >
                              {PIX_CODE}
                            </code>
                            <button
                              type="button"
                              className="btn-copy-pix"
                              onClick={copyPixCode}
                            >
                              Copiar código
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div
                    className={`payment-group ${paymentMethod === "cartao" ? "active" : ""}`}
                  >
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "cartao"}
                        onChange={() => setPaymentMethod("cartao")}
                      />
                      <CreditCard size={21} />
                      <span className="payment-name">Cartão de crédito</span>
                      <span className="payment-value">{brl(subtotal)}</span>
                    </label>

                    {paymentMethod === "cartao" && (
                      <div className="payment-details-expanded">
                        <input
                          type="text"
                          placeholder="Número do cartão"
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
                          Ambiente de teste — os dados do cartão não são
                          enviados nem salvos.
                        </p>
                      </div>
                    )}
                  </div>

                  <div
                    className={`payment-group ${paymentMethod === "entrega" ? "active" : ""}`}
                  >
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "entrega"}
                        onChange={() => setPaymentMethod("entrega")}
                      />
                      <Truck size={21} />
                      <span className="payment-name">
                        Pagar na entrega
                        <small>Dinheiro, cartão na maquininha ou Pix</small>
                      </span>
                      <span className="payment-value">{brl(subtotal)}</span>
                    </label>
                  </div>
                </div>

                <div className="checkout-actions">
                  <button
                    type="button"
                    className="checkout-btn-back"
                    onClick={() => setStep(1)}
                  >
                    <ChevronLeft size={17} /> Voltar
                  </button>
                  <button
                    type="button"
                    className="checkout-btn-next"
                    onClick={() => setStep(3)}
                  >
                    Revisar pedido <ChevronRight size={17} />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="checkout-card">
                <h2>
                  <Check size={20} /> Confira antes de confirmar
                </h2>

                <dl className="review-list">
                  <div>
                    <dt>Entrega</dt>
                    <dd>
                      {user.logradouro}
                      {user.numero ? `, ${user.numero}` : ""} —{" "}
                      {[user.bairro, user.cidade].filter(Boolean).join(", ")}
                    </dd>
                  </div>
                  <div>
                    <dt>Pagamento</dt>
                    <dd>{ROTULO_PAGAMENTO[paymentMethod] ?? paymentMethod}</dd>
                  </div>
                  <div>
                    <dt>Itens</dt>
                    <dd>{cartCount} produtos</dd>
                  </div>
                </dl>

                <div className="checkout-actions">
                  <button
                    type="button"
                    className="checkout-btn-back"
                    onClick={() => setStep(2)}
                  >
                    <ChevronLeft size={17} /> Voltar
                  </button>
                  <button
                    type="button"
                    className="checkout-btn-finish"
                    onClick={handleFinishOrder}
                    disabled={loading || cart.length === 0}
                  >
                    {loading ? "Processando..." : "Confirmar e finalizar"}
                  </button>
                </div>
              </div>
            )}
          </section>

          <aside className="checkout-summary">
            <h2>Resumo do pedido</h2>

            <ul className="summary-items">
              {cart.map((item) => (
                <li key={item.id}>
                  <div className="summary-thumb">
                    {item.image?.[0]?.url ? (
                      <img src={item.image[0].url} alt={item.name} />
                    ) : (
                      <span>—</span>
                    )}
                    <span className="summary-qty">{item.quantity}</span>
                  </div>
                  <span className="summary-name">{item.name}</span>
                  <span className="summary-price">
                    {brl(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="summary-lines">
              <div>
                <dt>Produtos ({cartCount})</dt>
                <dd>{brl(subtotal)}</dd>
              </div>
              {desconto > 0 && (
                <div>
                  <dt>Desconto no Pix (5%)</dt>
                  <dd className="summary-success">− {brl(desconto)}</dd>
                </div>
              )}
            </dl>

            <div className="summary-total">
              <span>Total</span>
              <strong>{brl(total)}</strong>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
