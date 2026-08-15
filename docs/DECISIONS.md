# DECISIONS.md — Dizipay

Registra decisões arquiteturais reais (encontradas no histórico do projeto) e decisões recomendadas para o futuro (marcadas como "Proposto"). Nenhuma decisão fictícia.

---

# ADR-001

## Decision
A doação vai 100% direto para a chave Pix da própria igreja — sem split/subconta. A taxa de processamento é cobrada à parte, do fiel, no cartão salvo.

## Status
**Aceito** (implementado, commit `459c6b9`)

## Context
O modelo original considerava split de pagamento via subconta (provavelmente Asaas, dado o formato de contrato do gateway mockado). O período de avaliação do Asaas impõe limites incompatíveis com o produto: R$2.000/subconta, 10 subcontas, 60 dias.

## Alternatives
1. Split de pagamento com subconta por igreja (rejeitado — limites do provedor durante avaliação).
2. Dizipay custodia o valor e repassa depois (rejeitado — implícito, não há menção no código; aumentaria escopo regulatório).
3. Pix direto pra chave da igreja + taxa cobrada separadamente do fiel (escolhido).

## Why
Elimina por completo a necessidade de subconta/split e os limites regulatórios do período de avaliação do gateway. Também simplifica a mensagem de confiança pro cliente: "o Dizipay nunca recebe seu dízimo".

## Consequences
- Positivo: sem custódia de dinheiro de terceiro, menor superfície regulatória, mensagem de transparência forte.
- Negativo: sem controle direto sobre o recebimento — a confirmação de que o Pix realmente chegou na conta da igreja depende do fiel informar (ver H5/ADR-003 abaixo). Reconciliação bancária automática não é possível sem acesso à conta da igreja.

---

# ADR-002

## Decision
Server Actions do Next.js como via principal de mutação, com apenas 3 rotas HTTP reais (`src/app/api/`) para os casos que exigem endpoint público de verdade (busca de igreja, push).

## Status
**Aceito** (implementado desde o início do projeto)

## Context
Projeto full-stack num único deploy Next.js, sem consumidor externo de API hoje (só o próprio front).

## Alternatives
1. API REST tradicional com todas as rotas em `/api/*`.
2. Server Actions como via principal, API só onde necessário (escolhido).

## Why
Menos boilerplate, tipagem end-to-end nativa do Next.js, sem necessidade de client HTTP separado.

## Consequences
- Positivo: menos código, menos superfície de API pública pra proteger.
- Negativo: se o produto precisar de app mobile nativo ou integração de terceiro no futuro, será necessário desenhar uma camada de API formal (ver ARCHITECTURE.md/API.md).

---

# ADR-003 (Proposto)

## Decision
Antes de integrar um gateway de pagamento real, implementar webhook de confirmação server-to-server, substituindo (ou complementando) a confirmação manual do fiel como fonte de verdade.

## Status
**Proposto**

## Context
Hoje a confirmação de pagamento depende 100% do fiel clicar "já paguei" (`gateway.confirmarPagamento`), sem nenhuma verificação bancária. Isso é aceitável em mock, mas vira um problema de confiança e de segurança (ver AUDIT.md H1, H5, C2) assim que dinheiro real está em jogo.

## Alternatives
1. Manter confirmação manual mesmo em produção (mais simples, mas sem garantia real do dinheiro ter chegado).
2. Webhook do gateway como única fonte de verdade, clique do fiel vira só "aguarde confirmação" (mais seguro, exige integração completa com o provedor escolhido).
3. Híbrido: clique do fiel marca "aguardando confirmação bancária", webhook confirma de fato quando chegar.

## Why
Ainda não decidido — depende da escolha final de gateway (Asaas já sinalizado no código como candidato) e de como esse provedor expõe extrato/webhook para Pix recebido em chave de terceiro (a própria igreja, não o Dizipay).

## Consequences
A decidir quando o gateway for escolhido. Recomenda-se registrar a decisão final aqui como ADR-003 revisado.

---

# ADR-004 (Proposto)

## Decision
Corrigir os dois achados CRITICAL de multi-tenancy (C1, C2 em AUDIT.md) antes de qualquer onboarding de igreja real com volume.

## Status
**🟡 Implementado (Sprint 01) — aguardando verificação por teste E2E contra banco real antes de virar "Aceito" definitivamente.** Código corrigido; testes existem (`tests/e2e/security/`) mas não puderam ser executados nesta etapa por falta de `TEST_DATABASE_URL` no ambiente.

## Context
Achados desta auditoria: `getCampanha`/`getLinkPagamento` sem filtro de `igrejaId`, e `confirmarContribuicao` sem checagem de dono.

## Alternatives
Não aplicável — são bugs de segurança, não uma escolha de design.

## Why
Vazamento de dado entre tenants é inaceitável num produto que lida com dado financeiro de organizações distintas.

## Consequences
Nenhuma negativa relevante — a correção é local (2-3 funções) e não exige mudança de schema.

---

# ADR-005 (Proposto)

## Decision
Migrar colunas monetárias (`campanhas.meta`, `links_pagamento.valor_sugerido`, `contribuicoes.valor_bruto/taxa_percentual/taxa_valor/valor_total_fiel`) de `real` (ponto flutuante) para `numeric(12,2)` do Postgres.

## Status
**Proposto**

## Context
Auditoria de banco (`DATABASE.md`) encontrou que todo valor monetário do schema usa `real` — ponto flutuante de precisão simples, ~6-7 dígitos decimais significativos. Cálculo de taxa em `src/lib/comissao.ts` já usa `Math.round(x*100)/100` como paliativo pra imprecisão de ponto flutuante em JS, mas isso não impede erro de representação no próprio Postgres, nem erro acumulado em somas (`relatorios.ts` soma `valorBruto`/`taxaValor` de todas as contribuições de uma igreja).

## Alternatives
1. Manter `real` (rejeitado — risco cresce com volume/valor).
2. Integer em centavos (`10050` = R$100,50) — mais "correto" no sentido estrito, mas exige reescrever toda a camada de cálculo (`comissao.ts`, `calculadora-arrecadacao.ts`) pra trabalhar em inteiros.
3. `numeric(12,2)` — decimal exato do Postgres, sem os riscos de ponto flutuante, migration de tipo de coluna sem exigir reescrever a lógica de cálculo em reais decimais (escolhido).

## Why
`numeric(12,2)` resolve o problema de precisão com o menor blast radius — é uma mudança de tipo de coluna, não uma mudança de unidade de medida em toda a aplicação. Centavos-inteiros seria mais "canônico" para sistemas financeiros greenfield, mas o Dizipay já tem uma camada de cálculo inteira trabalhando em reais decimais; reescrevê-la agora seria refactor não solicitado nesta etapa.

## Consequences
Drizzle representa `numeric` como `string` em TS, não `number` — toca `src/lib/types.ts` e todo ponto que faz aritmética direta sobre esses campos (precisa `Number(valor)` explícito ou lib de decimal). Migration + mudança de aplicação em conjunto, não só schema. Ver `DATABASE-ROADMAP.md`, item 2.

---

# ADR-006 (Proposto)

## Decision
Expandir `contribuicoes.status` de `"aguardando_pix" | "confirmado"` para incluir `expirado`, `cancelado`, `falhou`, `estornado`; adicionar colunas `provider` e `external_payment_id` com unique constraint parcial para idempotência.

## Status
**Proposto**

## Context
Modelo atual de 2 estados não representa o domínio real de um pagamento — um Pix nunca pago fica "aguardando" para sempre, sem forma de diferenciar abandono de erro. Ausência de identificador de transação externa significa que não há como garantir idempotência quando um gateway real existir (ver ADR-003).

## Alternatives
1. Manter só os 2 estados atuais, tratar tudo mais como caso especial na aplicação (rejeitado — empurra complexidade de modelagem pra fora do banco, onde ela é mais frágil).
2. Expandir o enum de status + colunas de idempotência agora, mesmo sem gateway real ainda usá-las (escolhido) — estrutura pronta, sem uso até a integração acontecer.

## Why
Corrigir o modelo de dados antes da pressão de uma integração real em andamento é mais barato do que migrar em produção com dinheiro real fluindo. A estrutura de idempotência (`UNIQUE(provider, external_payment_id) WHERE external_payment_id IS NOT NULL`) é barata de ter pronta e cara de faltar quando for necessária.

## Consequences
Nenhum dado existente precisa mudar (é `ALTER TABLE ADD COLUMN` + `CHECK` novo). Novas colunas ficam `NULL` até a integração real existir. Ver `DATABASE-ROADMAP.md`, item 3.

---

# ADR-007 (Proposto)

## Decision
Migrar colunas de timestamp (`criada_em`, `criado_em`, `publicado_em`, `convite_expira_em`) de `text` para `timestamptz`, sempre com granularidade completa (data + hora), nunca só data.

## Status
**Proposto**

## Context
Todas as colunas de timestamp do schema são `text` (string ISO), não o tipo nativo do Postgres. Além disso, a função `hoje()` local de `src/lib/db/repo.ts` usada na maioria dos inserts trunca pra `YYYY-MM-DD` (sem hora) — duas contribuições no mesmo dia não são ordenáveis entre si por horário de criação.

## Alternatives
1. Manter `text` (rejeitado — perde comparação/ordenação nativa garantida pelo tipo, e a truncagem de hora já causa perda de informação hoje).
2. `timestamp` sem timezone (rejeitado — ambíguo quanto a fuso, já existe inconsistência de granularidade que uma mudança de tipo sem timezone não resolveria).
3. `timestamptz`, sempre com hora completa (escolhido) — instante absoluto, sem ambiguidade, comparável nativamente.

## Why
`timestamptz` é o tipo padrão recomendado do Postgres para "quando isso aconteceu" — resolve timezone de uma vez (armazena UTC internamente, conversão de exibição fica na aplicação) e permite `ORDER BY`/`WHERE` nativos e eficientes, ao contrário de comparação lexicográfica de string.

## Consequences
Exige tocar todo ponto de insert em `repo.ts` (trocar a `hoje()` local truncada por `new Date()` completo) — não é só `ALTER COLUMN`. Dado histórico migrado via `USING criada_em::timestamptz` fica com granularidade de meia-noite (não pode "ganhar" precisão de hora retroativamente). Ver `DATABASE-ROADMAP.md`, item 4.

---

# ADR-008

## Decision
Para recurso tenant-scoped acessado fora do próprio tenant (C1), responder com 404 (`notFound()`), não 403. Para impersonação de webmaster (H2), restringir a Master Primário via `podeImpersonar()` sem criar nova coluna de permissão. Para o fluxo público de doação/confirmação de convidado, manter o id da contribuição como único controle de acesso (capability), sem exigir sessão.

## Status
**Aceito** (implementado, Sprint 01)

## Context
Ao corrigir C1/C2/H2 (`docs/AUDIT.md`), três decisões de design precisavam ser tomadas e não eram óbvias só pela descrição do bug:
1. Resposta a acesso cross-tenant: 403 ou 404?
2. Impersonação: criar uma flag de permissão nova (migration) ou usar o que já existe?
3. O fluxo público de doação/pagamento sem login não tem sessão — como fica a autorização lá?

## Alternatives

**(1) 403 vs 404**: 403 confirmaria "esse recurso existe, mas você não pode vê-lo" — vaza a existência de dado de outro tenant. 404 não distingue "não existe" de "existe mas não é seu". Escolhido: 404, consistente com o padrão que as duas páginas de QR code já usavam para campanha/link genuinamente inexistente.

**(2) Impersonação**: (a) nova coluna `pode_impersonar` no schema — mais granular, mas é migration, fora do fluxo deste sprint (`docs/DATABASE-ROADMAP.md` trata isso separadamente); (b) reaproveitar `podeAprovarIgrejas`/`podeGerenciarPagamentos` — rejeitado, semanticamente errado (essas flags autorizam ações específicas, não "ver tudo de qualquer conta"); (c) restringir a `nivel === "primario"` — escolhido, zero migration, fecha o risco por completo (Master Primário já tem acesso total por design, segundo o próprio schema).

**(3) Fluxo público**: (a) exigir login pra confirmar qualquer pagamento — rejeitado, quebra o caso de uso de doação sem cadastro, que é intencional; (b) manter capability-based (id de 10 hex chars, ~40 bits de entropia, não força-bruteável na prática) — escolhido, é o modelo que o produto já usa pra link/campanha públicos.

## Why
Cada decisão prioriza não vazar mais informação do que o necessário (1), não introduzir mudança de schema fora do fluxo combinado com quem cuida do banco (2), e não quebrar um caso de uso legítimo do produto só para "fechar" uma checagem que não se aplica a esse fluxo (3).

## Consequences
- (1) Usuário vendo 404 num recurso que na verdade existe (só não é dele) pode achar que o id está errado — aceitável, é o trade-off de não vazar existência.
- (2) Master Secundário continua vendo o botão "Acessar como" na UI mesmo sem poder usá-lo (ação rejeita silenciosamente) — não corrigido nesta etapa por instrução explícita de não redesenhar telas; registrado como polish futuro em `docs/AUDIT.md` (nota em H2).
- (3) O fluxo de convidado continua dependendo só da imprevisibilidade do id como controle de acesso — aceitável hoje (mock, sem dinheiro real fora da própria chave Pix da igreja), mas deve ser revisitado se/quando o produto adicionar informação mais sensível a essa tela.
