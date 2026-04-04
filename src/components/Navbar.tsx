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
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import "./Navbar.css";

export function Navbar() {
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ESTADOS PARA REATIVIDADE
  const [displayName, setDisplayName] = useState("Usuário");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // FUNÇÃO DE ATUALIZAÇÃO (Centralizada para ser chamada em vários lugares)
  const updateNavbar = () => {
    const savedToken = localStorage.getItem("token");
    const savedName = localStorage.getItem("userName");
    const savedRole = localStorage.getItem("userRole");

    setToken(savedToken);
    setUserRole(savedRole);

    // Se houver um nome salvo e não for a string "undefined" ou "null"
    if (savedName && savedName !== "undefined" && savedName !== "null") {
      setDisplayName(savedName);
    } else {
      setDisplayName("Usuário");
    }
  };

  useEffect(() => {
    // 1. Atualiza ao carregar o componente
    updateNavbar();

    // 2. ESCUTA O EVENTO 'storage' (O segredo para atualizar no momento do login)
    window.addEventListener("storage", updateNavbar);

    // Limpeza ao desmontar
    return () => window.removeEventListener("storage", updateNavbar);
  }, [navigate]); // Também re-executa ao navegar entre páginas

  const isLoggedIn = !!token;
  const isMaster = userRole === "master";
  const isPrivileged = userRole === "master" || userRole === "admin";

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setDisplayName("Usuário");
    setUserRole(null);
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

        {/* MENU LATERAL / MOBILE */}
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

          {/* MENU ADMIN */}
          {isPrivileged && (
            <li onClick={closeMenu} className="admin-menu-item">
              <Link
                to="/admin/users"
                style={{ color: "var(--primary)", fontWeight: "bold" }}
              >
                <ShieldCheck size={18} />{" "}
                {isMaster ? "Gestão Master" : "Painel Admin"}
              </Link>
            </li>
          )}

          {/* AREA DE AUTH NO MOBILE (Dentro de um <li> para evitar erro de HTML) */}
          <li className="mobile-auth-wrapper">
            {!isLoggedIn ? (
              <div className="mobile-auth-container">
                <button
                  className="login-btn-mobile"
                  onClick={() => {
                    navigate("/login");
                    closeMenu();
                  }}
                >
                  Entrar
                </button>
                <button
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
                  <span>Olá, {displayName}</span>
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
          </li>
        </ul>

        {/* AÇÕES DA DIREITA (DESKTOP) */}
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
                <User size={20} />
                <span className="user-name-text">
                  Olá, <strong>{displayName}</strong>
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
