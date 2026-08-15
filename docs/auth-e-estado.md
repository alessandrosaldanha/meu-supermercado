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

## Toast não é um context

Apesar da mensagem de commit "implementação Toast em todas as páginas" sugerir um sistema compartilhado, `Toast` (`src/components/Toasts/Toast.tsx`) é **puramente apresentacional**. Cada página/componente que precisa dele declara seu próprio par de `useState` local, copiado e colado ~7 vezes (`Navbar`, `Login`, `Signup`, `Cart`, `Checkout`, `Profile`, `ProductDetail`):

```tsx
const [showToast, setShowToast] = useState(false);
const [toastConfig, setToastConfig] = useState<{
  message: string;
  type: "success" | "error" | "warning" | "info";
}>({ message: "", type: "warning" });
```

Se for centralizar isso num `ToastContext`/hook `useToast`, esse é o padrão repetido a substituir em todos os 7 arquivos.
