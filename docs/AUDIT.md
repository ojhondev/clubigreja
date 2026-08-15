# AUDIT.md — Auditoria técnica objetiva do Dizipay

Data: 2026-08-14. Baseado em leitura completa do código-fonte (153 arquivos TS/TSX, ~11.200 linhas), histórico de commits (28 commits), schema de banco, e todas as telas relevantes. Nada aqui é suposição — cada item cita arquivo e, quando aplicável, linha.

---

## 🔴 CRITICAL — impedem evolução segura com dinheiro real

### C1 — Vazamento de dados entre igrejas (multi-tenancy)
- **Status**: 🟡 **Correção implementada (Sprint 01), aguardando verificação por teste E2E contra banco real** — `TEST_DATABASE_URL` não estava configurada no ambiente onde a correção foi feita; testes existem e passam por design, mas não foram executados contra um Postgres de verdade. Ver `tests/e2e/security/tenant-isolation.spec.ts`.
- **Local original**: `src/lib/db/repo.ts:161-169` (`getLinkPagamento`), `src/lib/db/repo.ts:259-267` (`getCampanha`); consumido em `src/app/igreja/campanhas/[campanhaId]/qrcode/page.tsx:12` e `src/app/igreja/links/[linkId]/qrcode/page.tsx:20`.
- **Impacto**: uma igreja autenticada, trocando o id na URL, acessava campanha/link de pagamento de outra igreja.
- **Causa**: função de leitura não recebia/filtrava por `igrejaId` da sessão; middleware só valida papel, não posse.
- **Correção aplicada**: `getCampanha`/`getLinkPagamento` ganharam parâmetro `igrejaId` opcional (scoping via `and(eq(id,x), eq(igrejaId,y))`, mesmo padrão já usado em `atualizarCampanha`); as duas páginas de QR code passam a exigir `sessao.igrejaId`, com `notFound()` (404) em caso de mismatch. **Achado adicional durante a correção, fora do escopo original do relatório**: o mesmo problema existia no fluxo de doação do fiel (`src/app/fiel/doar/page.tsx` + `actions.ts`) — um `campanhaId` de outra igreja injetado via query string/form criava uma contribuição com `igrejaId` da própria igreja mas `campanhaId` de outra, inflando o total arrecadado (público) da campanha alheia. Corrigido com a mesma validação na Server Action (nunca confiar só na tela).
- **Decisão de resposta a acesso não autorizado**: 404 (`notFound()`), não 403 — evita confirmar a existência do recurso em outro tenant, consistente com o padrão já usado no projeto para "não encontrado".
- **Esforço**: P (pequeno — 2 funções + 2 páginas + 1 action adicional).
- **Prioridade**: P0.

### C2 — Confirmação de pagamento sem checagem de dono
- **Status**: 🟡 **Correção implementada (Sprint 01), aguardando verificação por teste E2E contra banco real** — mesma limitação de ambiente do C1. Ver `tests/e2e/security/contribution-authorization.spec.ts`.
- **Local original**: `src/lib/db/repo.ts:464-473` (`confirmarContribuicao`); disparado por `src/components/pagamento-pix.tsx:91` (`contribuicaoId` em `<input type="hidden">`) via `mock-gateway.ts:72-90`.
- **Impacto**: qualquer sessão de fiel autenticada podia confirmar o pagamento de contribuição de outra pessoa, disparando a cobrança de taxa no cartão do dono real.
- **Causa**: função não validava `fielId` do chamador contra o dono da contribuição.
- **Correção aplicada**: `confirmarContribuicao` ganhou parâmetro `fielIdEsperado` opcional; `PaymentGateway.confirmarPagamento` e `MockPaymentGateway.confirmarPagamento` propagam esse parâmetro; `/fiel/doar/pagar/[id]/actions.ts` (fluxo autenticado) passa `sessao.usuarioId`. **Decisão deliberada, não corrigida por igual**: o fluxo público de convidado (`/doar/pagar/[id]/actions.ts`) continua sem essa checagem — não há sessão pra comparar nesse fluxo (doação sem login é um caso de uso legítimo do produto), e o id da contribuição (10 hex chars aleatórios) já funciona como capability, mesmo modelo de segurança do link/campanha públicos. Documentado em comentário no próprio arquivo.
- **Esforço**: P.
- **Prioridade**: P0.

---

## 🟠 HIGH — importantes, resolver em breve

### H1 — Nenhuma idempotência na confirmação de pagamento
- **Local**: fluxo `confirmarPagamentoPublicoAction` → `gateway.confirmarPagamento`.
- **Impacto**: hoje inofensivo (mock). Com gateway real, duplo clique/reenvio geraria cobrança de taxa duplicada.
- **Recomendação**: checar `status` atual antes de reprocessar; idempotency key usando `contribuicaoId`.
- **Esforço**: P.
- **Prioridade**: P1 (bloqueador antes de integrar gateway real).

### H2 — Impersonação de WebMaster sem flag de permissão própria
- **Status**: 🟡 **Correção implementada (Sprint 01), aguardando verificação por teste E2E contra banco real**. Ver `tests/e2e/security/webmaster-impersonation.spec.ts`.
- **Local original**: `src/app/admin/igrejas/actions.ts:49-65`, `src/app/admin/fieis/actions.ts:8-28`.
- **Impacto**: qualquer webmaster, mesmo secundário sem nenhuma flag, acessava 100% dos dados de qualquer igreja/fiel via "Acessar como".
- **Correção aplicada**: `podeImpersonar(webmaster)` em `src/lib/auth/permissoes.ts`, restrito a `nivel === "primario"` — **sem nova coluna/migration**, reaproveitando o enum `nivel` já existente (reaproveitar `podeAprovarIgrejas`/`podeGerenciarPagamentos` seria semanticamente incorreto, essas flags autorizam ações específicas, não "ver tudo de qualquer conta"). Se o produto precisar que um Master Secundário impersone no futuro, isso pede uma flag própria — mudança de schema, a passar pelo fluxo normal (`DATABASE-ROADMAP.md`).
- **Não corrigido nesta etapa**: os botões "Acessar como" continuam visíveis para Master Secundário na UI (clicar não faz nada, a Server Action rejeita silenciosamente) — não escondido por instrução explícita do sprint de não redesenhar telas. Recomendado como polish futuro (P3).
- **Esforço**: P.
- **Prioridade**: P1.

### H3 — Fallback inseguro de `SESSION_SECRET`
- **Local**: `src/lib/auth/cookie.ts:40-47`.
- **Impacto**: se o processo subir sem `NODE_ENV=production` explícito mas servindo tráfego real, usa segredo hardcoded público — permite forjar sessão de qualquer papel.
- **Recomendação**: validar `SESSION_SECRET` incondicionalmente no boot.
- **Esforço**: P.
- **Prioridade**: P1.

### H4 — Push notifications não sobrevivem a deploy/cold start
- **Local**: `src/lib/push/vapid.ts` (chaves geradas em memória a cada boot), `src/lib/push/store.ts` (inscrições em array em memória).
- **Impacto**: em ambiente serverless (Vercel), a cada cold start/redeploy as chaves mudam e as inscrições existentes somem — push efetivamente não funciona de forma confiável em produção, apesar de todo o fluxo de UI (opt-in, service worker) estar implementado.
- **Recomendação**: persistir chave VAPID fixa via env var; mover inscrições para tabela no Postgres.
- **Esforço**: M.
- **Prioridade**: P1.

### H5 — Sem webhook de confirmação de pagamento
- **Local**: ausência em `src/app/api/` — confirmação depende só do clique do fiel.
- **Impacto**: nenhuma verificação bancária real de que o Pix foi recebido; abre espaço para erro/fraude de "cliquei mas não paguei" (ou o contrário).
- **Recomendação**: desenhar endpoint de webhook antes de integrar gateway real; ver DECISIONS.md.
- **Esforço**: G (depende do gateway escolhido).
- **Prioridade**: P1 (bloqueador para produção real com dinheiro de terceiros).

---

## 🟡 MEDIUM — melhorias relevantes

### M1 — Sem rate limiting em nenhuma rota de login
- **Local**: `entrar/igreja/actions.ts`, `entrar/fiel/actions.ts`, `webmaster/actions.ts`.
- **Recomendação**: rate limit por IP+email.
- **Esforço**: M. **Prioridade**: P2.

### M2 — Sem índices em FKs usadas em toda query por tenant
- **Local**: todas as 4 migrations em `drizzle/`.
- **Recomendação**: migration dedicada de índices antes de crescer volume de dados.
- **Esforço**: P. **Prioridade**: P2.

### M3 — Login de fiel por telefone escaneia a tabela inteira
- **Local**: `repo.ts` (`autenticarFiel`, `getFielPorTelefone`).
- **Recomendação**: índice em `(igreja_id, telefone)`.
- **Esforço**: P. **Prioridade**: P2.

### M4 — Estados de pagamento incompletos
- **Local**: `src/lib/db/schema.ts:141` — só `"aguardando_pix" | "confirmado"`.
- **Impacto**: Pix nunca pago fica pendente pra sempre; sem forma de distinguir abandono de erro.
- **Recomendação**: adicionar `cancelado`, `expirado`, `falhou`, `estornado` + expiração automática.
- **Esforço**: M. **Prioridade**: P2.

### M5 — Inconsistência de estado de UI (loading/error) entre telas
- **Local**: fluxo de doação e mural vs. `cadastrar-igreja` (padrão correto).
- **Recomendação**: replicar `useActionState` nas telas de maior risco. Ver UX.md.
- **Esforço**: M. **Prioridade**: P2.

### M6 — Sem `.env.example`, CI/CD ou testes automatizados
- **Local**: raiz do projeto.
- **Recomendação**: criar `.env.example`; testes priorizados conforme lista da seção 14 do prompt original (auth, multi-tenancy, campanha, contribuição, pagamento).
- **Esforço**: M. **Prioridade**: P2.

### M7 — LGPD: sem fluxo de exclusão/exportação de dados, sem consentimento explícito
- **Local**: cadastro de fiel/igreja, `/privacidade`, `/termos`.
- **Recomendação**: ver SECURITY.md, seção LGPD.
- **Esforço**: M. **Prioridade**: P2.

---

## 🟢 LOW — melhorias futuras

### L1 — Sem security headers
`next.config.ts` vazio. Adicionar CSP, X-Frame-Options, Referrer-Policy. **P3**.

### L2 — `webmasters.convidadoPorId` sem FK declarada
Inconsistência de schema, `schema.ts:194`. **P3**.

### L3 — Filtros decorativos no dashboard sem `onChange`
Dois `<select>` que parecem funcionais e não são. **P3**.

### L4 — `<p>Banner de anúncio</p>` placeholder literal em produção
Dashboard da igreja, linha 89. **P3**.

### L5 — Ações destrutivas sem confirmação
Remover link extra do perfil da igreja, sem modal de confirmação. **P3**.

### L6 — Design system sem `Input`/`Select`/`Textarea` central
Formulários reimplementam estilo repetido. **P3**.

### L7 — Vulnerabilidades de dependências de desenvolvimento
`npm audit`: 5 (4 moderate, 1 high), todas em `drizzle-kit`/`nanoid` (dev-only, não roda em produção). **P3**.

### L8 — Enum `boleto` morto
`MeioPagamento` inclui `"boleto"` (schema + labels de UI), sem nenhuma lógica de geração implementada. **P3** — decidir se remove do enum ou implementa.

### L9 — CSRF de baixo impacto em `/api/push/subscribe`
Sem checagem de `Origin`. **P3**.

### L10 — `marcarNotificacaoLida` sem checagem de sessão/dono (achado novo, Sprint 01)
- **Status**: 🟡 Correção implementada, aguardando verificação por teste E2E contra banco real.
- **Local original**: `src/lib/db/repo.ts:834-840`; `src/app/fiel/notificacoes/actions.ts`.
- **Impacto**: qualquer chamada à Server Action (mesmo sem sessão de fiel) marcava como lida a notificação de qualquer fiel de qualquer igreja, só sabendo/adivinhando o id — achado durante a varredura sistemática deste sprint, não estava no relatório original.
- **Correção aplicada**: `marcarNotificacaoLida` passou a exigir `fielId` e escopar a atualização por `and(eq(id), eq(fielId))`; a action passou a exigir `sessao.papel === "fiel"` antes de chamar.
- **Esforço**: P. **Prioridade**: P3 (impacto baixo — não expõe dado sensível, só suprime um "não lido" alheio).

---

## Pontos positivos confirmados (não é só lista de problema)

- Mecanismo de sessão (HMAC + scrypt + `timingSafeEqual`) correto e bem implementado, sem dependência externa desnecessária.
- Flags de cookie de sessão corretas (`httpOnly`, `sameSite`, `secure` condicional) em todos os pontos.
- Bootstrap de WebMaster protegido contra race condition (checagem dupla).
- Tokens de convite fortes (192 bits), single-use, com expiração.
- Cartão de crédito: **zero risco de PCI hoje** — número completo nunca é persistido nem logado, só últimos 4 dígitos + bandeira + token fake.
- Pix gerado é **real** (payload EMV/BR Code válido, CRC16 correto) — não é um mock visual, funciona de verdade no app do banco do fiel.
- Modelo de negócio (taxa cobrada do fiel, sem custódia/split) está implementado consistentemente com a decisão registrada em commit (`459c6b9`).
- `cadastrar-igreja` é um exemplo de excelência de estado de UI que só precisa ser replicado, não inventado.
- Código limpo de `TODO`/`FIXME`/`console.log` sensível — praticamente zero débito "sujo" nesse sentido.
- Zero uso de `any` em todo o código TypeScript.
