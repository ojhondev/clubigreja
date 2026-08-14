# ARCHITECTURE.md — Dizipay

> Versão detalhada e com avaliação crítica. Para a versão resumida (mapa de pastas), ver [`architecture/overview.md`](architecture/overview.md).

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack, Server Actions) |
| Linguagem | TypeScript (strict) |
| UI | React 19, Tailwind CSS v4, Framer Motion, Recharts |
| Banco de dados | Postgres (Neon serverless, driver HTTP) via Drizzle ORM |
| Autenticação | Cookie de sessão assinado com HMAC-SHA256 (não JWT), senha com scrypt |
| Push | Web Push API + VAPID (gerado em memória — ver lacuna abaixo) |
| Lint | ESLint (`eslint-config-next`) |
| Format | Biome (só formatação) |
| Testes | Nenhum framework configurado |
| CI/CD | Nenhum configurado (`.github/` não existe) |

## Frontend

App Router com rotas segmentadas por perfil (`igreja/`, `fiel/`, `webmaster/`) mais páginas públicas. **Server Actions são a via principal de mutação** — não uma API REST tradicional. Apenas 3 rotas reais em `src/app/api/`: busca pública de igreja por slug, subscribe de push, e vapid public key.

Design system parcial em `src/components/ui.tsx` (`Card`, `Button`, `Badge`, `StatCard`, `ProgressBar`, `PageHeader`), usado na maioria das telas — mas **sem componentes `Input`/`Select`/`Textarea` centrais**, então formulários reimplementam estilo de campo com classes Tailwind repetidas (achado do fork de UX).

**Inconsistência de padrão de estado confirmada**: `cadastrar-igreja/form.tsx` usa `useActionState` corretamente (pending, erro tratado) — esse é o padrão certo do projeto — mas não foi replicado no fluxo de doação (`doar/pagar/*`) nem no mural, que são Server Actions com `<form action={...}>` cru, sem feedback de loading/erro. Ver UX.md e AUDIT.md.

## Backend (dentro do próprio Next.js — não há serviço separado)

- **Mutação/orquestração**: Server Actions (`src/lib/auth/actions.ts` e demais `actions.ts` por rota).
- **Middleware** (`src/proxy.ts`): gate de papel por prefixo de rota (`/igreja/*`, `/fiel/*`, `/admin/*`) — **não** verifica posse do recurso (ver DATABASE.md, achados críticos de multi-tenancy).
- **Autorização fina**: revalidada ação por ação dentro de cada Server Action (sem RBAC centralizado) — funciona, mas depende de disciplina manual em cada nova action.
- **Domínio puro**: `src/lib/dizimo.ts`, `comissao.ts`, `calculadora-arrecadacao.ts`, `pix.ts` — sem acesso a banco/rede.
- **Pagamento**: `src/lib/payments/` — abstração `PaymentGateway`, mock ativo, ponto de troca único (`payments/index.ts`) para integração real.
- **Dados**: `src/lib/db/` — client Drizzle, schema único, repositório de acesso (`repo.ts`, ~1000+ linhas, concentra toda query).

## Banco de dados

Ver [`DATABASE.md`](DATABASE.md) para o detalhamento completo (ERD, tabelas, achados de multi-tenancy).

## Autenticação e autorização

Ver [`SECURITY.md`](SECURITY.md) para o detalhamento completo. Resumo: mecanismo de sessão correto e bem implementado (HMAC, scrypt, `timingSafeEqual`, flags de cookie corretas); RBAC é checado corretamente por papel mas sem verificação centralizada de posse de recurso, e o sistema de impersonação do WebMaster (`Acessar como`) não tem flag de permissão própria.

## Integrações

- **Pagamento**: nenhuma real hoje. Comentário no código (`payments/index.ts`) indica intenção de integrar Asaas.
- **Push**: Web Push nativo do navegador, sem serviço terceiro (não usa Firebase/OneSignal) — decisão correta para simplicidade, mas a implementação atual (VAPID em memória, subscriptions em array) não sobrevive a cold start serverless.

## Arquitetura de pastas

```
src/
├── app/            # rotas (App Router), por perfil + públicas + api/
├── components/      # UI, parcialmente compartilhada (dashboard/, landing/, simulacao/)
└── lib/
    ├── auth/         # sessão, cookie, senha, permissões, actions de auth
    ├── db/           # client, schema, repo (acesso a dados)
    ├── payments/      # abstração de gateway + mock
    └── push/          # vapid, store de inscrições (em memória)
```

## Fluxo de dados (doação, exemplo)

1. Página pública (`doar/link/[linkId]` ou `doar/campanha/[campanhaId]`) chama Server Action.
2. Action calcula taxa (`comissao.ts`), gera Pix real (`pix.ts`), persiste `Contribuicao` com `status: "aguardando_pix"` via `repo.ts`.
3. Fiel paga o Pix fora do sistema (app do banco dele) e volta pra clicar "já paguei".
4. Novo Server Action chama `gateway.confirmarPagamento`, que muda `status` para `"confirmado"` — **sem verificação bancária real**.
5. Dashboard/relatórios agregam contribuições com `status === "confirmado"`.

## Pontos problemáticos (classificação de arquitetura)

### CRITICAL
- `getCampanha`/`getLinkPagamento` sem filtro de `igrejaId` em rotas autenticadas — vazamento entre tenants (ver DATABASE.md).
- Confirmação de pagamento sem checagem de posse (`confirmarContribuicao` aceita qualquer `contribuicaoId` vindo de input hidden) — ver SECURITY.md/PAGAMENTOS.

### HIGH
- Nenhuma idempotência na confirmação de pagamento.
- Impersonação de webmaster sem flag de permissão própria.
- Fallback de `SESSION_SECRET` inseguro não é bloqueado fora de `NODE_ENV=production` explícito.
- VAPID/push em memória — não sobrevive a redeploy/cold start.

### MEDIUM
- Sem rate limiting em nenhuma rota de login.
- Sem índices em FKs usadas em toda query por tenant.
- `autenticarFiel`/`getFielPorTelefone` carregam toda a tabela `fieis` em memória — não escala.
- Sem `.env.example`, sem CI/CD, sem testes.

### LOW
- Sem security headers (CSP, X-Frame-Options) em `next.config.ts`.
- `webmasters.convidadoPorId` sem FK declarada (inconsistência de schema).
- Dois `<select>` de filtro decorativos no dashboard (sem `onChange`) — mais UX do que arquitetura, mas indica risco de "feature fantasma".

Ver detalhamento completo, com arquivo:linha e recomendação, em [`AUDIT.md`](AUDIT.md).
