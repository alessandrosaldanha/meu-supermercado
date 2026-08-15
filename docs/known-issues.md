# Inconsistências e dívidas técnicas conhecidas

Levantado por inspeção de código em 2026-08. Útil para priorizar refatorações e para não redescobrir os mesmos pontos a cada sessão.

1. **Sem `AuthContext`** — auth é só `localStorage` + evento `"storage"`/`"focus"`, duplicado em ~9 arquivos. Ver [auth-e-estado.md](auth-e-estado.md).
2. **Sem context de Toast** — `showToast`/`toastConfig` copiado e colado em 7 arquivos (`Navbar`, `Login`, `Signup`, `Cart`, `Checkout`, `Profile`, `ProductDetail`).
3. **`Checkout.tsx` mora em `components/`**, não em `pages/` — quebra a convenção do resto das views roteadas.
4. **Camada de serviços incompleta** — Orders, Checkout, Profile (GET) e Signup bypassam `services/api.ts` com chamadas `api.*`/`fetch` inline. `updateUserProfile` está exportada mas não é usada (`Profile.tsx` duplica a lógica inline).
5. **Signup e busca de CEP ignoram `VITE_API_URL`** — chamam URLs hardcoded (Xano signup, ViaCEP) diretamente.
6. **Sem pasta `types/`** — `Order` (em `Orders.tsx`, com `items: any[]`) e `CartItem` (em `CartContext.tsx`) são locais, não centralizados com `Product`/`User`/`Review` em `services/api.ts`. Vários `any` soltos (`Checkout.tsx` `user: any`, `ProductDetail.tsx` `product: any`).
7. **Sem testes** — nenhum framework de teste configurado (`package.json` não tem script `test` nem `vitest`/`jest`/etc. em devDependencies).
8. **`/admin/users` é placeholder** — só renderiza `<h1>Gestão de Usuários</h1>`, sem integração real com o Xano.
9. **`Navbar` linka para `/products`**, rota que não existe no `App.tsx` — link morto (listagem de produtos é em `/`).
10. **Checkout PIX** — menciona "5% de desconto" no texto mas não aplica o desconto no total calculado.
11. **Paginação** — botão de "última página" (`>>`) na Home nunca desabilita, mesmo já estando na última página.
