import { Link, useNavigate } from "react-router-dom";
import { Store, ShoppingCart, User, Package, Home, LogOut } from "lucide-react";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

export function Navbar() {
  const { cartCount } = useCart();
  const navigate = useNavigate();

  // Lógica de Autenticação: Checa se existe um token e o nome no localStorage
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");
  const isLoggedIn = !!token;

  const handleLogout = () => {
    // CRUD - "Delete" da sessão local
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    alert("Você saiu da plataforma. Até logo!");
    navigate("/login"); // Manda para o cadastro/login
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* LOGO */}
        <Link to="/" className="nav-logo">
          <Store size={28} color="var(--primary)" />
          <span>
            Mercado <span className="logo-bold">Vital</span>
          </span>
        </Link>

        {/* LINKS DE NAVEGAÇÃO CENTRAL */}
        <ul className="nav-menu">
          <li>
            <Link to="/">
              <Home size={18} /> Início
            </Link>
          </li>
          <li>
            <Link to="/products">
              <Package size={18} /> Produtos
            </Link>
          </li>
          <li>
            <Link to="/orders">
              <Package size={18} /> Meus Pedidos
            </Link>
          </li>
        </ul>

        {/* AÇÕES (CARRINHO E USUÁRIO) */}
        <div className="nav-actions">
          {/* Ícone do Carrinho com Badge */}
          <div
            className="nav-cart-wrapper"
            onClick={() => navigate("/cart")}
            title="Ver carrinho"
          >
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="nav-cart-badge">{cartCount}</span>
            )}
          </div>

          {/* Lógica de Login/Logout */}
          {isLoggedIn ? (
            <div className="user-logged-area">
              <div className="user-info">
                <User size={20} />
                <span>
                  Olá, <strong>{userName?.split(" ")[0]}</strong>
                </span>
              </div>
              <button
                className="logout-btn"
                onClick={handleLogout}
                title="Sair"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="nav-auth-buttons">
              <button
                type="button"
                className="login-btn"
                onClick={() => navigate("/login")}
              >
                <span>Entrar</span>
              </button>
              <button
                type="button"
                className="signup-btn-nav"
                onClick={() => navigate("/signup")}
              >
                <span>Criar Conta</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
