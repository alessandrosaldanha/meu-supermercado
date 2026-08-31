# Camada de API

## Backend

Xano (no-code backend). URL base configurada em `.env` (gitignored, não versionado):

```
VITE_API_URL=https://x8ki-letl-twmt.n7.xano.io/api:28B-MVDq/
```

Usada uma única vez, em `src/services/api.ts:3` (`import.meta.env.VITE_API_URL`). Não existe `.env.example` no repo — considerar adicionar um para facilitar onboarding.

## `src/services/api.ts`

Arquivo único, sem outros módulos em `services/`. Instância axios:

```ts
const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});
```

- Request interceptor: injeta `Authorization: Bearer <token>` do localStorage.
- Response interceptor: trata 401 globalmente (limpa sessão e redireciona) — ver [auth-e-estado.md](auth-e-estado.md).

**Interfaces exportadas** (únicos tipos compartilhados do projeto — não há pasta `types/`): `PaginatedResponse`, `User`, `Review`, `Product`.

**Funções exportadas:**

| Função | Endpoint | Observação |
|---|---|---|
| `getProducts(page)` | `GET products?page=&per_page=10` | Nunca lança erro — em falha retorna `PaginatedResponse` vazio válido |
| `loginUser(email, password)` | `POST auth/login` | |
| `getFeaturedProducts()` | `GET featured` | Desembrulha `data.items \|\| data` defensivamente |
| `getProductById(id)` | `GET products/{id}` | |
| `postReview(productId, rating, comment, parentId, userId)` | `POST reviews` | Pega `user_name` do `user` salvo em localStorage |
| `updateUserProfile(userId, data)` | `PATCH user/{userId}` | **Exportada mas não usada** — `Profile.tsx` faz seu próprio `api.patch` inline em vez de importar esta função |

`export default api` também expõe a instância axios crua para chamadas ad-hoc.

## Chamadas que NÃO passam por `services/api.ts`

Checkout, Orders, Profile (GET) e Signup implementam suas próprias chamadas inline em vez de usar a camada de serviços:

- **Orders**: `Checkout.tsx` → `api.post("/orders", orderData)` inline. `Orders.tsx` → `api.get(\`/orders?user_id=${savedUser.id}\`)` inline. Não existe `createOrder`/`getOrders` em `api.ts`, e não há interface `Order` compartilhada (está declarada localmente dentro de `Orders.tsx`, com `items: any[]`, e nem é reaproveitada pelo `Checkout.tsx`).
- **Profile**: `Profile.tsx` faz `api.get(\`user/${userId}\`)` e `api.patch(\`user/${userData.id}\`, userData)` diretamente, duplicando o que `updateUserProfile` já faz.
- **CEP/endereço**: `Profile.tsx` (`handleCEPBlur`) chama a **API pública do ViaCEP** direto via `fetch("https://viacep.com.br/ws/${cleanCEP}/json/")` — fora da instância `api`, fora de `VITE_API_URL`. Preenche `logradouro`, `bairro`, `cidade` no blur do campo CEP.
- **Signup**: `Signup.tsx` chama `fetch()` direto contra a URL do Xano hardcoded, sem passar por `api.ts` nem por `VITE_API_URL`. Não existe função `registerUser` na camada de serviços.

Ou seja: `VITE_API_URL` não governa universalmente todas as chamadas de rede do app, apesar de ser a única env var definida. Ao adicionar/alterar endpoints, considerar centralizar essas chamadas inline em `services/api.ts` para manter a consistência.

## Checkout — fluxo de pedido

`src/pages/Checkout/Checkout.tsx`. Rota protegida `/checkout`.

- Ao montar, lê `user` do localStorage; se ausente, redireciona para `/login`.
- Wizard client-side de 3 passos (estado `step`, sem rota por passo):
  1. **Entrega** — endereço lido direto do objeto `user` (`logradouro`, `numero`, `bairro`, `cidade`, `cep`); link "Alterar Endereço" leva a `/perfil`.
  2. **Pagamento** — `pix` (código copia-cola mockado, QR fake, "5% de desconto" citado no label mas **não aplicado** ao total — ver [known-issues.md](known-issues.md)), `cartao` (campos de cartão que não são enviados a lugar nenhum — texto explícito "Dados não serão salvos. Apenas para teste."), ou `entrega` (pagar na entrega).
  3. **Revisão** — quantidade de itens, forma de pagamento, `total` (via `useCart()` reduce).
- `handleFinishOrder`: monta `orderData` (`user_id`, `items: cart`, `total`, `payment_method`, `status: "pendente"`, `address` aninhado) e `api.post("/orders", orderData)`. Sucesso → `showToast()` (via `useToast()`), `clearCart()`, `navigate("/orders")` após 2.5s. Falha → Toast de erro, sem navegação.
- Só interage com o carrinho via `useCart()` (`cart`, `cartCount`, `clearCart`) — somente leitura, exceto limpar no sucesso.
