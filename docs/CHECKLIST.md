# CHECKLIST.md — Dizipay

## MVP funcional (fluxo de produto — já majoritariamente pronto)

- [x] Auth (igreja/fiel/webmaster)
- [x] Cadastro e aprovação de igreja
- [x] Cadastro de fiel (com fluxo convidado)
- [x] Campanhas com meta/prazo
- [x] Página pública da igreja
- [x] Contribuição (Pix real + cartão mockado)
- [x] Dashboard financeiro
- [ ] Segurança (multi-tenancy corrigida — DZP-001, DZP-002)
- [~] Responsividade (boa nas telas auditadas, não testado em todos os breakpoints)
- [ ] Error states (ausentes no fluxo de doação — DZP-007)
- [ ] Loading states (ausentes no fluxo de doação — DZP-007)
- [~] Empty states (bons no dashboard, ausentes no mural — DZP-008)
- [ ] Testes (nenhum existe — DZP-016)
- [x] Deploy (Vercel, já em uso conforme README)

## Production readiness (antes de captar dinheiro real de terceiros em escala)

- [x] Secrets fora do código (env vars usadas corretamente, exceto fallback dev documentado — DZP-003)
- [ ] Logging estruturado (hoje só 1 console.log inofensivo — ok por ora, sem infra de log formal)
- [ ] Monitoring (nenhum configurado)
- [ ] Error tracking (nenhum configurado — ex: Sentry)
- [ ] Backups (depende de configuração do provedor Neon — não verificado no código)
- [ ] Rate limiting (DZP-014)
- [x] Security review (esta auditoria — AUDIT.md)
- [ ] Database indexes (DZP-009, DZP-010)
- [ ] Webhook idempotency (DZP-005, DZP-013 — depende de gateway real)
- [ ] LGPD (DZP-015)
- [ ] Disaster recovery (não verificado/documentado)

Legenda: `[x]` feito · `[~]` parcial · `[ ]` pendente.
