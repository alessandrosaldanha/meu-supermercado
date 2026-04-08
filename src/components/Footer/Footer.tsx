import {
  LuStore,
  LuMail,
  LuPhone,
  LuMapPin,
  LuInstagram,
  LuFacebook,
} from "react-icons/lu";
import "./Footer.css";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Coluna 1: Logo e Sobre */}
        <div className="footer-column">
          <div className="footer-logo">
            {/* Note que o nome mudou de Store para LuStore */}
            <LuStore size={24} color="var(--primary)" />
            <span>
              Mercado <strong>Vital</strong>
            </span>
          </div>
          <p className="footer-description">
            O seu supermercado online em Maceió. Qualidade, preço baixo e a
            comodidade de receber tudo em casa.
          </p>
          <div className="footer-social">
            <LuInstagram size={20} />
            <LuFacebook size={20} />
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
              <LuPhone size={16} /> (82) 9999-9999
            </li>
            <li>
              <LuMail size={16} /> contato@mercadovital.com
            </li>
            <li>
              <LuMapPin size={16} /> Maceió, Alagoas
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
