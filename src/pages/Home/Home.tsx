import { Link } from "react-router-dom";
import {
  Truck,
  CreditCard,
  Clock,
  Sprout,
  Beef,
  Croissant,
  Milk,
  ShoppingBasket,
  CupSoda,
  SprayCan,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { FeaturedSlider } from "../../components/FeaturedSlider/FeaturedSlider";
import "./Home.css";

const DEPARTAMENTOS = [
  { nome: "Hortifrúti", Icone: Sprout },
  { nome: "Açougue", Icone: Beef },
  { nome: "Padaria", Icone: Croissant },
  { nome: "Laticínios", Icone: Milk },
  { nome: "Mercearia", Icone: ShoppingBasket },
  { nome: "Bebidas", Icone: CupSoda },
  { nome: "Limpeza", Icone: SprayCan },
  { nome: "Higiene", Icone: Sparkles },
];

export default function Home() {
  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="hero-eyebrow">Mercado de bairro, em Maceió</p>
            <h1 className="hero-title">
              O que colhemos hoje, direto pra sua casa.
            </h1>
            <p className="hero-sub">
              Fruta, verdura e mercearia selecionadas nesta manhã. Peça até 18h
              e receba ainda hoje.
            </p>
            <Link to="/products" className="hero-cta">
              Ver todos os produtos <ArrowRight size={16} />
            </Link>
          </div>

          <aside className="hero-side">
            <div className="hero-card">
              <strong>Pague na entrega</strong>
              <span>
                Pix, cartão na maquininha ou dinheiro, quando o pedido chegar.
              </span>
            </div>
            <div className="hero-card">
              <strong>Entrega no mesmo dia</strong>
              <span>
                Pedidos confirmados até as 18h chegam até o fim do dia.
              </span>
            </div>
          </aside>
        </div>
      </section>

      <nav className="dep-shortcuts" aria-label="Departamentos">
        {DEPARTAMENTOS.map(({ nome, Icone }) => (
          <Link
            key={nome}
            to={`/products?busca=${encodeURIComponent(nome)}`}
            className="dep-shortcut"
          >
            <Icone size={28} strokeWidth={1.7} />
            <span>{nome}</span>
          </Link>
        ))}
      </nav>

      <section className="product-section">
        <FeaturedSlider />
      </section>

      <section className="value-props">
        <div className="value-prop">
          <Truck size={24} strokeWidth={1.8} />
          <div>
            <strong>Entrega no mesmo dia</strong>
            <span>Pedidos até as 18h</span>
          </div>
        </div>
        <div className="value-prop">
          <CreditCard size={24} strokeWidth={1.8} />
          <div>
            <strong>Pix, cartão ou na entrega</strong>
            <span>5% de desconto no Pix</span>
          </div>
        </div>
        <div className="value-prop">
          <Clock size={24} strokeWidth={1.8} />
          <div>
            <strong>Acompanhe seu pedido</strong>
            <span>Do pendente ao entregue</span>
          </div>
        </div>
      </section>
    </div>
  );
}
