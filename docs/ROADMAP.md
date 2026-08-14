# ROADMAP.md — Dizipay

Baseado no estado real encontrado na auditoria (ver [`AUDIT.md`](AUDIT.md)), não numa estrutura genérica copiada. O produto já tem um fluxo de ponta a ponta funcionando — o roadmap é sobre torná-lo seguro para dinheiro real, não sobre construir do zero.

## PHASE 0 — Fechar os riscos críticos (antes de qualquer usuário real com dinheiro)

- Corrigir vazamento de multi-tenancy (C1: `getCampanha`/`getLinkPagamento`)
- Corrigir confirmação de pagamento sem dono (C2)
- Corrigir fallback inseguro de `SESSION_SECRET` (H3)
- Adicionar flag de permissão para impersonação de WebMaster (H2)

Sem isso, qualquer volume real de igrejas/fiéis expõe dado financeiro entre tenants — não é uma fase opcional.

## PHASE 1 — Confiabilidade do que já existe

- Idempotência na confirmação de pagamento (H1)
- Persistir push (chave VAPID fixa + tabela de inscrições) (H4)
- Replicar `useActionState` (loading/erro) no fluxo de doação e no mural (M5)
- Índices em FKs + índice de telefone do fiel (M2, M3)
- `.env.example` (M6)

## PHASE 2 — Payments real

- Definir e integrar gateway real (Asaas, já sinalizado no código, ou alternativa — decisão de produto, ver DECISIONS.md)
- Endpoint de webhook com validação de assinatura (H5)
- Expandir estados de contribuição (`cancelado`, `expirado`, `falhou`, `estornado`) (M4)
- Expiração automática de Pix não pago

## PHASE 3 — Transparência e confiança (proposta de valor central do produto)

- Prestação de contas por campanha (o que a auditoria não encontrou implementado: atualização pública de progresso além da barra de meta)
- Relatórios mais completos para a igreja
- Rate limiting em login (M1)
- LGPD: consentimento explícito, exclusão/exportação de dados (M7)

## PHASE 4 — Escala e produção real

- Testes automatizados nos fluxos críticos (auth, multi-tenancy, campanha, contribuição, pagamento, webhook, permissões — ordem sugerida em CHECKLIST.md)
- CI/CD básico (lint + typecheck + build em PR)
- Security headers (L1)
- Multiusuário de staff por igreja (`PapelIgreja` já existe no tipo, falta o fluxo)
- Monitoramento/error tracking, backups do Postgres

## Fora do roadmap por enquanto (evitar complexidade prematura)

- Microservices — não se justifica com o volume atual
- API pública versionada — sem consumidor externo hoje
- Multi-idioma, multi-moeda — fora do público-alvo atual (igrejas no Brasil)
