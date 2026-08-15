# BACKLOG.md — Dizipay

Prioridade: **P0** bloqueador/crítico · **P1** essencial pra MVP seguro · **P2** importante · **P3** futuro.
Esforço: **P** pequeno (horas) · **M** médio (1-2 dias) · **G** grande (multi-dia/depende de terceiro).

```text
[x] DZP-001 — Corrigir getCampanha/getLinkPagamento sem filtro de igrejaId
Priority: P0
Area: Security / Multi-tenancy
Status: Done (código) — aguardando teste E2E verde contra TEST_DATABASE_URL
Effort: P
Dependencies: —
Ref: AUDIT.md C1

[x] DZP-002 — Validar dono (fielId/igrejaId) em confirmarContribuicao
Priority: P0
Area: Security / Payments
Status: Done (código) — aguardando teste E2E verde contra TEST_DATABASE_URL
Effort: P
Dependencies: —
Ref: AUDIT.md C2

[ ] DZP-003 — SESSION_SECRET obrigatório incondicionalmente (não depender de NODE_ENV)
Priority: P1
Area: Security
Status: Todo
Effort: P
Dependencies: —
Ref: AUDIT.md H3

[x] DZP-004 — Flag de permissão dedicada para impersonação de WebMaster
Priority: P1
Area: Security / RBAC
Status: Done (código, sem migration — restrito a nivel=primario) — aguardando teste E2E verde
Effort: P
Dependencies: —
Ref: AUDIT.md H2

[ ] DZP-005 — Idempotência na confirmação de pagamento
Priority: P1
Area: Payments
Status: Todo
Effort: P
Dependencies: DZP-002
Ref: AUDIT.md H1

[ ] DZP-006 — Persistir push: chave VAPID fixa via env + tabela de inscrições no Postgres
Priority: P1
Area: Infra / Push
Status: Todo
Effort: M
Dependencies: —
Ref: AUDIT.md H4

[ ] DZP-007 — Aplicar useActionState (loading + erro) no fluxo de doação
Priority: P1
Area: UX
Status: Todo
Effort: M
Dependencies: —
Ref: UX.md, AUDIT.md M5

[ ] DZP-008 — Aplicar useActionState no formulário do mural (com confirmação de sucesso)
Priority: P2
Area: UX
Status: Todo
Effort: P
Dependencies: —
Ref: UX.md

[ ] DZP-009 — Índices em FKs (igreja_id, fiel_id, campanha_id) usadas em query por tenant
Priority: P2
Area: Database
Status: Todo
Effort: P
Dependencies: —
Ref: AUDIT.md M2

[ ] DZP-010 — Índice único (igreja_id, telefone) + otimizar autenticarFiel
Priority: P2
Area: Database / Auth
Status: Todo
Effort: P
Dependencies: —
Ref: AUDIT.md M3

[ ] DZP-011 — Criar .env.example
Priority: P2
Area: DX / Docs
Status: Todo
Effort: P
Dependencies: —
Ref: AUDIT.md M6

[ ] DZP-012 — Expandir estados de contribuição (cancelado/expirado/falhou/estornado) + expiração automática de Pix
Priority: P2
Area: Payments / Database
Status: Todo
Effort: M
Dependencies: Decisão de gateway real (DECISIONS.md)
Ref: AUDIT.md M4

[ ] DZP-013 — Endpoint de webhook de pagamento com validação de assinatura
Priority: P1 (bloqueador pra produção real)
Area: Payments
Status: Todo
Effort: G
Dependencies: Escolha de gateway (Asaas ou alternativa)
Ref: AUDIT.md H5, DECISIONS.md

[ ] DZP-014 — Rate limiting nas 3 rotas de login (igreja/fiel/webmaster)
Priority: P2
Area: Security
Status: Todo
Effort: M
Dependencies: —
Ref: AUDIT.md M1

[ ] DZP-015 — LGPD: consentimento explícito no cadastro + fluxo de exclusão/exportação de dados
Priority: P2
Area: Compliance
Status: Todo
Effort: M
Dependencies: Revisão jurídica de /privacidade e /termos
Ref: SECURITY.md

[ ] DZP-016 — Testes automatizados: auth, multi-tenancy, campanha, contribuição, pagamento, webhook, permissões
Priority: P2
Area: QA
Status: Todo
Effort: G
Dependencies: DZP-001, DZP-002, DZP-013
Ref: CHECKLIST.md

[ ] DZP-017 — CI básico (lint + typecheck + build em PR)
Priority: P2
Area: DevOps
Status: Todo
Effort: P
Dependencies: —

[ ] DZP-018 — Security headers (CSP, X-Frame-Options, Referrer-Policy)
Priority: P3
Area: Security
Status: Todo
Effort: P
Dependencies: —
Ref: AUDIT.md L1

[ ] DZP-019 — Declarar FK de webmasters.convidadoPorId
Priority: P3
Area: Database
Status: Todo
Effort: P
Dependencies: —
Ref: AUDIT.md L2

[ ] DZP-020 — Remover/implementar filtros decorativos do dashboard (selects sem onChange)
Priority: P3
Area: UX
Status: Todo
Effort: P
Dependencies: —
Ref: AUDIT.md L3

[ ] DZP-021 — Substituir placeholder "Banner de anúncio" por conteúdo real ou remover
Priority: P3
Area: UX
Status: Todo
Effort: P
Dependencies: —
Ref: AUDIT.md L4

[ ] DZP-022 — Confirmação em ações destrutivas (ex: remover link extra)
Priority: P3
Area: UX
Status: Todo
Effort: P
Dependencies: —
Ref: AUDIT.md L5

[ ] DZP-023 — Componentes Input/Select/Textarea no design system (ui.tsx)
Priority: P3
Area: Frontend
Status: Todo
Effort: M
Dependencies: —
Ref: AUDIT.md L6

[ ] DZP-024 — Decidir destino do enum "boleto" (remover ou implementar)
Priority: P3
Area: Product
Status: Todo
Effort: P
Dependencies: Decisão de produto
Ref: AUDIT.md L8

[ ] DZP-025 — npm audit fix (dependências de dev)
Priority: P3
Area: DX
Status: Todo
Effort: P
Dependencies: —
Ref: AUDIT.md L7

[x] DZP-026 — Escopar marcarNotificacaoLida por fielId (achado novo, Sprint 01)
Priority: P3
Area: Security
Status: Done (código) — aguardando teste E2E
Effort: P
Dependencies: —
Ref: AUDIT.md L10

[ ] DZP-027 — Rodar suíte E2E de segurança contra TEST_DATABASE_URL real e confirmar C1/C2/H2 verdes
Priority: P0
Area: QA
Status: Todo — bloqueado por falta de banco de teste configurado
Effort: P
Dependencies: TEST_DATABASE_URL (branch Neon dedicado, ver docs/TESTING.md)
Ref: docs/AUDIT.md C1/C2/H2, tests/e2e/security/

[ ] DZP-028 — Esconder/desabilitar botão "Acessar como" na UI para Master Secundário
Priority: P3
Area: UX
Status: Todo
Effort: P
Dependencies: DZP-004
Ref: AUDIT.md H2 (nota de UX não corrigida no Sprint 01)
```
