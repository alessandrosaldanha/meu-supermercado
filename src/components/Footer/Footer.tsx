import { Store, Mail, Phone, MapPin } from "lucide-react";
// lucide-react não inclui logos de marca; usa react-icons só para essas duas.
import { LuInstagram, LuFacebook } from "react-icons/lu";
import { Link } from "react-router-dom";
import "./Footer.css";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column footer-brand">
          <div className="footer-logo">
            <Store size={24} color="var(--papaya)" />
            <span>
              Mercado <strong>Vital</strong>
            </span>
          </div>
          <p className="footer-description">
            Supermercado online em Maceió e região metropolitana. Peça até as
            18h e receba no mesmo dia.
          </p>
          <div className="footer-social">
            <a
              href="https://www.instagram.com/alessandrosaldanha.as/"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LuInstagram size={19} />
            </a>
            <a
              href="https://www.facebook.com/alessandro.saldanha.2025?locale=pt_BR"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LuFacebook size={19} />
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h3>Comprar</h3>
          <ul>
            <li>
              <Link to="/">Início</Link>
            </li>
            <li>
              <Link to="/products">Todos os produtos</Link>
            </li>
            <li>
              <Link to="/cart">Meu carrinho</Link>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Sua conta</h3>
          <ul>
            <li>
              <Link to="/orders">Meus pedidos</Link>
            </li>
            <li>
              <Link to="/perfil">Endereço de entrega</Link>
            </li>
            <li>
              <Link to="/signup">Criar conta</Link>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Contato</h3>
          <ul className="contact-list">
            <li>
              <Phone size={15} /> (82) 98127-3619
            </li>
            <li>
              <Mail size={15} /> alessandrosaldanha.as@gmail.com
            </li>
            <li>
              <MapPin size={15} /> Maceió, Alagoas
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Mercado Vital — todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
