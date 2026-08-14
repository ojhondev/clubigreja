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
**Proposto** — deveria virar "Aceito" assim que implementado (DZP-001, DZP-002).

## Context
Achados desta auditoria: `getCampanha`/`getLinkPagamento` sem filtro de `igrejaId`, e `confirmarContribuicao` sem checagem de dono.

## Alternatives
Não aplicável — são bugs de segurança, não uma escolha de design.

## Why
Vazamento de dado entre tenants é inaceitável num produto que lida com dado financeiro de organizações distintas.

## Consequences
Nenhuma negativa relevante — a correção é local (2-3 funções) e não exige mudança de schema.
