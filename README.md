# Dizipay

Plataforma de captação de recursos para igrejas: dízimo, ofertas e campanhas via Pix e cartão, com a taxa de processamento cobrada à parte do fiel — a doação em si vai 100% direto para a chave Pix da própria igreja, sem custódia pelo Dizipay.

🔗 [club-igreja.vercel.app](https://club-igreja.vercel.app) (ambiente de demonstração)

## Stack

- **Next.js 16** (App Router, Turbopack, Server Actions)
- **TypeScript**
- **Tailwind CSS v4** + **Biome** (formatação) + **ESLint** (lint)
- **Postgres (Neon) via Drizzle ORM**
- **Recharts** (gráficos do dashboard) · **Framer Motion** (animações)

## Estado do projeto

Banco de dados (Postgres/Neon) e autenticação (scrypt) são **reais**. O gateway de pagamento continua **mockado**: o Pix gerado é real (payload EMV válido), mas a confirmação de pagamento depende do fiel clicar "já paguei" — não há integração bancária nem webhook ainda. Ver [`docs/AUDIT.md`](docs/AUDIT.md) para o levantamento completo do que falta antes de produção com dinheiro real de terceiros.

## Principais módulos

- **Painel da Igreja** — dashboard com gráficos reais, campanhas, links de pagamento, eventos, mural, relatórios com exportação CSV.
- **App do Fiel** — mural da igreja, campanhas em captação, histórico de contribuições, notificações push.
- **Onboarding** — cadastro de igreja com aprovação, cadastro de fiel, página pública por slug, QR Code para links e campanhas.
- **WebMaster** — hub interno de aprovação de igrejas e suporte (hierarquia de acesso com convites).
- **Landing page** — página institucional com calculadora de arrecadação e simulação interativa do fluxo do produto (`/simulacao`).

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Variáveis de ambiente necessárias: `DATABASE_URL` (ou `POSTGRES_URL`), `SESSION_SECRET` (obrigatório em produção).

## Build de produção

```bash
npm run build
npm start
```

## Testes E2E

```bash
npm run test:e2e         # roda a suíte completa (headless)
npm run test:e2e:ui      # UI mode interativo
npm run test:e2e:headed  # com browser visível
npm run test:e2e:report  # abre o relatório da última execução
```

Requer `TEST_DATABASE_URL` (banco de teste dedicado, nunca o mesmo de `DATABASE_URL`) para os testes que dependem de dados — sem ela, esses testes são pulados automaticamente. Ver [`docs/TESTING.md`](docs/TESTING.md).

## Documentação

Documentação completa em [`/docs`](docs/):

- [`PROJECT.md`](docs/PROJECT.md) — o que é o produto, problema, solução, público
- [`PRODUCT.md`](docs/PRODUCT.md) — personas, fluxos, funcionalidades (existente/planejado)
- [`ARCHITECTURE.md`](docs/ARCHITECTURE.md) — stack, camadas, decisões arquiteturais
- [`DATABASE.md`](docs/DATABASE.md) — entidades, relações, multi-tenancy
- [`API.md`](docs/API.md) — Server Actions e as poucas rotas HTTP reais
- [`SECURITY.md`](docs/SECURITY.md) — matriz de segurança, LGPD
- [`UX.md`](docs/UX.md) — avaliação de UX/UI por tela
- [`AUDIT.md`](docs/AUDIT.md) — auditoria técnica objetiva (critical/high/medium/low)
- [`ROADMAP.md`](docs/ROADMAP.md) e [`BACKLOG.md`](docs/BACKLOG.md) — o que vem a seguir
- [`CHECKLIST.md`](docs/CHECKLIST.md) — prontidão para produção
- [`DECISIONS.md`](docs/DECISIONS.md) — ADRs
- [`TESTING.md`](docs/TESTING.md) — infraestrutura de testes E2E (Playwright)
- [`conventions/`](docs/conventions/) — convenções de código de backend e frontend
