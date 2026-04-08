import { useCart } from "../context/CartContext";
import { Trash2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import "./Cart.css";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, setQuantity, clearCart } =
    useCart();
  const navigate = useNavigate();

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleFinishPurchase = async () => {
    const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (!savedUser.cep) {
      alert("Precisamos do seu endereço para a entrega em Maceió!");
      navigate("/perfil");
      return;
    }

    try {
      // await api.post("orders", { items: cart, userId: savedUser.id });
      clearCart();
      localStorage.removeItem("cart");

      alert(
        "🚀 Compra finalizada com sucesso! Seu pedido está sendo preparado.",
      );
      navigate("/");
    } catch (error) {
      alert("Erro ao processar a compra.");
    }
  };

  return (
    <div className="cart-page">
      <main className="cart-content">
        {cart.length === 0 ? (
          <div className="empty-cart">
            <ShoppingBag size={64} color="#ccc" />
            <p>Seu carrinho está vazio.</p>
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
                      >
                        -
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
                      >
                        +
                      </button>
                    </div>

                    <span className="item-price">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="remove-button"
                    aria-label="Remover produto"
                    onClick={() => removeFromCart(item.id)}
                    title="Remover produto"
                  >
                    <Trash2 size={20} />
                  </button>
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
                onClick={handleFinishPurchase}
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
