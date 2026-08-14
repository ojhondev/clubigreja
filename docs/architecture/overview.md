# Arquitetura — Club Igreja

## Camadas

- **Apresentação** (`src/app/**/page.tsx`, `src/components/`) — rotas do App
  Router segmentadas por perfil (`igreja/`, `fiel/`, `webmaster/`) e páginas
  públicas. Componentes reutilizáveis organizados por área em
  `src/components/`.
- **Mutação/orquestração** (`src/lib/auth/actions.ts` e Server Actions
  irmãs) — ponto de entrada principal para escrita. Poucas rotas em
  `src/app/api/` cobrem os casos que exigem HTTP puro (busca pública de
  igreja por slug, push notifications).
- **Domínio** (`src/lib/dizimo.ts`, `src/lib/comissao.ts`,
  `src/lib/calculadora-arrecadacao.ts`, `src/lib/pix.ts`) — regras de
  negócio puras, sem acesso direto a banco ou rede.
- **Pagamento** (`src/lib/payments/`) — abstração de gateway
  (`PaymentGateway`), com implementação mockada trocável por integração
  real (Asaas) sem alterar quem chama.
- **Dados** (`src/lib/db/`) — client Drizzle, schema único e repositório de
  acesso, sobre Postgres (Neon serverless).

## Fluxo de dados

1. Uma página em `src/app/` chama uma Server Action de `src/lib/auth/` (ou
   equivalente) para ler/escrever dados.
2. A action valida sessão/permissão via `src/lib/auth/session.ts` e
   `permissoes.ts`, aplica regra de negócio (`src/lib/dizimo.ts`,
   `comissao.ts`, etc.) e delega persistência a `src/lib/db/repo.ts`.
3. Para fluxo de doação, a action usa `src/lib/payments/` para gerar dados
   de pagamento (Pix copia-e-cola ou cobrança de cartão) — nenhum dinheiro
   muda de mãos na geração; a confirmação é um passo separado.
4. `src/lib/db/repo.ts` fala com Postgres (Neon) via Drizzle; migrations
   versionadas em `drizzle/`.
