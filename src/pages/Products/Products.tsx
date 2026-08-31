import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronRight, X } from "lucide-react";
import { ProductCard } from "../../components/ProductCard/ProductCard";
import { getProducts, type Product } from "../../services/api";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import "./Products.css";

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

type Ordem = "relevancia" | "menor-preco" | "maior-preco" | "nome";

const ORDENS: { valor: Ordem; rotulo: string }[] = [
  { valor: "relevancia", rotulo: "Mais relevantes" },
  { valor: "menor-preco", rotulo: "Menor preço" },
  { valor: "maior-preco", rotulo: "Maior preço" },
  { valor: "nome", rotulo: "Nome (A-Z)" },
];

/** Constrói a régua de páginas: 1 … n-1 n n+1 … total */
function montarPaginas(atual: number, total: number): (number | "gap")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const paginas = new Set<number>([1, total, atual]);
  if (atual - 1 > 1) paginas.add(atual - 1);
  if (atual + 1 < total) paginas.add(atual + 1);

  const ordenadas = [...paginas].sort((a, b) => a - b);
  const resultado: (number | "gap")[] = [];
  ordenadas.forEach((p, i) => {
    if (i > 0 && p - ordenadas[i - 1] > 1) resultado.push("gap");
    resultado.push(p);
  });
  return resultado;
}

export default function Products() {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const busca = searchParams.get("busca") ?? "";

  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [animatingId, setAnimatingId] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [ordem, setOrdem] = useState<Ordem>("relevancia");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getProducts(page);

      if (data) {
        setProducts(data.items || []);
        setTotalPages(data.pageTotal || 1);
      }
      setLoading(false);
    };
    load();
  }, [page]);

  // Ajusta o estado durante a renderização em vez de num efeito: trocar a
  // busca volta para a primeira página sem disparar uma renderização extra.
  const [buscaAnterior, setBuscaAnterior] = useState(busca);
  if (busca !== buscaAnterior) {
    setBuscaAnterior(busca);
    setPage(1);
  }

  const visiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    const filtrados = termo
      ? products.filter((p) =>
          [p.name, p.description, p.category]
            .filter(Boolean)
            .some((campo) => campo.toLowerCase().includes(termo)),
        )
      : products;

    const ordenados = [...filtrados];
    if (ordem === "menor-preco") ordenados.sort((a, b) => a.price - b.price);
    if (ordem === "maior-preco") ordenados.sort((a, b) => b.price - a.price);
    if (ordem === "nome")
      ordenados.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    return ordenados;
  }, [products, busca, ordem]);

  const handleAddProduct = (product: Product) => {
    addToCart(product);
    setAnimatingId(product.id);
    showToast("Produto adicionado ao carrinho!", "success");
    setTimeout(() => setAnimatingId(null), 300);
  };

  const limparBusca = () => setSearchParams({});

  return (
    <div className="products-page">
      <nav className="breadcrumb" aria-label="Você está em">
        <Link to="/">Início</Link>
        <ChevronRight size={12} />
        <span>Todos os produtos</span>
        {busca && (
          <>
            <ChevronRight size={12} />
            <span className="breadcrumb-current">{busca}</span>
          </>
        )}
      </nav>

      <div className="catalog">
        <aside className="catalog-sidebar">
          <div className="filter-block">
            <h2>Departamentos</h2>
            <ul>
              {DEPARTAMENTOS.map((dep) => (
                <li key={dep}>
                  <Link
                    to={`/products?busca=${encodeURIComponent(dep)}`}
                    className={
                      busca.toLowerCase() === dep.toLowerCase() ? "ativo" : ""
                    }
                  >
                    {dep}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-block">
            <h2>Entrega</h2>
            <p className="filter-note">
              Entregamos em Maceió e região. Pedidos confirmados até as 18h
              chegam no mesmo dia.
            </p>
          </div>
        </aside>

        <section className="catalog-results">
          <div className="results-bar">
            <p className="results-count">
              {loading ? (
                "Carregando produtos..."
              ) : (
                <>
                  <strong>{visiveis.length}</strong>
                  {busca ? " produtos encontrados" : " produtos nesta página"}
                  {totalPages > 1 && (
                    <span className="results-page">
                      {" "}
                      · página {page} de {totalPages}
                    </span>
                  )}
                </>
              )}
            </p>

            <label className="sort-control">
              <span>Ordenar por</span>
              <select
                value={ordem}
                onChange={(e) => setOrdem(e.target.value as Ordem)}
              >
                {ORDENS.map((o) => (
                  <option key={o.valor} value={o.valor}>
                    {o.rotulo}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {busca && (
            <div className="active-filters">
              <button type="button" className="filter-chip" onClick={limparBusca}>
                {busca} <X size={12} />
              </button>
              <span className="filter-hint">
                Filtrando os produtos desta página
              </span>
            </div>
          )}

          {loading ? (
            <div className="loader">Carregando...</div>
          ) : visiveis.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum produto encontrado nesta página.</p>
              {busca && (
                <button type="button" onClick={limparBusca}>
                  Limpar busca
                </button>
              )}
            </div>
          ) : (
            <div className="product-grid">
              {visiveis.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={handleAddProduct}
                  isAnimating={animatingId === product.id}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav className="pagination" aria-label="Paginação">
              <button
                type="button"
                className="page-btn"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Anterior
              </button>

              {montarPaginas(page, totalPages).map((item, i) =>
                item === "gap" ? (
                  <span key={`gap-${i}`} className="page-gap">
                    …
                  </span>
                ) : (
                  <button
                    type="button"
                    key={item}
                    className={`page-num ${item === page ? "atual" : ""}`}
                    aria-current={item === page ? "page" : undefined}
                    onClick={() => setPage(item)}
                  >
                    {item}
                  </button>
                ),
              )}

              <button
                type="button"
                className="page-btn destaque"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Próxima
              </button>
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}
