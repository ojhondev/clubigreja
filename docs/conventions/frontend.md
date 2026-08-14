# Convenções de Frontend

## Stack

React 19, Next.js 16 App Router, Tailwind CSS v4, Framer Motion (animações),
Recharts (gráficos do dashboard).

## Componentes

`PascalCase`, um componente por arquivo, props tipadas explicitamente.
Componentes organizados por área em `src/components/` (`dashboard/`,
`landing/`, `simulacao/`) em vez de uma pasta `components/` plana. Preferir
composição a props excessivamente genéricas.

## Estado

Estado local (`useState`) ou dados vindos de Server Component/Server Action
para a maioria dos casos. Sessão e papel do usuário via cookie assinado
(`src/lib/auth/`), não via estado global de cliente. Só introduzir um
gerenciador de estado global se a complexidade justificar.

## Testes

Sem suíte automatizada configurada. Ao adicionar testes de frontend,
cobrir o caminho principal e os estados de erro visíveis ao usuário
(ex.: Pix rejeitado, cartão recusado); reservar E2E para os fluxos
críticos de doação/pagamento, não para cada tela.
