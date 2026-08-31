import { Link } from "react-router-dom";
import { FeaturedSlider } from "../../components/FeaturedSlider/FeaturedSlider";
import { Stamp } from "../../components/Stamp/Stamp";
import "./Home.css";

export default function Home() {
  const today = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });

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
              Fruta, verdura e mercearia selecionadas nesta manhã. Peça até
              18h e receba ainda hoje.
            </p>
            <Link to="/products" className="hero-cta">
              Ver todos os produtos
            </Link>
          </div>
          <div className="hero-stamp">
            <Stamp
              variant="seal"
              tone="stamp"
              top="Colhido hoje"
              label={today}
              bottom="Mercado Vital · AL"
            />
          </div>
        </div>
      </section>

      <section className="product-section">
        <FeaturedSlider />
      </section>
    </div>
  );
}
