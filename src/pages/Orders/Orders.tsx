import { useEffect, useState } from "react";
import api from "../../services/api";
import "./Orders.css";

interface Order {
  id: number;
  created_at: number;
  total: number;
  status: string;
  payment_method: string;
  items: any[];
}

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
        // Buscamos as ordens filtrando pelo ID do usuário logado
        const response = await api.get(`/orders?user_id=${savedUser.id}`);

        // Garantimos que estamos pegando o array de dados (dependendo da resposta do Xano)
        const data = Array.isArray(response.data) ? response.data : [];
        setOrders(data);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="orders-container">
        <div className="p-10 text-center text-gray-500 text-xl">
          Carregando seus pedidos...
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h1 className="orders-title">Minhas Compras</h1>

      {orders.length === 0 ? (
        <div className="orders-empty">
          <p>Você ainda não realizou nenhum pedido.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              {/* Cabeçalho do Card */}
              <div className="order-header">
                <div className="order-info">
                  <h3>Pedido #{order.id}</h3>
                  <p className="order-date">
                    {new Date(order.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <span
                  className={`status-badge status-${order.status.toLowerCase()}`}
                >
                  {order.status}
                </span>
              </div>

              {/* Corpo do Card com a lista de produtos */}
              <div className="order-body">
                {Array.isArray(order.items) ? (
                  order.items.map((item: any, index: number) => (
                    <div key={index} className="order-item">
                      <span className="item-name">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="item-price">
                        R$ {Number(item.price).toFixed(2)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm italic">
                    Formatando itens do pedido...
                  </p>
                )}
              </div>

              {/* Rodapé do Card */}
              <div className="order-footer">
                <div className="payment-info">
                  Pagamento: <strong>{order.payment_method}</strong>
                </div>
                <div className="order-total-value">
                  R$ {Number(order.total).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
