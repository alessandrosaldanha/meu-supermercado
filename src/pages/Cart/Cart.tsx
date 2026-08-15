import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { Trash2, ShoppingBag, Minus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Buttons/Button";
import "./Cart.css";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, setQuantity } = useCart();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

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

  return (
    <div className="cart-page">
      <main className="cart-content">
        {cart.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-badge">
              <ShoppingBag size={36} />
            </div>
            <h2>Sua cesta está vazia</h2>
            <p>Seu carrinho está vazio — hora de colher alguns produtos frescos.</p>
            <Button
              variant="primary"
              className="continue-shopping-btn"
              onClick={() => navigate("/")}
            >
              <ShoppingBag size={20} />
              Ir às compras
            </Button>
          </div>
        ) : (
          <>
            <h1 className="cart-title">Seu Carrinho</h1>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image[0]?.url} alt={item.name} />

                  <div className="item-details">
                    <h3>{item.name}</h3>

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
                  </div>

                  <div className="item-side">
                    <span className="item-price">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </span>
                    <Button
                      type="button"
                      variant="danger"
                      className="remove-button"
                      aria-label="Remover produto"
                      onClick={() => removeFromCart(item.id)}
                      title="Remover produto"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <footer className="cart-footer">
              <div className="total-container">
                <span>Total da Compra:</span>
                <span className="total-value">R$ {total.toFixed(2)}</span>
              </div>
              <Button
                variant="primary"
                className="checkout-button"
                onClick={handleGoToCheckout}
              >
                Finalizar Pedido
              </Button>
            </footer>
          </>
        )}
      </main>
    </div>
  );
}
