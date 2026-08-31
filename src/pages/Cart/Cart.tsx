import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { Trash2, ShoppingBag, Minus, Plus, Lock, Truck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";

const brl = (valor: number) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function Cart() {
  const { cart, cartCount, removeFromCart, updateQuantity, setQuantity } =
    useCart();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const descontoPix = subtotal * 0.05;

  const handleGoToCheckout = () => {
    if (cart.length === 0) {
      showToast(
        "Seu carrinho está vazio! Adicione alguns produtos antes de finalizar.",
        "warning",
      );
      return;
    }
    navigate("/checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <div className="empty-cart-badge">
            <ShoppingBag size={34} />
          </div>
          <h2>Sua cesta está vazia</h2>
          <p>Hora de colher alguns produtos frescos.</p>
          <Link to="/products" className="continue-shopping-btn">
            <ShoppingBag size={18} />
            Ir às compras
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-shell">
        <h1 className="cart-title">
          Seu carrinho <span>· {cartCount} itens</span>
        </h1>

        <div className="cart-layout">
          <section className="cart-main">
            <div className="cart-delivery">
              <Truck size={20} strokeWidth={1.9} />
              <span>
                <strong>Entrega no mesmo dia</strong> para pedidos confirmados
                até as 18h em Maceió.
              </span>
            </div>

            <ul className="cart-items">
              {cart.map((item) => (
                <li key={item.id} className="cart-item">
                  <div className="cart-item-thumb">
                    {item.image?.[0]?.url ? (
                      <img src={item.image[0].url} alt={item.name} />
                    ) : (
                      <span>Sem foto</span>
                    )}
                  </div>

                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p className="cart-item-unit">
                      {brl(item.price)} a unidade
                    </p>
                    <button
                      type="button"
                      className="cart-item-remove"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 size={14} /> Excluir
                    </button>
                  </div>

                  <div className="quantity-controls">
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, "decrease")}
                      aria-label="Diminuir quantidade"
                    >
                      <Minus size={14} />
                    </button>
                    <input
                      type="number"
                      className="qty-input"
                      value={item.quantity}
                      min="1"
                      onChange={(e) =>
                        setQuantity(item.id, Number(e.target.value))
                      }
                      aria-label="Quantidade do produto"
                      title="Digite a quantidade"
                    />
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, "increase")}
                      aria-label="Aumentar quantidade"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="cart-item-total">
                    {brl(item.price * item.quantity)}
                  </div>
                </li>
              ))}
            </ul>

            <div className="cart-continue">
              <Link to="/products">Continuar comprando</Link>
              <span>
                Subtotal ({cartCount} itens):{" "}
                <strong>{brl(subtotal)}</strong>
              </span>
            </div>
          </section>

          <aside className="cart-summary">
            <h2>Resumo do pedido</h2>

            <dl className="summary-lines">
              <div>
                <dt>Produtos ({cartCount})</dt>
                <dd>{brl(subtotal)}</dd>
              </div>
              <div>
                <dt>Entrega</dt>
                <dd className="summary-muted">calculada no checkout</dd>
              </div>
              <div>
                <dt>Desconto no Pix (5%)</dt>
                <dd className="summary-success">− {brl(descontoPix)}</dd>
              </div>
            </dl>

            <div className="summary-total">
              <span>Total no Pix</span>
              <strong>{brl(subtotal - descontoPix)}</strong>
            </div>
            <p className="summary-alt">
              ou {brl(subtotal)} em cartão ou pagamento na entrega
            </p>

            <button
              type="button"
              className="checkout-button"
              onClick={handleGoToCheckout}
            >
              Fechar pedido
            </button>

            <p className="summary-secure">
              <Lock size={13} /> Compra protegida
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
