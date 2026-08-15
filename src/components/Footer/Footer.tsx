import { Store, Mail, Phone, MapPin } from "lucide-react";
// lucide-react não inclui logos de marca; usa react-icons só para essas duas.
import { LuInstagram, LuFacebook } from "react-icons/lu";
import "./Footer.css";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Coluna 1: Logo e Sobre */}
        <div className="footer-column">
          <div className="footer-logo">
            <Store size={24} color="var(--papaya)" />
            <span>
              Mercado <strong>Vital</strong>
            </span>
          </div>
          <p className="footer-description">
            O seu supermercado online em Maceió. Qualidade, preço baixo e a
            comodidade de receber tudo em casa.
          </p>
          <div className="footer-social">
            <a
              href="https://www.instagram.com/alessandrosaldanha.as/"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LuInstagram size={20} />
            </a>

            <a
              href="https://www.facebook.com/alessandro.saldanha.2025?locale=pt_BR"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LuFacebook size={20} />
            </a>
          </div>
        </div>

        {/* Coluna 2: Links Rápidos */}
        <div className="footer-column">
          <h3>Navegação</h3>
          <ul>
            <li>
              <a href="/">Início</a>
            </li>
            <li>
              <a href="/products">Produtos</a>
            </li>
            <li>
              <a href="/signup">Criar Conta</a>
            </li>
          </ul>
        </div>

        {/* Coluna 3: Contato */}
        <div className="footer-column">
          <h3>Contato</h3>
          <ul className="contact-list">
            <li>
              <Phone size={16} /> (82) 98127-3619
            </li>
            <li>
              <Mail size={16} /> alessandrosaldanha.as@gmail.com
            </li>
            <li>
              <MapPin size={16} /> Maceió, Alagoas
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {currentYear} Mercado Vital - Todos os direitos reservados.
        </p>
        <p>Desenvolvido com 💚 por Vital</p>
      </div>
    </footer>
  );
}
