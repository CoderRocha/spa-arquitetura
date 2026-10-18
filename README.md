# Workspace SPA

Base de SPA em React com camadas bem separadas e regras de dependência checadas no lint. O domínio (`items`, `profile`, `dashboard`, `settings`) é genérico, só para ter algo real rodando em cima da estrutura.

## Como rodar

Sem backend, com a API mockada pelo MSW:

```bash
npm install
npm run dev:mock
```

Com a API de verdade (Turso + Better Auth), depois de configurar o `.env` (veja [Backend](#backend)):

```bash
npm run dev
```

O `dev` sobe o front (Vite) e a API juntos. Se quiser rodar separado, use `dev:web` e `dev:api`.

Login de teste nos dois casos: `demo@example.com` / `password123`.

## Stack

- **Front:** React 19, TypeScript, Vite 8, TanStack Router/Query/Form/Table/Virtual, Zustand, Valibot, Tailwind 4, shadcn/ui (base-nova), Lingui.
- **Back:** Hono, Drizzle, Turso (libSQL), Better Auth.
- **Testes e qualidade:** Vitest (jsdom, browser mode com Playwright e Node), MSW, ESLint com `eslint-plugin-boundaries`, oxlint.

## Scripts

| Script | O que faz |
| --- | --- |
| `dev` | Front + API juntos |
| `dev:web` | Só o front, com proxy de `/api` para `localhost:8787` |
| `dev:api` | Só a API, em watch, lendo o `.env` |
| `dev:mock` | Só o front, com a API mockada pelo MSW |
| `build` | Build de produção e typecheck do front e da API |
| `build:stats` | Build com relatório de bundle em `dist/stats.html` |
| `lint` | oxlint e ESLint |
| `typecheck` | `tsc` do front e da API |
| `test` | Todos os testes |
| `test:unit`, `test:integration`, `test:browser`, `test:server` | Um grupo de testes por vez |
| `db:generate` | Gera migração a partir de `server/db/*.ts` |
| `db:migrate` | Aplica as migrações no banco do `.env` |
| `db:seed` | Roda o `server/db/sql/seed.sql` no banco do `.env` |
| `auth:generate` | Regera as tabelas do Better Auth (`server/db/auth-schema.ts`) |
| `i18n:extract` | Atualiza os catálogos de tradução |

Antes do primeiro `test:browser`, instale o Chromium: `npx playwright install chromium`.

## Estrutura

```text
src/
  contracts/   schemas Valibot compartilhados entre front e API
  core/        cliente HTTP, chamadas de API, queries, stores, auth, i18n
  ui/          componentes do shadcn/ui, sem regra de negócio e sem texto fixo
  pattern/     peças reaproveitáveis: forms, data grid, boundaries de erro
  layouts/     estrutura das telas, recebe tudo por props
  features/    cada feature com seus componentes, hooks e schemas
  routes/      rotas finas: guard, prefetch, estado na URL e composição
  mocks/       MSW e setup dos testes
server/        API (Hono + Drizzle + Turso + Better Auth)
```

### Quem pode importar de quem

| Camada | Importa de |
| --- | --- |
| `contracts` | `contracts` |
| `core` | `core`, `mocks`, `contracts` |
| `ui` | `ui` |
| `layouts` | `core`, `ui`, `layouts` |
| `pattern` | `core`, `ui`, `pattern` |
| `features` | `core`, `ui`, `pattern`, `features`, `contracts` |
| `routes` | `core`, `ui`, `pattern`, `layouts`, `features` |
| `mocks` | `core`, `mocks`, `features`, `contracts` |
| `src/*.ts(x)` | tudo |
| `server` | `server`, `contracts` |

Pacotes do npm ficam fora dessa regra, e os testes (`__specs__/`) também.

## Convenções

- Sem barrel files (`export *` ou re-export).
- Sem classes. Erros tipados são objetos (`createFriendlyError` / `isFriendlyError`).
- `type` em vez de `interface`, exceto em module augmentation, onde o TypeScript exige interface.
- Imports por alias (`@core/...`, `@ui/...` etc.). `../` não passa.
- Sem `as` para forçar tipo (só `as const`).
- `fetch` só aparece em [src/core/http-resource.ts](src/core/http-resource.ts).

## Dados

Cada recurso tem o schema em `contracts/`, as chamadas em `core/api/`, as query keys em `core/keys.ts` e as `queryOptions` em `core/queries.ts`. As rotas fazem o prefetch no `loader` com `queryClient.query(...)`, e as features usam `useQuery` / `useSuspenseQuery` com as mesmas options.

O `httpResource` manda `Accept-Language` e o cookie de sessão, valida a resposta com o schema e transforma erros (`problem+json`, falha de rede, resposta fora do contrato) em `FriendlyError`.

Estado fica assim:

- **Dados do servidor:** TanStack Query.
- **Filtros, ordenação, paginação e aba ativa:** na URL (`validateSearch`).
- **Estado global pequeno:** Zustand (sessão, idioma, sidebar, consentimento de cookies).
- **Estado local:** `useState`.

Nada de `useEffect` para buscar dados, disparar mutation ou calcular estado derivado.

## Formulários

Os campos prontos (`TextField`, `SelectField`, `CheckboxField` etc.) ficam em `pattern/form.tsx` e usam os componentes `Field` do shadcn. O hook `useAppForm` sai de `pattern/form.hooks.ts`.

Todo form parte de um schema Valibot. A validação roda no submit e, depois disso, a cada alteração. Se a API devolver erro, a mensagem geral aparece no topo do form e os erros por campo aparecem em cada campo.

## UI

Os componentes vêm do shadcn/ui no estilo `base-nova`, que usa o Base UI por baixo. Composição é pela prop `render` (ex.: `<DropdownMenuItem render={<Link to="/settings" />}>`).

Para adicionar um componente:

```bash
npx shadcn@latest add <componente>
```

Ele já cai em `src/ui/`. Alguns componentes gerados foram ajustados à mão:

- textos fixos em inglês viraram props (`closeLabel`, `label`, `aria-label`), para funcionar com i18n;
- `Badge` ganhou as variantes `success` e `warning`;
- o `Sidebar` não grava cookie, porque o estado dele fica na `sidebar-store`;
- o `Toaster` segue o tema do sistema, sem `next-themes`.

Cuidado com `shadcn add --overwrite` em componente que já existe: ele desfaz esses ajustes.

As cores ficam em [src/styles.css](src/styles.css). O modo escuro segue o sistema operacional. No mobile, o menu lateral vira gaveta abaixo de 768px.

## Rotas

- `_auth` agrupa login e cadastro, `_main` a área logada e `_onboarding` a tela de boas-vindas.
- Os guards (`beforeLoad`) olham a `session-store`. Quando a sessão muda, o `AuthProvider` invalida o router e os guards fazem o redirect.
- O `redirect` depois do login é validado, para não virar open redirect.

## i18n

Lingui, com pt-BR como idioma base e tradução para inglês em `src/core/locales`. Depois de adicionar textos com `t` ou `Trans`, rode `npm run i18n:extract` e traduza o que faltar no `en.po`.

## Testes

| Grupo | Onde | Como roda |
| --- | --- | --- |
| `unit` | `src/{core,pattern,features}/**/__specs__` | jsdom + MSW |
| `integration` | `src/routes/__specs__` | jsdom + MSW + router em memória |
| `browser` | `src/ui/__specs__` | Chromium headless |
| `server` | `server/__specs__` | Node, com banco em memória, migração e seed reais |

## Backend

O front fala com a API pelo mesmo contrato que o MSW simula. Em dev, o Vite repassa `/api` para a API, então o cookie de sessão funciona sem configurar CORS.

### Configurando o Turso

1. Crie o banco no painel do Turso e gere um token.
2. Copie o `.env.example` para `.env` e preencha `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` e `BETTER_AUTH_SECRET`. O secret é uma string aleatória de 32 caracteres ou mais, que você gera assim:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

3. Crie as tabelas: `npm run db:migrate`, ou cole o [0000_init.sql](server/db/migrations/0000_init.sql) no console do Turso.
4. Coloque os dados de teste: `npm run db:seed`, ou cole o [seed.sql](server/db/sql/seed.sql) no console. Pode rodar mais de uma vez sem duplicar.
5. `npm run dev`.

Para usar um banco local sem conta no Turso, deixe `TURSO_DATABASE_URL=file:local.db` e rode os passos 3 e 4 pelos scripts.

No Better Auth a senha fica na tabela `account` (linha com `provider_id = 'credential'`), e não na `user`. Por isso o seed insere nas duas.

### Sessão

A sessão é um cookie `httpOnly` do Better Auth, e o front não guarda token nenhum. Qualquer 401 da API desloga o usuário no front.

Os erros do Better Auth são convertidos para `problem+json`, no idioma do usuário. E-mail já cadastrado, por exemplo, volta como erro no campo de e-mail.

### Rate limit

- **Login, cadastro e demais rotas de auth:** limite do próprio Better Auth. São 100 requisições por minuto no geral, 5 tentativas de login por minuto e 3 cadastros por minuto.
- **Itens, perfil e métricas:** middleware próprio ([server/http/rate-limit.ts](server/http/rate-limit.ts)), por usuário. São 120 requisições por minuto, e 10 por minuto no upload de avatar.

Os contadores ficam no banco, então valem mesmo com mais de uma instância da API. Passou do limite, a API responde 429 com `Retry-After`.

O IP vem da conexão. O header `x-forwarded-for` só é usado com `TRUST_PROXY=true`; sem isso, daria para burlar o limite mandando um IP falso.

### Pendências

Os pontos marcados com `ponytail:` no código precisam de atenção antes de produção:

- o avatar é salvo no disco do servidor (trocar por S3 ou R2);
- a limpeza da tabela de rate limit é feita aos poucos, durante as requisições (trocar por um job agendado se o tráfego crescer).

### Se um dia trocar para Supabase

Drizzle e Better Auth também funcionam com Postgres. A troca fica toda em `server/db` (schema, adapter e config do drizzle-kit), sem mexer no front.

## Decisões e limitações

- **Lingui 5.9:** o 6 pede Node 22.19 ou mais novo. Dá para atualizar quando o Node for atualizado.
- **TypeScript 6.0:** o typescript-eslint ainda não suporta o 7.
- **Sem `@testing-library/jest-dom`:** ele conflita com os tipos dos testes de browser do Vitest. Os `findBy`/`getBy` já falham quando o elemento não existe.
- **Não rode `npm audit fix --force`:** ele rebaixa o `eslint-plugin-boundaries` e o Lingui para versões que quebram o lint e a extração de textos.
