# Workspace SPA

Blueprint de single page application com camadas explícitas, limites de dependência verificados por lint e um domínio neutro (`items`, `profile`, `dashboard`, `settings`) usado apenas para provar que a arquitetura funciona.

## Stack

React 19, TypeScript estrito, Vite 8, TanStack Router (file-based, code splitting automático), TanStack Query, TanStack Form, TanStack Table 9 + Virtual, Zustand, Valibot, Tailwind CSS 4, shadcn/ui (estilo `base-nova`, sobre Base UI) com class-variance-authority, `cn`, lucide-react e Sonner, Lingui, MSW, Vitest (jsdom + browser mode com Playwright), ESLint com `eslint-plugin-boundaries` e oxlint.

Backend: Hono + Drizzle sobre Turso (libSQL) e Better Auth, em `server/`.

## Scripts

| Script | O que faz |
| --- | --- |
| `npm run dev` | Dev server do SPA com proxy de `/api` para `http://localhost:8787` (rode junto com `dev:api`) |
| `npm run dev:api` | API (Hono) em watch, lendo `.env` se existir |
| `npm run dev:mock` | Dev server com MSW interceptando a API (login: `demo@example.com` / `password123`) |
| `npm run build` | Build de produção + `tsc` do SPA e do servidor |
| `npm run build:stats` | Build com `dist/stats.html` (rollup-plugin-visualizer) |
| `npm run lint` | `oxlint` e depois `eslint` (tipos + boundaries) |
| `npm run typecheck` | `tsc` do SPA e do servidor |
| `npm run db:generate` | Gera migração a partir de `server/db/*.ts` (drizzle-kit) |
| `npm run db:migrate` | Aplica as migrações no banco de `TURSO_DATABASE_URL` |
| `npm run db:seed` | Roda `server/db/sql/seed.sql` no banco de `TURSO_DATABASE_URL` |
| `npm run auth:generate` | Regera `server/db/auth-schema.ts` a partir da config do Better Auth |
| `npm run i18n:extract` | Extrai mensagens para `src/core/locales/*.po` |
| `npm test` | Todos os projetos de teste |
| `npm run test:unit` / `test:integration` / `test:browser` / `test:server` | Um projeto por vez |

Antes do primeiro `test:browser`: `npx playwright install chromium`.

## Camadas

```text
src/
  contracts/ schemas Valibot puros (respostas, inputs, limites), compartilhados entre SPA e servidor
  core/      fundação técnica: cliente HTTP, APIs, query keys/options, stores, auth, i18n, schemas transversais
  ui/        design system: componentes shadcn/ui (base-nova, sobre Base UI), sem domínio e sem texto fixo
  pattern/   composições compartilhadas: infraestrutura de form, data grid, boundaries, diálogos de erro
  layouts/   shells visuais puros, recebem tudo por props
  features/  módulos autocontidos por feature (componentes, hooks, schemas)
  routes/    rotas finas: guard, prefetch, URL state e composição
  mocks/     MSW (handlers, banco em memória, setup de testes)
  main.tsx, router.ts, query-client.ts   composição da aplicação
server/      API Hono + Drizzle (Turso/libSQL) + Better Auth
```

### Matriz de dependências

Verificada por `boundaries/dependencies` em [eslint.config.js](eslint.config.js). Qualquer import fora da matriz quebra o lint.

| Camada | Pode importar de |
| --- | --- |
| `contracts` | `contracts` |
| `core` | `core`, `mocks`, `contracts` |
| `ui` | `ui` |
| `layouts` | `core`, `ui`, `layouts` |
| `pattern` | `core`, `ui`, `pattern` |
| `features` | `core`, `ui`, `pattern`, `features`, `contracts` |
| `routes` | `core`, `ui`, `pattern`, `layouts`, `features` |
| `mocks` | `core`, `mocks`, `features`, `contracts` |
| app (`src/*.ts[x]`) | tudo |
| `server` | `server`, `contracts` |

Pacotes externos não entram na matriz. Arquivos em `__specs__/` ficam fora dela porque testes compõem a aplicação inteira.

## Convenções (todas verificadas por lint)

- Sem barrel exports (`export *` e re-exports são bloqueados).
- Sem classes. Erros tipados são objetos criados por função (`createFriendlyError` + `isFriendlyError`).
- `type` em vez de `interface`. A única exceção é module augmentation (`Register` do Router e do Query, `ImportMetaEnv`), que exige interface.
- Imports entre módulos sempre por alias (`@core/*`, `@ui/*`, `@pattern/*`, `@features/*`, `@layouts/*`, `@routes/*`, `@mocks/*`, `@/*`). `../` é bloqueado.
- Sem type assertions (`as`), exceto `as const`. Tipos são ajustados na origem, em geral inferidos de schemas Valibot.
- `fetch` só existe em [src/core/http-resource.ts](src/core/http-resource.ts).

## UI (shadcn/ui)

Os componentes de `src/ui/` vêm do shadcn/ui no estilo `base-nova`, que usa `@base-ui/react` como primitivo. A composição é feita pela prop `render` (por exemplo `<DropdownMenuItem render={<Link to="/settings" />}>`), não por `asChild`. A configuração fica em [components.json](components.json).

```bash
npx shadcn@latest add <componente>
```

A CLI grava direto em `src/ui/` porque o `tsconfig.json` mapeia o alias `@ui` (além de `@ui/*`). Os componentes importam `cn` do pacote `cn` e ícones de `lucide-react`.

**Mobile first.** O `Sidebar` vira um `Sheet` (gaveta) abaixo de 768px (`useIsMobile`). Dialogs, AlertDialogs e inputs já vêm responsivos (largura `calc(100%-2rem)`, rodapés empilhados, `text-base` no mobile para evitar zoom no iOS). Os layouts só usam breakpoints `sm:`/`lg:` para refinar a partir do mobile.

**Ajustes locais nos componentes gerados.** O shadcn entrega código aberto, e estes ajustes fazem parte do projeto:

- Textos fixos em inglês viraram props, para manter `ui/` sem texto e com i18n: `closeLabel` em `DialogContent`/`DialogFooter`/`SheetContent`, `label` em `Sidebar`/`SidebarTrigger`/`SidebarRail` e `aria-label` obrigatório no `Spinner`.
- `Button` expõe `data-variant` e `data-size`. `Badge` ganhou as variantes `success` e `warning`.
- O `Sidebar` não grava cookie, porque o estado aberto/fechado é persistido pela `sidebar-store`.
- O `Toaster` (Sonner) segue o tema do sistema, sem `next-themes`.
- `useIsMobile` usa `useSyncExternalStore` em vez de `setState` dentro de efeito.
- Os casts `as React.CSSProperties` foram removidos. Custom properties (`--x`) são tipadas em [src/css-properties.d.ts](src/css-properties.d.ts).

Rodar `shadcn add --overwrite` num componente já existente descarta esses ajustes, então revise o diff antes de commitar.

**Tema.** [src/styles.css](src/styles.css) mapeia a paleta do projeto para as variáveis do shadcn (`--primary`, `--muted-foreground`, `--sidebar-*`...) e acrescenta `--success`/`--warning`. O modo escuro segue `prefers-color-scheme`.

## Fluxo de dados

```text
core/api/<recurso>.ts   schema Valibot + tipos + rotas (defineApiRoute/defineApiRouteFn) + fetchX/createX/...
        │  httpResource / httpUpload
core/keys.ts            query-key-factory, um registry por domínio técnico
core/queries.ts         queryOptions: queryKey, queryFn, select, staleTime, gcTime, placeholderData
        │
routes  loader/beforeLoad → queryClient.query(xQuery())
features                → useQuery / useSuspenseQuery(xQuery()), useMutation + invalidação via keys
```

O `httpResource` adiciona `Accept-Language` (locale da app store), envia o cookie de sessão (`credentials: 'include'`), converte `application/problem+json` em `FriendlyError` com `fieldErrors`, normaliza falha de rede (status 0) e valida a resposta contra o schema do recurso. Resposta fora do contrato também vira `FriendlyError`.

No TanStack Query 5.104, `prefetchQuery` e `ensureQueryData` estão depreciados. As rotas usam `queryClient.query(options)`, e `.catch(() => undefined)` quando o erro deve ficar com o boundary do widget.

## Estado

| Tipo | Onde |
| --- | --- |
| Server state | TanStack Query |
| URL state | `validateSearch` com schema Valibot + `stripSearchParams` para manter a URL limpa |
| Global pequeno | Zustand: `session-store`, `app-store` (locale, persistida), `sidebar-store` (UI persistida), `cookies/consent-store` |
| Local | `useState` |
| Compound components | Context (forms via `createFormHookContexts`, data grid via `createTableHookContexts`) |

`useEffect` não é usado para fetch, mutation ou estado derivado. Os únicos efeitos sincronizam sistemas externos: a assinatura da session store que invalida o router, e o timer do debounce.

## Formulários

- `ui/field.tsx` e `ui/label.tsx`: primitives visuais do shadcn (`Field`, `FieldLabel`, `FieldDescription`, `FieldError`, `FieldSet`).
- `pattern/form.tsx`: campos ligados ao TanStack Form (`TextField`, `NumberField`, `TextareaField`, `SelectField`, `RadioGroupField`, `CheckboxField`, `SubmitButton`, `FormErrorAlert`). Um `FieldShell` interno liga label, controle, descrição e erro (`id`/`htmlFor`, `aria-invalid`, `aria-describedby`).
- `pattern/form.hooks.ts`: `useAppForm`/`withForm` via `createFormHook`, `schemaValidation(schema)` e `createFormSubmitHandler(schema, onValid)`.

Todo form nasce de um schema Valibot. Ele valida no submit e, depois do primeiro submit, a cada mudança (`revalidateLogic`). O `onValid` recebe o output já parseado (com trim e transformações). Um `FriendlyError` vindo da API volta para o form: `detail` vira erro de formulário e `fieldErrors` vira erro de campo.

## Rotas

- Grupos sem path: `_auth` (login, registro), `_main` (área autenticada), `_onboarding`.
- Guards em `beforeLoad` leem a session store. O `AuthProvider` chama `router.invalidate()` quando o status da sessão muda, então login, logout e 401 redirecionam pelos próprios guards, sem `core` conhecer paths de rota.
- O redirect pós-login é validado (`safeRedirectSchema`) para evitar open redirect.
- `__root.tsx` monta `AuthProvider`, `HeadContent`, `TooltipProvider`, `Outlet`, banner de cookies, `Toaster`, devtools (apenas em dev) e `notFoundComponent`.

## i18n

Lingui com origem `pt-BR` e tradução `en` em `src/core/locales`. O locale vem da app store persistida e é carregado antes do render. `changeLocale` troca o catálogo e invalida as queries (o `Accept-Language` muda). Para adicionar textos, use `t`/`Trans` dos macros e rode `npm run i18n:extract`.

## Bootstrap

[src/main.tsx](src/main.tsx): MSW (se `--mode mock`) → `initializeAuth` → `initializeI18n` → query client + router → tracking de rota fora do React (respeita o consentimento de cookies) → render com `StrictMode` > `I18nProvider` > `QueryClientProvider` > `RouterProvider`.

## Testes

| Projeto | Onde | Ambiente |
| --- | --- | --- |
| `unit` | `src/{core,pattern,features}/**/__specs__` | jsdom + MSW node |
| `integration` | `src/routes/__specs__` | jsdom + MSW node + router com memory history |
| `browser` | `src/ui/__specs__` | Chromium headless via Playwright, com o CSS da aplicação |
| `server` | `server/__specs__` | Node, libSQL em memória com a migração e o `seed.sql` reais |

O banco do mock, as stores e o `localStorage` são resetados após cada teste ([src/mocks/setup-specs.ts](src/mocks/setup-specs.ts)).

## Backend (Turso + Better Auth)

O SPA fala com a API pelo mesmo contrato REST que o MSW simula (`problem+json` nos erros). Em desenvolvimento o Vite faz proxy de `/api` para a API, então tudo roda na mesma origem e o cookie de sessão funciona sem CORS.

```text
server/
  env.ts               variáveis validadas com Valibot
  auth.ts              Better Auth (e-mail/senha, campos bio/onboarded, rate limit)
  app.ts               Hono: CORS, locale, IP do cliente, rotas
  db/auth-schema.ts    tabelas do Better Auth (geradas por `npm run auth:generate`)
  db/schema.ts         tabelas item e api_rate_limit
  db/migrations/       SQL gerado pelo drizzle-kit
  db/sql/seed.sql      usuário demo + 64 itens (os mesmos dados do mock)
  http/                problem+json, sessão, rate limit, IP, mensagens pt-BR/en
  routes/              items, profile (com upload de avatar), metrics
```

### Preparando o banco no Turso

1. Crie o banco no painel do Turso e gere um token.
2. Copie `.env.example` para `.env` e preencha `TURSO_DATABASE_URL` (`libsql://...`), `TURSO_AUTH_TOKEN` e `BETTER_AUTH_SECRET` (32+ caracteres, por exemplo `openssl rand -base64 32`).
3. Crie as tabelas: cole [server/db/migrations/0000_init.sql](server/db/migrations/0000_init.sql) no SQL console do Turso, ou rode `npm run db:migrate`.
4. Popule com dados de teste: cole [server/db/sql/seed.sql](server/db/sql/seed.sql) no console, ou rode `npm run db:seed`. O script pode ser rodado de novo sem duplicar nada.
5. `npm run dev:api` em um terminal e `npm run dev` em outro. Login: `demo@example.com` / `password123`.

Para desenvolver sem conta no Turso, deixe `TURSO_DATABASE_URL=file:local.db` e rode os passos 3 e 4 pelos scripts.

O Better Auth guarda a senha na tabela `account`, numa linha com `provider_id = 'credential'`, e não em `user`. Por isso o seed insere as duas linhas. O hash do seed foi gerado com `hashPassword` de `better-auth/crypto`.

### Sessão e erros

- A sessão é um cookie `httpOnly` do Better Auth. O SPA não guarda token: a `session-store` só reflete o status (`authenticated`/`anonymous`), e qualquer 401 da API encerra a sessão no cliente.
- Erros do Better Auth (`{ code, message }`) são convertidos no servidor para `problem+json`, em pt-BR ou en conforme `Accept-Language`. Por exemplo, e-mail já cadastrado vira 422 com `errors.email`.

### Rate limiting

| Onde | Como | Limite |
| --- | --- | --- |
| `/api/auth/*` | Rate limit do Better Auth, persistido na tabela `rate_limit` | 100/min no geral, 5/min em `/sign-in/email`, 3/min em `/sign-up/email` |
| `/api/items`, `/api/profile`, `/api/metrics` | Middleware próprio ([server/http/rate-limit.ts](server/http/rate-limit.ts)), janela fixa na tabela `api_rate_limit`, por usuário | 120/min, e 10/min no upload de avatar |

As duas camadas gravam no Turso, então o limite vale entre instâncias. Ao estourar, a resposta é 429 em `problem+json` com `Retry-After` (e `RateLimit-*` nas rotas da aplicação). O IP vem da conexão; `x-forwarded-for` só é usado com `TRUST_PROXY=true`, para não deixar o limite ser burlado com header forjado.

### Pontos marcados para depois

Procure por `ponytail:` no código: avatar em disco local (trocar por S3/R2 antes de rodar mais de uma instância) e limpeza oportunista da tabela de rate limit (trocar por job agendado ou Redis se o volume crescer).

### Trocar para Supabase no futuro

Drizzle e Better Auth também suportam Postgres. A troca fica em `server/db` (schema com `pgTable`, `provider: 'pg'` no adapter e `dialect: 'postgresql'` no drizzle-kit). O SPA e o contrato em `src/contracts` não mudam.

## Como adicionar uma feature

1. Schemas e tipos em `contracts/<recurso>.ts`, e rotas/funções em `core/api/<recurso>.ts`.
2. Keys em `core/keys.ts` e `queryOptions` em `core/queries.ts`.
3. Pasta `features/<nome>/` com `schemas.ts`, `hooks.ts` (mutations) e componentes. A feature recebe URL state por props.
4. Rota fina em `routes/` com guard/loader/`validateSearch` compondo layout e feature.
5. Handlers MSW em `mocks/handlers.ts`, rota da API em `server/routes/`, tabela em `server/db/schema.ts` + `npm run db:generate`, e testes em `__specs__/`.

## Desvios conscientes em relação ao pedido original

- **Lingui 5.9 em vez de 6**: o Lingui 6 exige Node ≥ 22.19, e a máquina de desenvolvimento roda 22.13. O macro roda via `@rolldown/plugin-babel`. Ao atualizar o Node, dá para migrar para o transform nativo do Lingui 6.
- **TypeScript 6.0**: o typescript-eslint ainda não suporta o TS 7.
- **Variantes com `class-variance-authority` e merge com `cn`**: é o padrão dos componentes do shadcn, então substituiu o `cva` beta + `tailwind-merge` e o antigo `ui/variants.ts`.
- **Sem `motion`**: a única animação era a largura do sidebar, que agora vem do `Sidebar` do shadcn via CSS. Adicione o pacote de volta quando surgir uma animação que CSS não resolva.
- **Sem `@testing-library/jest-dom`**: os matchers dele colidem com os tipos de `expect.element` do browser mode. `findBy*`/`getBy*` já falham quando o elemento não existe.
- **Sem camada extra de componentes compartilhados** e sem `core/utils.ts`: nada genérico justificou a existência deles ainda.
