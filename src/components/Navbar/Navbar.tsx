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
  ShieldCheck,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { Stamp } from "../Stamp/Stamp";
import { useState, useEffect, useCallback } from "react";
import "./Navbar.css";

export function Navbar() {
  const { showToast } = useToast();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [displayName, setDisplayName] = useState("Usuário");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const updateNavbar = useCallback(() => {
    const savedToken = localStorage.getItem("token");
    const savedName = localStorage.getItem("userName");
    const savedRole = localStorage.getItem("userRole");
    const savedUser = localStorage.getItem("user");

    setToken(savedToken);
    setUserRole(savedRole);

    if (
      savedToken &&
      savedName &&
      savedName !== "undefined" &&
      savedName !== "null" &&
      savedName !== "Usuário"
    ) {
      setDisplayName(savedName);
    } else if (savedToken && savedUser) {
      try {
        const userObj = JSON.parse(savedUser);
        setDisplayName(userObj.name || "Usuário");
      } catch {
        setDisplayName("Usuário");
      }
    } else {
      setDisplayName("Usuário");
    }
  }, []);

  useEffect(() => {
    updateNavbar();
    window.addEventListener("storage", updateNavbar);
    window.addEventListener("focus", updateNavbar);
    return () => {
      window.removeEventListener("storage", updateNavbar);
      window.removeEventListener("focus", updateNavbar);
    };
  }, [updateNavbar]);

  const isLoggedIn = !!token;
  const isPrivileged = userRole === "master" || userRole === "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");

    window.dispatchEvent(new Event("storage"));

    showToast("👋 Até logo! Você saiu com segurança.", "info");

    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <button
          type="button"
          className="mobile-menu-icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <Store size={26} color="var(--papaya)" />
          <span>
            Mercado <span className="logo-bold">Vital</span>
          </span>
        </Link>

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

          {isPrivileged && (
            <li onClick={closeMenu} className="admin-menu-item">
              <Link to="/admin/users" className="admin-menu-link">
                <Stamp variant="tag" tone="papaya">
                  <ShieldCheck size={14} /> Painel Admin
                </Stamp>
              </Link>
            </li>
          )}

          <li className="mobile-auth-wrapper">
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
                <div
                  className="user-info-mobile"
                  onClick={() => {
                    navigate("/perfil");
                    closeMenu();
                  }}
                >
                  <User size={20} />
                  <span>{displayName}</span>
                </div>
                <button
                  type="button"
                  className="logout-btn-mobile"
                  onClick={handleLogout}
                >
                  <LogOut size={18} /> Sair
                </button>
              </div>
            )}
          </li>
        </ul>

        <div className="nav-actions">
          <div
            className="nav-cart-wrapper"
            onClick={() => {
              navigate("/cart");
              closeMenu();
            }}
          >
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="nav-cart-badge">{cartCount}</span>
            )}
          </div>

          <div className="desktop-auth-area">
            {isLoggedIn ? (
              <div className="user-logged-area">
                <Link
                  to="/perfil"
                  className="user-profile-link"
                  title="Ir para meu perfil"
                >
                  <User size={20} />
                  <span className="user-name-text">
                    Olá, <strong>{displayName}</strong>
                  </span>
                </Link>

                <button
                  type="button"
                  className="logout-btn-icon"
                  onClick={handleLogout}
                  title="Sair da conta"
                  aria-label="Sair da conta"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="nav-auth-buttons">
                <button
                  className="login-btn-nav"
                  onClick={() => navigate("/login")}
                >
                  Entrar
                </button>
                <button
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
