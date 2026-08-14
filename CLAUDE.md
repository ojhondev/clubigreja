# Club Igreja — Instruções para o Claude Code

## Projeto

**Club Igreja** — SaaS para igrejas arrecadarem dízimo, ofertas e campanhas via
Pix e cartão, com comissão automática via split de pagamento. Dois perfis de
usuário (igreja e fiel) mais um hub interno (WebMaster). Empresa ainda não
formalizada: gateway de pagamento é mockado no formato da API do Asaas
(`src/lib/payments/`), pronto para trocar por integração real sem tocar nas
telas que o chamam.

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack, Server Actions) |
| Linguagem | TypeScript |
| UI | React 19, Tailwind CSS v4, Framer Motion, Recharts |
| Banco de dados | Postgres (Neon serverless) via Drizzle ORM |
| Autenticação | Cookie de sessão assinado, senha com scrypt (nativo do Node) |
| Lint | ESLint (`eslint-config-next`) |

Sem framework de testes configurado no momento.

## Arquitetura

- `src/app/` — rotas do App Router, organizadas por perfil: `igreja/`,
  `fiel/`, `webmaster/`, mais páginas públicas (`doar/`, `cadastrar-*`,
  `entrar/`, `[slug]/`).
- `src/app/api/` — só para os poucos casos que exigem HTTP real (busca de
  igreja por slug, push notifications). A via principal para mutações é
  **Server Actions** em `src/lib/auth/actions.ts` e afins, não rotas de API.
- `src/lib/db/` — client Drizzle (`client.ts`), schema (`schema.ts`) e
  repositório de acesso a dados (`repo.ts`). Migrations em `drizzle/`,
  geradas via `npm run db:generate` e aplicadas via `npm run db:migrate`.
- `src/lib/payments/` — abstração de gateway de pagamento (`gateway.ts`
  define o contrato `PaymentGateway`; `mock-gateway.ts` implementa sem
  chamar API externa; `index.ts` é o único ponto de troca para a
  integração real).
- `src/lib/auth/` — sessão, cookies, hash de senha (scrypt) e permissões
  por papel (`Papel`: igreja, fiel, webmaster).
- `src/components/` — componentes de UI, organizados por área
  (`dashboard/`, `landing/`, `simulacao/`).

## Documentação

- [`docs/architecture/overview.md`](docs/architecture/overview.md) — camadas e fluxo de dados
- [`docs/conventions/backend.md`](docs/conventions/backend.md) — convenções de Server Actions, API routes e acesso a dados
- [`docs/conventions/frontend.md`](docs/conventions/frontend.md) — convenções de componentes e estado
- [`docs/decisions/`](docs/decisions/) — ADRs (decisões de arquitetura)

## Convenções

### Dependências

- **Sempre instalar/atualizar para a versão mais recente** dos pacotes. Não
  fixar versões antigas.
- Ao subir majors, rodar typecheck/build/lint e corrigir os breaks antes de
  seguir.

### Qualidade (obrigatório antes de concluir/commitar)

```bash
npm run lint
npx tsc --noEmit
npm run build
```

### Commits

O histórico real deste projeto **não** usa Conventional Commits — usa frase
única em português, imperativo, capitalizada, sem prefixo de tipo:

```
Reduz fricção no checkout de doação avulsa + gestão de campanhas
Corrige Pix rejeitado por bancos e UX quebrada no checkout do cartão
```

- Assunto no **imperativo**: "adiciona", "corrige", "remove"
- Uma linha resumindo o quê; corpo opcional só quando o porquê não é óbvio
- Commit e push para `origin/main` são automáticos ao final de cada tarefa
  que altera código — ver seção **Git** abaixo, que tem prioridade sobre
  qualquer expectativa de confirmação manual.

### Código

- **Nomes**:
  - Diretórios e arquivos: `kebab-case`
  - Componentes React: `PascalCase`
  - Funções e variáveis: `camelCase`
  - Constantes globais: `UPPER_SNAKE_CASE`
- **Comentários em português** (convenção real do projeto, inclusive para
  explicar mecanismo/decisão técnica, não só regra de negócio)
- **Nomes de domínio em português** (`igreja`, `fiel`, `dizimo`, `comissao`,
  `senha`), nomes técnicos genéricos em inglês quando não há termo de
  domínio envolvido
- **Tratamento de erros**: `throw` é aceitável no fluxo de Server Actions
  (capturado pelo Next.js); evitar em funções puras de `src/lib/`, preferir
  retorno explícito (`null`, union de resultado) quando o caller precisa
  distinguir o motivo da falha

### ORM e migrations (Drizzle)

- Schema único em `src/lib/db/schema.ts`
- `npm run db:generate` para gerar migration a partir de mudanças no schema,
  `npm run db:migrate` para aplicar
- `npm run db:seed` popula dados de desenvolvimento (`src/lib/db/seed-data.ts`)
- Sem suíte de testes automatizada — validar mudanças de schema manualmente
  via `db:studio` antes de commitar

## Fluxo de trabalho

Ao concluir uma tarefa que altera código: rodar typecheck/build/lint (ver
seção Qualidade acima). Preferências pessoais de commit/push automático
ficam em `CLAUDE.local.md` (não versionado) — cada dev configura a sua.

---

<!-- Abaixo: instruções do RTK (específicas do Claude Code, geridas por `rtk init`). -->

<!-- rtk-instructions v2 -->
# RTK (Rust Token Killer) - Token-Optimized Commands

## Golden Rule

**Always prefix commands with `rtk`**. If RTK has a dedicated filter, it uses it. If not, it passes through unchanged. This means RTK is always safe to use.

**Important**: Even in command chains with `&&`, use `rtk`:
```bash
# ❌ Wrong
git add . && git commit -m "msg" && git push

# ✅ Correct
rtk git add . && rtk git commit -m "msg" && rtk git push
```

## RTK Commands by Workflow

### Build & Compile (80-90% savings)
```bash
rtk cargo build         # Cargo build output
rtk cargo check         # Cargo check output
rtk cargo clippy        # Clippy warnings grouped by file (80%)
rtk tsc                 # TypeScript errors grouped by file/code (83%)
rtk lint                # ESLint/Biome violations grouped (84%)
rtk prettier --check    # Files needing format only (70%)
rtk next build          # Next.js build with route metrics (87%)
```

### Test (60-99% savings)
```bash
rtk cargo test          # Cargo test failures only (90%)
rtk go test             # Go test failures only (90%)
rtk jest                # Jest failures only (99.5%)
rtk vitest              # Vitest failures only (99.5%)
rtk playwright test     # Playwright failures only (94%)
rtk pytest              # Python test failures only (90%)
rtk rake test           # Ruby test failures only (90%)
rtk rspec               # RSpec test failures only (60%)
rtk test <cmd>          # Generic test wrapper - failures only
```

### Git (59-80% savings)
```bash
rtk git status          # Compact status
rtk git log             # Compact log (works with all git flags)
rtk git diff            # Compact diff (80%)
rtk git show            # Compact show (80%)
rtk git add             # Ultra-compact confirmations (59%)
rtk git commit          # Ultra-compact confirmations (59%)
rtk git push            # Ultra-compact confirmations
rtk git pull            # Ultra-compact confirmations
rtk git branch          # Compact branch list
rtk git fetch           # Compact fetch
rtk git stash           # Compact stash
rtk git worktree        # Compact worktree
```

Note: Git passthrough works for ALL subcommands, even those not explicitly listed.

### GitHub (26-87% savings)
```bash
rtk gh pr view <num>    # Compact PR view (87%)
rtk gh pr checks        # Compact PR checks (79%)
rtk gh run list         # Compact workflow runs (82%)
rtk gh issue list       # Compact issue list (80%)
rtk gh api              # Compact API responses (26%)
```

### JavaScript/TypeScript Tooling (70-90% savings)
```bash
rtk pnpm list           # Compact dependency tree (70%)
rtk pnpm outdated       # Compact outdated packages (80%)
rtk pnpm install        # Compact install output (90%)
rtk npm run <script>    # Compact npm script output
rtk npx <cmd>           # Compact npx command output
rtk prisma              # Prisma without ASCII art (88%)
```

### Files & Search (60-75% savings)
```bash
rtk ls <path>           # Tree format, compact (65%)
rtk read <file>         # Code reading with filtering (60%)
rtk grep <pattern>      # Search grouped by file (75%). Format flags (-c, -l, -L, -o, -Z) run raw.
rtk find <pattern>      # Find grouped by directory (70%)
```

### Analysis & Debug (70-90% savings)
```bash
rtk err <cmd>           # Filter errors only from any command
rtk log <file>          # Deduplicated logs with counts
rtk json <file>         # JSON structure without values
rtk deps                # Dependency overview
rtk env                 # Environment variables compact
rtk summary <cmd>       # Smart summary of command output
rtk diff                # Ultra-compact diffs
```

### Infrastructure (85% savings)
```bash
rtk docker ps           # Compact container list
rtk docker images       # Compact image list
rtk docker logs <c>     # Deduplicated logs
rtk kubectl get         # Compact resource list
rtk kubectl logs        # Deduplicated pod logs
```

### Network (65-70% savings)
```bash
rtk curl <url>          # Compact HTTP responses (70%)
rtk wget <url>          # Compact download output (65%)
```

### Meta Commands
```bash
rtk gain                # View token savings statistics
rtk gain --history      # View command history with savings
rtk discover            # Analyze Claude Code sessions for missed RTK usage
rtk proxy <cmd>         # Run command without filtering (for debugging)
rtk init                # Add RTK instructions to CLAUDE.md
rtk init --global       # Add RTK to ~/.claude/CLAUDE.md
```

## Token Savings Overview

| Category | Commands | Typical Savings |
|----------|----------|-----------------|
| Tests | vitest, playwright, cargo test | 90-99% |
| Build | next, tsc, lint, prettier | 70-87% |
| Git | status, log, diff, add, commit | 59-80% |
| GitHub | gh pr, gh run, gh issue | 26-87% |
| Package Managers | pnpm, npm, npx | 70-90% |
| Files | ls, read, grep, find | 60-75% |
| Infrastructure | docker, kubectl | 85% |
| Network | curl, wget | 65-70% |

Overall average: **60-90% token reduction** on common development operations.
<!-- /rtk-instructions -->