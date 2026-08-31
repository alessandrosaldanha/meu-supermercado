import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Store,
  ShoppingCart,
  User,
  MapPin,
  Search,
  LogOut,
  ShieldCheck,
  LayoutGrid,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { useState, useEffect, useCallback, type FormEvent } from "react";
import "./Navbar.css";

const DEPARTAMENTOS = [
  "Hortifrúti",
  "Açougue e peixaria",
  "Padaria",
  "Laticínios",
  "Mercearia",
  "Bebidas",
  "Limpeza",
  "Higiene",
];

export function Navbar() {
  const { showToast } = useToast();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [displayName, setDisplayName] = useState("Usuário");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [endereco, setEndereco] = useState<string | null>(null);
  const [busca, setBusca] = useState("");

  const updateNavbar = useCallback(() => {
    const savedToken = localStorage.getItem("token");
    const savedName = localStorage.getItem("userName");
    const savedRole = localStorage.getItem("userRole");
    const savedUser = localStorage.getItem("user");

    setToken(savedToken);
    setUserRole(savedRole);

    let userObj: { name?: string; bairro?: string; cep?: string } | null = null;
    if (savedUser) {
      try {
        userObj = JSON.parse(savedUser);
      } catch {
        userObj = null;
      }
    }

    if (
      savedToken &&
      savedName &&
      savedName !== "undefined" &&
      savedName !== "null" &&
      savedName !== "Usuário"
    ) {
      setDisplayName(savedName);
    } else if (savedToken && userObj?.name) {
      setDisplayName(userObj.name);
    } else {
      setDisplayName("Usuário");
    }

    if (savedToken && (userObj?.bairro || userObj?.cep)) {
      setEndereco(
        [userObj.bairro, userObj.cep].filter(Boolean).join(" · ") || null,
      );
    } else {
      setEndereco(null);
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

    showToast("Até logo! Você saiu com segurança.", "info");

    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const termo = busca.trim();
    navigate(termo ? `/products?busca=${encodeURIComponent(termo)}` : "/products");
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="navbar">
      <div className="nav-utility">
        <div className="nav-utility-inner">
          <span className="nav-utility-claim">
            Entregamos em Maceió e região — peça até 18h e recebe hoje
          </span>
          <div className="nav-utility-links">
            <Link to="/orders">Acompanhar pedido</Link>
            <Link to="/perfil">Minha conta</Link>
          </div>
        </div>
      </div>

      <div className="nav-main">
        <div className="nav-main-inner">
          <button
            type="button"
            className="mobile-menu-icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Abrir menu"
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          <Link to="/" className="nav-logo" onClick={closeMenu}>
            <Store size={28} color="var(--papaya)" />
            <span>
              Mercado <span className="logo-bold">Vital</span>
            </span>
          </Link>

          <form className="nav-search" onSubmit={handleSearch} role="search">
            <input
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar arroz, tomate, detergente..."
              aria-label="Buscar produtos"
            />
            <button type="submit" aria-label="Buscar">
              <Search size={19} />
            </button>
          </form>

          <div className="nav-actions">
            <Link to="/perfil" className="nav-address" onClick={closeMenu}>
              <MapPin size={19} color="var(--papaya)" />
              <span className="nav-stack">
                <small>Entregar em</small>
                <strong>{endereco ?? "Informe seu CEP"}</strong>
              </span>
            </Link>

            {isLoggedIn ? (
              <div className="nav-account">
                <Link to="/perfil" className="nav-stack" title="Meu perfil">
                  <small>Olá, {displayName}</small>
                  <strong>Conta e pedidos</strong>
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
                  Criar conta
                </button>
              </div>
            )}

            <Link to="/cart" className="nav-cart-wrapper" onClick={closeMenu}>
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="nav-cart-badge">{cartCount}</span>
              )}
            </Link>
          </div>
        </div>
      </div>

      <nav className={isMenuOpen ? "nav-departments open" : "nav-departments"}>
        <div className="nav-departments-inner">
          <span className="nav-dep-title">
            <LayoutGrid size={15} /> Departamentos
          </span>
          <span className="nav-dep-divider" />
          <ul>
            <li className="only-mobile">
              <Link to="/" onClick={closeMenu}>
                Início
              </Link>
            </li>
            <li className="only-mobile">
              <Link to="/products" onClick={closeMenu}>
                Todos os produtos
              </Link>
            </li>
            {DEPARTAMENTOS.map((dep) => (
              <li key={dep}>
                <Link
                  to={`/products?busca=${encodeURIComponent(dep)}`}
                  onClick={closeMenu}
                >
                  {dep}
                </Link>
              </li>
            ))}
            <li className="only-mobile">
              <Link to="/orders" onClick={closeMenu}>
                Meus pedidos
              </Link>
            </li>
            {isPrivileged && (
              <li>
                <Link
                  to="/admin/users"
                  className="admin-menu-link"
                  onClick={closeMenu}
                >
                  <ShieldCheck size={14} /> Painel admin
                </Link>
              </li>
            )}
            {isLoggedIn && (
              <li className="only-mobile">
                <button
                  type="button"
                  className="logout-btn-mobile"
                  onClick={handleLogout}
                >
                  <LogOut size={16} /> Sair
                </button>
              </li>
            )}
            {!isLoggedIn && (
              <li className="only-mobile">
                <Link to="/login" onClick={closeMenu}>
                  <User size={16} /> Entrar
                </Link>
              </li>
            )}
          </ul>
          <Link to="/products" className="nav-dep-offers">
            Todos os produtos
          </Link>
        </div>
      </nav>
    </header>
  );
}
