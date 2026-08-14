# UX.md — Dizipay

Avaliação feita lendo o código JSX/TSX real das telas (não é opinião estética solta — cada nota tem base em código lido).

## Princípios de UX pretendidos pelo produto

Confiança financeira + simplicidade + transparência, para um público "nem sempre familiarizado com tecnologia" (citação do README original). Isso implica: fluxos curtos, feedback claro em cada ação, e nenhuma ambiguidade sobre o que aconteceu com o dinheiro.

## Navegação e arquitetura da informação

Rotas segmentadas por perfil (`igreja/`, `fiel/`, `webmaster/`) mais páginas públicas — arquitetura de informação clara e previsível. Nav da landing com scroll listener e menu mobile funcional, `aria-label` presente.

## Componentes / design system

`src/components/ui.tsx` existe e é usado na maioria das telas (`Card`, `Button`, `Badge`, `StatCard`, `ProgressBar`, `PageHeader`). **Lacuna**: não há `Input`/`Select`/`Textarea` central — formulários reimplementam estilo de campo com classes Tailwind repetidas em vez de reusar um componente.

## Avaliação por tela/fluxo

### Landing page — 7/10
19 componentes, ~1255 linhas, 13 seções emendadas. Visualmente coerente, CTA repetido e claro, mas **extensa demais** para uma landing de captação — risco de fadiga de scroll, dilui o objetivo "simplicidade".

### Fluxo de doação (`doar/pagar/*`, `fiel/doar/*`) — 5/10 — tela de maior risco
Fluxo é curto e bem desenhado na etapa de produto (3 telas: valor → Pix → comprovante), adequado ao público-alvo. Mas:
- **Loading state ausente**: `<form action={...}>` cru, sem `useFormStatus`/`useActionState`, sem spinner/disabled durante submit — risco de duplo clique numa tela onde dinheiro muda de mão.
- **Error state ausente e crítico**: em `doarPublicoAction` (`doar/link/[linkId]/actions.ts:20`), validação falha resulta em `return` silencioso — usuário fica na mesma tela sem entender por quê.
- O padrão correto **já existe no código** (`cadastrar-igreja`, ver abaixo) — só não foi replicado aqui, que é o fluxo mais crítico do produto.

### Dashboard da igreja — 6/10
Empty states bons ("Nenhuma campanha ativa", "Nenhuma contribuição ainda"). Mas: **dois `<select>` de filtro sem `onChange`** — enfeite que parece funcional e não é; `<p>Banner de anúncio</p>` como placeholder literal visível em produção; sem Suspense/streaming, página fica em branco até todos os `await` resolverem.

### Cadastro de igreja/fiel — 8/10 — melhor tela do produto
`useActionState` corretamente implementado: `pending` (texto muda para "Enviando…", `disabled`), erro renderizado. Copy transparente sobre o fluxo ("conta entra em análise", "Dizipay nunca recebe esse valor"). **Este é o padrão de referência a replicar em todo o resto do produto.**

### Login — 8/10
Seletor de perfil simples, dois cards claros, sem fricção.

### Mural / campanhas — 5/10
Formulário de publicação sem `useActionState`/pending/confirmação de sucesso. Empty state **ausente** na lista de comunicados (lista simplesmente não renderiza nada se vazia) — inconsistente com o padrão bom usado no dashboard.

### Perfil da igreja — 7/10
Empty state correto para links extras. Ação de remover link **sem confirmação** (delete direto no clique, sem modal "tem certeza?").

### WebMaster — 7/10
Tela minimalista, lógica condicional de copy entre "setup" e "login" bem feita.

## Notas gerais (0–10)

| Critério | Nota | Justificativa |
|---|---|---|
| UX geral | 6/10 | Fluxos curtos e arquitetura de informação clara, mas o fluxo mais crítico (doação) não trata erro nem loading |
| UI geral (visual) | 7/10 | Visual consistente, sem exagero de gradiente/sombra, alinhado ao objetivo "confiança + simplicidade" |
| Consistência de design system | 6/10 | `ui.tsx` usado na maioria das telas, mas falta `Input`/`Select`/`Textarea` central |
| Estados (loading/empty/error/success) | 4/10 | Padrão de excelência existe mas não é replicado nas telas de maior risco |
| Responsividade | 7/10 | Uso consistente de `sm:`/`md:`/`lg:` nas telas observadas |
| Acessibilidade | 5/10 | `alt` presente em imagens Next/Image, alguns `aria-label`, mas `<img>` cru sem alt tratado no QR Code; contraste/teclado não verificados (fora do escopo de leitura estática) |

## Achado transversal mais importante

O padrão correto de estado (`useActionState` + pending + erro estruturado) **já existe e funciona** em pelo menos uma tela (`cadastrar-igreja`). Ele não foi propagado para as telas de maior risco financeiro/UX (doação, mural). É uma inconsistência de aplicação de um padrão que o time já sabe fazer certo — não uma lacuna de conhecimento. **Replicar esse padrão existente é a ação de maior custo-benefício em todo o produto.**

## Recomendações priorizadas

1. Aplicar `useActionState` (loading + erro) no fluxo de doação (`doar/pagar`, `fiel/doar`) — P0, é onde dinheiro muda de mão.
2. Mesmo padrão no formulário do mural, com confirmação de sucesso.
3. Remover ou implementar de verdade os filtros do dashboard (`onChange` ausente).
4. Substituir `<p>Banner de anúncio</p>` por conteúdo real ou remover.
5. Adicionar confirmação em ações destrutivas (remover link extra e equivalentes).
6. Criar `Input`/`Select`/`Textarea` no design system (`ui.tsx`) e migrar formulários gradualmente.
7. Considerar reduzir/segmentar a landing page (13 seções é muito para o objetivo de conversão).
