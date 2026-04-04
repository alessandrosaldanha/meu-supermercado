import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Store,
  ShoppingCart,
  User,
  Package,
  Home,
  LogOut,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import "./Navbar.css";

export function Navbar() {
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    alert("Você saiu da plataforma. Até logo!");
    navigate("/login");
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* ÍCONE MENU MOBILE */}
        <button
          type="button"
          className="mobile-menu-icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Abrir menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* LOGO */}
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <Store size={28} color="var(--primary)" />
          <span>
            Mercado <span className="logo-bold">Vital</span>
          </span>
        </Link>

        {/* MENU LATERAL (DESLIZANTE NO MOBILE) */}
        <ul className={isMenuOpen ? "nav-menu active" : "nav-menu"}>
          <li onClick={closeMenu}>
            <Link to="/">
              <Home size={18} /> Início
            </Link>
          </li>
          <li onClick={closeMenu}>
            <Link to="/products">
              <Package size={18} /> Produtos
            </Link>
          </li>
          <li onClick={closeMenu}>
            <Link to="/orders">
              <Package size={18} /> Meus Pedidos
            </Link>
          </li>

          {/* ÁREA DE AUTH DENTRO DO MENU MOBILE */}
          {!isLoggedIn ? (
            <div className="mobile-auth-container">
              <button
                type="button"
                className="login-btn-mobile"
                onClick={() => {
                  navigate("/login");
                  closeMenu();
                }}
              >
                Entrar
              </button>
              <button
                type="button"
                className="signup-btn-mobile"
                onClick={() => {
                  navigate("/signup");
                  closeMenu();
                }}
              >
                Criar Conta
              </button>
            </div>
          ) : (
            <div className="mobile-auth-container">
              <div className="user-info-mobile">
                <User size={20} />
                <span>Olá, {userName?.split(" ")[0]}</span>
              </div>
              <button
                type="button"
                className="logout-btn-mobile"
                onClick={handleLogout}
              >
                <LogOut size={18} /> Sair da conta
              </button>
            </div>
          )}
        </ul>

        {/* AÇÕES DA DIREITA (CARRINHO E AUTH DESKTOP) */}
        <div className="nav-actions">
          <div
            className="nav-cart-wrapper"
            onClick={() => {
              navigate("/cart");
              closeMenu();
            }}
            title="Ver carrinho"
          >
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="nav-cart-badge">{cartCount}</span>
            )}
          </div>

          <div className="desktop-auth-area">
            {isLoggedIn ? (
              <div className="user-logged-area">
                <User size={20} />
                <span className="user-name-text">
                  Olá, <strong>{userName?.split(" ")[0]}</strong>
                </span>
                <button
                  type="button"
                  className="logout-btn-icon"
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
                  className="login-btn-nav"
                  onClick={() => navigate("/login")}
                >
                  Entrar
                </button>
                <button
                  type="button"
                  className="signup-btn-nav"
                  onClick={() => navigate("/signup")}
                >
                  Criar Conta
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
