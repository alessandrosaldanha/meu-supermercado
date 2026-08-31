# Inconsistências e dívidas técnicas conhecidas

Levantado por inspeção de código em 2026-08, revisado em 2026-08-31 contra o estado atual do `main`. Útil para priorizar refatorações e para não redescobrir os mesmos pontos a cada sessão.

1. **Sem `AuthContext`** — auth é só `localStorage` + evento `"storage"`/`"focus"`, duplicado em ~9 arquivos. Ver [auth-e-estado.md](auth-e-estado.md).
2. **Camada de serviços incompleta** — Orders, Checkout e Profile (GET) bypassam `services/api.ts` com chamadas `api.*` inline (`Profile.tsx:36` e `:84`, `Orders.tsx:37`, `Checkout.tsx:62`). `updateUserProfile` está exportada mas não é usada (`Profile.tsx` duplica a lógica inline).
3. **Signup e busca de CEP ignoram `VITE_API_URL`** — chamam URLs hardcoded diretamente: Xano signup em `Signup.tsx:31`, ViaCEP em `Profile.tsx:57`.
4. **Sem pasta `types/`** — `Order` (em `Orders.tsx`, com `items: any[]`) e `CartItem` (em `CartContext.tsx`) são locais, não centralizados com `Product`/`User`/`Review` em `services/api.ts`. Vários `any` soltos (`Checkout.tsx` `user: any`, `ProductDetail.tsx` `product: any`).
5. **Sem testes** — nenhum framework de teste configurado (`package.json` não tem script `test` nem `vitest`/`jest`/etc. em devDependencies).
6. **`/admin/users` é placeholder** — só renderiza um `<h1>Gestão de Usuários</h1>` inline no `App.tsx`, sem integração real com o Xano.
7. **Checkout PIX** — `Checkout.tsx:173` mostra "PIX (5% de desconto)" no texto, mas o desconto não é aplicado no total calculado.

## Já resolvidos

Mantidos aqui só para não serem "redescobertos" como bugs em sessões futuras:

- ~~Sem context de Toast~~ — resolvido: `src/context/ToastContext.tsx` expõe `useToast()`, `ToastProvider` envolve o app em `App.tsx`, e não sobrou nenhum `showToast`/`toastConfig` local em `src/`.
- ~~`Checkout.tsx` mora em `components/`~~ — resolvido: hoje está em `src/pages/Checkout/Checkout.tsx`, seguindo a convenção das demais views roteadas.
- ~~`Navbar` linka para `/products`, rota inexistente~~ — resolvido: `/products` está registrada em `App.tsx` apontando para `Products` (`src/pages/Products/Products.tsx`), página dedicada com o grid completo + paginação (`Home` ficou só com hero + `FeaturedSlider`).
- ~~Botão de última página (`>>`) nunca desabilita~~ — resolvido: `Home.tsx:131` usa `disabled={page === totalPages}`.
