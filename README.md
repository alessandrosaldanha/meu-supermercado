# Mercado Vital

Frontend de e-commerce para supermercado com entrega em Maceió/AL. React + TypeScript + Vite, consumindo uma API Xano (no-code) via REST.

## Tecnologias

- React 19 + TypeScript
- Vite 8
- React Router DOM 7
- Axios
- Swiper (carrossel de produtos em destaque)
- lucide-react / react-icons

## Pré-requisitos

- Node.js 18+
- Uma URL de API Xano válida (ou outra API compatível com os endpoints usados — ver `src/services/api.ts`)

## Configuração

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie um arquivo `.env` na raiz do projeto com a URL da API:

   ```
   VITE_API_URL=https://sua-instancia.xano.io/api:xxxxxxxx/
   ```

3. Rode o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

   O app fica disponível em `http://localhost:5173`.

## Scripts disponíveis

```bash
npm run dev       # servidor de desenvolvimento (Vite)
npm run build     # type-check (tsc -b) + build de produção
npm run lint      # ESLint
npm run preview   # preview local do build de produção
```

Não há framework de testes configurado neste projeto no momento.

## Funcionalidades

- Catálogo de produtos com paginação e destaques em carrossel
- Página de detalhe de produto com avaliações (reviews aninhadas)
- Carrinho de compras
- Cadastro/login de usuário
- Checkout em 3 passos (entrega, pagamento, revisão) com Pix, cartão (simulado) ou pagamento na entrega
- Histórico de pedidos
- Perfil do usuário com busca automática de endereço por CEP (ViaCEP)
- Área administrativa protegida por role (`/admin/users`)

## Estrutura do projeto

```
src/
├── components/   # UI reutilizável (Navbar, Footer, ProductCard, Checkout, Toasts, ...)
├── context/      # CartContext (carrinho de compras)
├── pages/        # Páginas roteadas (Home, Login, Signup, Cart, Orders, Profile, ProductDetail)
└── services/     # Camada de API (axios + endpoints)
```

Para detalhes de arquitetura, autenticação e decisões de implementação, veja a pasta [docs/](docs/):

- [docs/architecture.md](docs/architecture.md) — estrutura de pastas, rotas, paginação, estilização
- [docs/auth-e-estado.md](docs/auth-e-estado.md) — autenticação, carrinho e gerenciamento de estado
- [docs/api.md](docs/api.md) — endpoints da API e fluxo de checkout
- [docs/known-issues.md](docs/known-issues.md) — inconsistências e dívidas técnicas conhecidas
