# TESTING.md — Dizipay

Infraestrutura de testes E2E (Playwright). Esta é a etapa de **baseline** — configuração + primeira suíte reproduzível, sem correção de vulnerabilidades nem novas features. Ver [`AUDIT.md`](AUDIT.md) e [`BACKLOG.md`](BACKLOG.md) para o que vem depois.

## Stack de testes

- **Playwright** (`@playwright/test`, versão fixa `1.62.1`) — E2E.
- Browser: **só Chromium** por enquanto (reduz tempo/complexidade da suíte baseline). Adicionar Firefox/WebKit só quando houver motivo concreto (bug reportado específico de browser), não por precaução.
- Sem testes unitários/integração configurados ainda — não existiam antes desta etapa e não é o escopo dela (ver "O que NÃO testar com Playwright" abaixo).

## Como executar

```bash
npm run test:e2e            # roda a suíte completa, headless
npm run test:e2e:ui         # UI mode do Playwright (interativo, recomendado em dev)
npm run test:e2e:headed     # roda com browser visível
npm run test:e2e:report     # abre o último relatório HTML gerado
```

Rodar um teste específico ou uma pasta:

```bash
npx playwright test tests/e2e/auth/login.spec.ts
npx playwright test tests/e2e/security
npx playwright test -g "credenciais inválidas"   # por nome do teste
```

O Playwright sobe o próprio `next dev` automaticamente (`webServer` em `playwright.config.ts`), numa porta dedicada (**3100**, configurável via `PLAYWRIGHT_PORT`) — não precisa rodar `npm run dev` manualmente antes, e não conflita com um dev server já aberto na 3000.

## Ambiente de teste — LEIA ANTES DE RODAR CONTRA UM BANCO REAL

**Ponto crítico, tratado com cuidado nesta etapa**: o projeto, no estado em que esta suíte foi criada, **não tinha nenhum `.env` configurado** neste ambiente — nem local, nem de teste. Não existe hoje uma separação `Development DB ≠ Test DB ≠ Production DB` pronta para uso.

Em vez de inventar uma solução silenciosa (ex: reaproveitar `DATABASE_URL` "só dessa vez"), a estratégia adotada foi:

1. Uma env var **própria e exclusiva** para teste: `TEST_DATABASE_URL`. O código em `tests/helpers/db.ts` só lê essa variável — nunca `DATABASE_URL`/`POSTGRES_URL` como fallback. Não existe caminho no código dos testes que aponte para o banco de dev/produção/demo.
2. Se `TEST_DATABASE_URL` **não estiver configurada**, `tests/playwright/global-setup.ts` não lança erro nem trava a suíte inteira — ele avisa no console e marca `E2E_DB_AVAILABLE=false`. Todo teste que depende de dados reais (login, campanha, isolamento multi-tenant, webmaster) chama `skipWithoutTestDb()` e é **pulado com motivo explícito no relatório** — nunca falha silenciosamente, nunca finge que passou, nunca aponta pra produção.
3. Só o teste `tests/e2e/auth/app-boots.spec.ts` roda sem nenhum banco — a landing page (`src/app/page.tsx`) não faz nenhuma query.

### Como configurar um banco de teste de verdade

Único caminho viável hoje: um **branch dedicado do Neon** (Neon Console → seu projeto → Branches → Create branch a partir do branch de dev, nunca do de produção). Branches do Neon são baratos, isolados e descartáveis — ideal para um banco que é truncado a cada execução de teste.

```bash
# .env.local (não commitado)
TEST_DATABASE_URL=postgres://.../seu-branch-de-teste
```

**Testado e descartado nesta etapa**: Postgres local via Docker (`postgres:16`) **não funciona** com o client atual do projeto. `src/lib/db/client.ts` usa `@neondatabase/serverless` (driver HTTP/WebSocket exclusivo de endpoints Neon/Vercel Postgres/Supabase) — `drizzle-kit migrate` contra um Postgres genérico local trava indefinidamente ("can only connect to remote Neon/Vercel Postgres/Supabase instances through a websocket"), confirmado ao rodar de verdade durante esta etapa. Rodar um Postgres 100% local exigiria trocar o driver (ex: `drizzle-orm/node-postgres`) condicionalmente para teste, ou usar o proxy `neon-local` da própria Neon (ainda depende de projeto Neon/API key) — mudança de arquitetura fora do escopo desta etapa. Por ora, `TEST_DATABASE_URL` só funciona apontando para um branch Neon real.

**Nunca** aponte `TEST_DATABASE_URL` para o mesmo banco de `DATABASE_URL` — `tests/helpers/db.ts` faz `TRUNCATE ... CASCADE` em todas as 11 tabelas a cada `global-setup`, apagando tudo que existir nelas.

`.env.example` deveria documentar isso lado a lado com `DATABASE_URL`/`SESSION_SECRET` — não foi possível criar esse arquivo nesta sessão porque `.env*` está bloqueado por regra de permissão do ambiente (`deny: Read/Write(.env*)`). Crie manualmente com o seguinte conteúdo, ou libere a permissão numa próxima sessão:

```bash
DATABASE_URL=
SESSION_SECRET=
TEST_DATABASE_URL=
```

## Test data / fixtures

Centralizados em `tests/fixtures/test-data.ts` — nenhuma credencial espalhada pelos specs. Entidades sintéticas, prefixadas `e2e-` para nunca colidir com os dados de `src/lib/db/seed-data.ts` (usados em dev/demo):

- **Church A** / **Church B** — duas igrejas, para todo teste que precisa provar isolamento entre tenants.
- **Admin A** / **Admin B** — um usuário de igreja por church (senha compartilhada `SENHA_TESTE`, só existe dentro do banco de teste descartável).
- **Campaign A** / **Campaign B** — uma campanha por church.
- **Fiel A** / **Fiel B** — um doador por church, base para as contribuições abaixo.
- **Donation A** / **Donation B** — uma contribuição confirmada por church (campanha + Pix), suficiente para testar relatório/dashboard e um futuro teste de isolamento sobre dado financeiro.
- **Staff** (segundo usuário por igreja) — não seedado: o fluxo de convite de staff adicional não está implementado no produto ainda (ver `docs/PRODUCT.md`).
- **WebMaster** — não seedado. O banco de teste recém-resetado não tem nenhum registro em `webmasters`, então o teste de webmaster exercita o fluxo real de bootstrap ("Master Primário") em vez de um fixture artificial.

`tests/helpers/db.ts` expõe `resetAndSeedTestDb()`, chamado uma vez por `global-setup.ts` antes de toda a suíte.

## Estrutura

```text
tests/
├── e2e/
│   ├── auth/          # boot da app, login válido/inválido
│   ├── campaigns/     # criação de campanha, página pública
│   ├── security/      # isolamento multi-tenant (baseline de segurança)
│   └── webmaster/     # bootstrap do Master Primário
├── fixtures/
│   └── test-data.ts   # dados sintéticos centralizados
├── helpers/
│   ├── auth.ts         # login via UI (fluxo real, não injeção de cookie)
│   ├── db.ts            # reset + seed do banco de teste
│   └── skip-without-db.ts
└── playwright/
    └── global-setup.ts
```

`churches/` e `donations/` (sugeridas no pedido original) não foram criadas vazias — Git não versiona diretório vazio, e não há teste de doação/fluxo específico de igreja além do que já cabe em `campaigns/` e `security/` nesta etapa baseline. Criar quando o próximo teste realmente for escrito.

## Convenções

- **Locators semânticos**: `getByRole`, `getByLabel`, `getByText`. Nada de `page.locator(".classe-css")`.
- **Login sempre via UI real** (`tests/helpers/auth.ts`), nunca injeção direta de cookie de sessão — os testes de auth/isolamento precisam exercitar o fluxo verdadeiro, não um atalho que mascare bug no próprio login.
- **Sem `waitForTimeout`**: usar `expect(locator).toBeVisible()`/`toHaveURL()` (auto-retry nativo do Playwright) em vez de sleep artificial.
- **Sem estado compartilhado entre testes**: cada teste que precisa de sessão faz seu próprio login; não há `storageState` global reutilizado nesta baseline.
- **IDs de fixture prefixados `e2e-`**: nunca reutilizar os ids de `seed-data.ts`.

## Estratégia E2E

Cobre só os fluxos definidos como baseline nesta etapa (ver lista completa nos arquivos de `tests/e2e/`): boot da aplicação, login (válido/inválido) de igreja, criação de campanha, página pública de campanha, isolamento entre tenants, bootstrap de webmaster.

**O teste de isolamento multi-tenant (`tests/e2e/security/tenant-isolation.spec.ts`) usa `test.fail()`** — está marcado como falha esperada porque reproduz uma vulnerabilidade real e conhecida (`docs/AUDIT.md`, achado C1), não corrigida nesta etapa por instrução explícita. Quando a correção entrar (`docs/BACKLOG.md`, DZP-001), o teste vai passar a **passar**, e o Playwright vai reportar isso como "falha esperada que não aconteceu" — é o sinal para remover o `test.fail()`.

## O que NÃO deve ser testado com Playwright

- **Regras de negócio puras** (cálculo de comissão, formatação de moeda, validação de Pix) — pertencem a testes unitários (ainda não configurados; próximo passo natural seria Vitest, dado o uso de Vite/TS nativo do projeto — não decidido ainda).
- **Queries/repositório isolados** (`src/lib/db/repo.ts`) — testes de integração mais baratos que subir um browser inteiro.
- **Detalhes visuais/pixel-perfect** — fora do escopo de E2E funcional.
- **Todo o sistema de uma vez** — a suíte cresce incrementalmente; não expandir pra "testar tudo" numa PR só.
- **Gateway de pagamento real** — não existe ainda (mock), ver `docs/ARCHITECTURE.md`.

## CI/CD

Não configurado nesta etapa (fora de escopo, por instrução explícita). Quando for montado, a sequência recomendada num pipeline (`lint → typecheck → build → E2E`) é:

```yaml
# esboço conceitual, não um workflow pronto
- run: npm run lint
- run: npx tsc --noEmit
- run: npm run build
- run: npx playwright install --with-deps chromium
- run: npm run test:e2e
  env:
    TEST_DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
```

`TEST_DATABASE_URL` no CI deve apontar para um branch de teste do Neon dedicado ao pipeline (nunca o mesmo branch usado localmente por um dev, para evitar truncar dados um do outro em execuções concorrentes) — decisão a tomar quando o CI for montado de fato.
