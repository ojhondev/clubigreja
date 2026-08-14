# Convenções de Backend

## Stack

Next.js 16 (App Router, Server Actions), TypeScript, Drizzle ORM sobre
Postgres (Neon serverless).

## Camadas

Server Actions (`src/lib/auth/actions.ts` e afins) são a via principal de
mutação — preferir a elas em vez de criar novas rotas em `src/app/api/`.
Reservar `src/app/api/` para casos que precisam de um endpoint HTTP real
(chamado por terceiros, ou por `fetch` do client sem form action). Não
misturar regra de negócio na Server Action: delegar para funções puras em
`src/lib/` (`dizimo.ts`, `comissao.ts`, etc.) e persistência para
`src/lib/db/repo.ts`.

## Tratamento de erros

`throw` é aceitável dentro de Server Actions (o Next.js captura e propaga
para o boundary de erro). Nas funções puras de `src/lib/`, preferir retorno
explícito (`null`, union discriminado) quando o chamador precisa distinguir
o motivo da falha, em vez de exceptions para fluxo esperado.

## Dados

Schema único em `src/lib/db/schema.ts`. Toda mudança de schema gera
migration via `npm run db:generate` e é aplicada via `npm run db:migrate` —
não editar SQL em `drizzle/` manualmente.

## Testes

Sem suíte automatizada configurada. Ao adicionar testes de backend,
mockar apenas fronteiras do sistema (banco de dados, gateway de pagamento
externo) e nomear `arquivo-alvo.test.ts`.
