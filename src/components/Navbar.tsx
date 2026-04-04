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
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para abrir/fechar o menu mobile

  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    alert("Você saiu da plataforma. Até logo!");
    navigate("/login");
  };

  // Função para fechar o menu ao clicar em um link
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* BOTÃO HAMBÚRGUER (Aparece só no mobile via CSS) */}
        <button
          className="mobile-menu-icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
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

        {/* LINKS DE NAVEGAÇÃO - Classe dinâmica para abrir no mobile */}
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

          {/* Opções de Login dentro do menu mobile (para facilitar a UX) */}
          {!isLoggedIn && (
            <li className="mobile-only-auth" onClick={closeMenu}>
              <Link to="/login">Entrar / Criar Conta</Link>
            </li>
          )}
        </ul>

        {/* AÇÕES (CARRINHO E USUÁRIO) */}
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

          {isLoggedIn ? (
            <div className="user-logged-area">
              <div className="user-info">
                <User size={20} />
                <span className="user-name-desktop">
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
