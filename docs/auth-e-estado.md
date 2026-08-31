# Autenticação e gerenciamento de estado

## Não existe AuthContext

Autenticação é feita inteiramente via `localStorage` + um evento customizado `"storage"`, duplicado de forma independente em `Navbar.tsx`, `App.tsx`, `Login.tsx`, `Signup.tsx`, `ProtectedRoute.tsx`, `services/api.ts`, `Checkout.tsx`, `Profile.tsx`, `Orders.tsx` e `ProductDetail.tsx`. Não há hook `useAuth`.

**Chaves usadas em `localStorage`:**

| Chave | Conteúdo |
|---|---|
| `token` | Token de auth (`authToken` retornado por `auth/login` no Xano) |
| `user` | JSON do usuário — `{id, name}` no Login, objeto `User` completo após fetch/patch no Profile |
| `userName` | String simples, só o primeiro nome |
| `userRole` | String, default `"member"` se o backend não enviar `user_role`; comparado com `"master"`/`"admin"` para UI/rotas privilegiadas |

## Fluxo de login (`src/pages/Login/Login.tsx`)

1. `loginUser(email, password)` de `services/api.ts` → `POST auth/login`.
2. Em sucesso (`data.authToken` presente), extrai `userId`/`rawName` de múltiplos formatos possíveis de resposta, seta as 4 chaves de localStorage, e dispara:
   ```tsx
   window.dispatchEvent(new Event("storage"));
   window.dispatchEvent(new Event("focus"));
   ```
   É esse disparo que faz a `Navbar` (que escuta `"storage"`/`"focus"`) re-renderizar sem precisar de um context compartilhado.
3. Mostra Toast de sucesso, `navigate("/")` após 1.5s.

## Fluxo de signup (`src/pages/Signup/Signup.tsx`)

**Não usa `services/api.ts`** — chama `fetch()` direto contra a URL do Xano hardcoded (`https://x8ki-letl-twmt.n7.xano.io/api:28B-MVDq/auth/signup`), ignorando a instância axios, seus interceptors e `VITE_API_URL`. Só seta `token` no sucesso — não seta `user`/`userName`/`userRole`, então um cadastro recém-feito não "loga" totalmente a UI (Navbar continua mostrando "Usuário").

## Logout e 401 global

Interceptor de resposta em `src/services/api.ts` — em qualquer 401, limpa as 4 chaves, dispara `"storage"` e redireciona para `/login`:

```ts
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userName");
      localStorage.removeItem("userRole");
      window.dispatchEvent(new Event("storage"));
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
```

`Navbar.handleLogout` faz o mesmo processo manualmente (remove as 4 chaves, dispara `"storage"`, mostra Toast, `navigate("/")` após 1s).

## Acesso por role

`userRole` controla tanto o guard `ProtectedAdminRoute` (`src/App.tsx`) quanto a renderização condicional do item "Painel Admin" na `Navbar` — a mesma checagem (`userRole === "master" || userRole === "admin"`) está duplicada nos dois arquivos em vez de compartilhada.

## CartContext — único context da aplicação

`src/context/CartContext.tsx`:

```tsx
interface CartItem extends Product { quantity: number; }

interface CartContextData {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, type: "increase" | "decrease") => void;
  setQuantity: (productId: number, value: number) => void;
  clearCart: () => void;
  cartCount: number;
}
```

- Estado em `useState` puro, **não persiste** — some ao dar refresh na página (não sincroniza com localStorage).
- `updateQuantity`/`setQuantity` sempre com clamp mínimo de 1.
- `cartCount` é derivado (soma das quantidades).
- Consumido via `useCart()`; `CartProvider` envolve o app inteiro, fora do `BrowserRouter`.

## ToastContext — notificações globais

`src/context/ToastContext.tsx`. Antes cada página declarava seu próprio par de `useState` (`showToast`/`toastConfig`), copiado ~7 vezes; hoje isso foi centralizado — não sobrou nenhum `setShowToast` local em `src/`.

```tsx
interface ToastContextData {
  showToast: (message: string, type?: ToastType) => void;
}
```

- `ToastProvider` é o provider mais externo do app (`App.tsx`, envolve `CartProvider`), e renderiza **um único** `<Toast />` como irmão de `children`.
- Estado interno: um `toast` (`{id, message, type}`) por vez — uma nova chamada substitui a anterior. O `id` (via `useRef` incremental) vira `key` do `<Toast />`, forçando remount para o timer de auto-close reiniciar em mensagens repetidas.
- `showToast` é memoizado com `useCallback`, e o `type` default é `"success"`.
- `Toast` (`src/components/Toasts/Toast.tsx`) continua puramente apresentacional — quem o renderiza é o provider, não as páginas.
- Consumido via `useToast()` em `Navbar`, `Home`, `Login`, `Signup`, `Cart`, `Checkout`, `Profile` e `ProductDetail`.
