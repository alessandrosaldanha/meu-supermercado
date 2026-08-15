# Arquitetura

## Estrutura de pastas

```
src/
├── App.tsx              # BrowserRouter + todas as rotas + ProtectedAdminRoute (inline)
├── App.css              # Layout de shell (.main-content, .admin-container, ...)
├── main.tsx              # Entry point (StrictMode)
├── index.css             # Reset global + design tokens (CSS custom properties)
│
├── components/           # Peças de UI reutilizáveis (uma pasta por componente, .tsx + .css)
│   ├── Buttons/           # Button genérico (variant: primary|secondary|danger|icon)
│   ├── Checkout/          # Wizard de checkout de 3 passos — nota: fica em components/, não pages/
│   ├── CommentItems/      # Item recursivo de review/resposta (usado no ProductDetail)
│   ├── FeaturedSlider/    # Carrossel Swiper de produtos em destaque (Home)
│   ├── Footer/
│   ├── Navbar/            # Lê localStorage para estado de auth/role, badge do carrinho, logout
│   ├── ProductCard/       # Card de produto (grid + slider)
│   ├── ProtectedRoute/    # Guard de rota (baseado em token)
│   └── Toasts/            # Toast puramente apresentacional (sem context — ver auth-e-estado.md)
│
├── context/
│   └── CartContext.tsx    # Único context da aplicação — estado do carrinho
│
├── pages/                 # Views de rota (uma pasta por página, .tsx + .css)
│   ├── Cart/
│   ├── Home/               # Lista produtos + paginação (única paginação do app)
│   ├── Login/
│   ├── Orders/
│   ├── ProductDetail/
│   ├── Profile/
│   └── Signup/
│
└── services/
    └── api.ts             # Único módulo de API: instância axios + interceptors + interfaces + endpoints
```

Não existem pastas `hooks/`, `types/`, `utils/` ou `assets/`. Todos os tipos compartilhados (`Product`, `User`, `Review`, `PaginatedResponse`) vivem em `src/services/api.ts` — ver [api.md](api.md).

## Roteamento (`src/App.tsx`)

`react-router-dom` v7. `BrowserRouter` envolve tudo dentro de `CartProvider`. `Navbar` e `Footer` ficam fora de `<Routes>` (persistem em todas as páginas); o conteúdo roteado fica em `<div className="main-content">`.

| Rota | Componente | Proteção |
|---|---|---|
| `/` | `Home` | pública |
| `/login` | `Login` | pública |
| `/signup` | `Signup` | pública |
| `/cart` | `Cart` | pública |
| `/product/:id` | `ProductDetail` | pública |
| `/perfil` | `Profile` | protegida (`ProtectedRoute`) |
| `/checkout` | `Checkout` (de `components/Checkout`) | protegida (`ProtectedRoute`) |
| `/orders` | `Orders` | protegida (`ProtectedRoute`) |
| `/admin/users` | placeholder inline (`<h1>Gestão de Usuários</h1>`) | protegida, admin-only (`ProtectedAdminRoute`) |
| `*` | redirect para `/` | — |

> `Navbar` linka para `/products` (plural), rota que não existe — link morto. A listagem de produtos é em `/`.

Dois mecanismos de guard distintos, sem hook/context compartilhado:

```tsx
// src/components/ProtectedRoute/ProtectedRoute.tsx
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
```

```tsx
// src/App.tsx — inline, não é um componente próprio em components/
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const userRole = localStorage.getItem("userRole");
  const isPrivileged = userRole === "master" || userRole === "admin";
  return isPrivileged ? <>{children}</> : <Navigate to="/" replace />;
};
```

Ambos são leituras síncronas de `localStorage` — só reavaliam no mount/navegação, não reativamente.

## Paginação

Não há componente de paginação dedicado — a lógica fica inline em `src/pages/Home/Home.tsx`, único lugar do app com paginação.

- `getProducts(page)` chama `GET products?page=&per_page=10`, retorna `PaginatedResponse` (`items`, `curPage`, `nextPage`, `prevPage`, `pageTotal`, ...).
- Estado local: `page`, `products`, `hasNextPage`, `totalPages`.
- Controles: primeira página (`<<`), "Anterior" (desabilitado na página 1), indicador `Página X de Y`, "Próxima" (desabilitado sem `hasNextPage`), última página (`>>` — **não desabilita** mesmo já estando na última página).
- `FeaturedSlider` busca todos os destaques de uma vez (`getFeaturedProducts`), sem paginação — apenas carrossel Swiper.

## Estilização

CSS puro por componente, sem CSS Modules, Tailwind ou styled-components. Cada pasta de componente/página tem um `Nome.css` importado como side-effect (`import "./Toast.css"`).

- Design tokens globais em `src/index.css` (`:root`) — paleta temática "Feira Livre": `--forest`, `--leaf`, `--paper`, `--card`, `--papaya`, `--stamp`, `--ink`, `--ink-soft`, `--line`, com aliases de compatibilidade (`--primary`, `--secondary`, `--background`, `--white`, `--error`) para componentes ainda não migrados. Fontes: `--font-display` (Archivo Black), `--font-main` (Work Sans), `--font-mono` (Space Mono), carregadas via `@import` do Google Fonts.
- Ícones: `lucide-react` na maioria dos componentes, `react-icons/lu` só no Footer.
- Swiper importa seu próprio CSS em `FeaturedSlider.tsx`.
