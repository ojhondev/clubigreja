# SECURITY.md — Dizipay

## Matriz de segurança

| Área | Estado | Risco | Prioridade | Ação |
|---|---|---|---|---|
| Auth (sessão/senha) | Bem implementado (HMAC-SHA256, scrypt, `timingSafeEqual`) | Baixo | — | Manter padrão |
| Multi-tenancy (isolamento entre igrejas) | Falho em 2 pontos confirmados | **Crítico** | P0 | Corrigir `getCampanha`/`getLinkPagamento` sem filtro de `igrejaId` |
| Confirmação de pagamento | Sem checagem de dono | **Alto** | P0 | Validar `fielId`/`igrejaId` em `confirmarContribuicao` |
| RBAC — impersonação WebMaster | Sem flag de permissão própria | Alto | P1 | Adicionar `podeImpersonar` e checar antes de "Acessar como" |
| `SESSION_SECRET` fallback | Condicional a `NODE_ENV` | Alto | P1 | Checar obrigatoriedade incondicionalmente |
| Rate limiting | Inexistente | Médio | P1 | Adicionar em rotas de login (igreja/fiel/webmaster) |
| Payments/Webhooks | Não existe (mock) | Médio (vira alto na integração real) | P2 (bloqueador pra ir a produção real) | Desenhar webhook + idempotência antes do gateway real |
| Secrets/env vars | Sem `.env.example`, sem vazamento encontrado | Baixo | P2 | Criar `.env.example` |
| API (rotas HTTP reais) | Sem CSRF explícito em `/api/push/subscribe` | Baixo | P3 | Checar `Origin`/`Sec-Fetch-Site` |
| Input validation | Validação HTML nativa (`required`, `type`) + checagens em Server Actions | Médio | P2 | Padronizar validação server-side com retorno de erro estruturado |
| Logs | Sem vazamento sensível encontrado | Baixo | — | Manter disciplina |
| LGPD | Sem política formal, sem fluxo de exclusão/exportação de dados | Médio | P2 | Ver seção LGPD abaixo |
| Security headers | Nenhum configurado (`next.config.ts` vazio) | Baixo | P3 | Adicionar CSP, X-Frame-Options, Referrer-Policy |
| Dependências (npm audit) | 5 vulnerabilidades (4 moderate, 1 high) — todas em deps de dev (`drizzle-kit`→`esbuild-kit`, `nanoid`) | Baixo (dev-only) | P3 | `npm audit fix` quando conveniente |

## Autenticação

- Cookie de sessão assinado por **HMAC-SHA256** (`src/lib/auth/cookie.ts`) — payload JSON base64url + assinatura base64url, verificado com `timingSafeEqual`. Não é JWT — formato próprio, simples e correto (sem "alg: none", sem libs externas de terceiros).
- Senha com **scrypt** nativo do Node (`src/lib/auth/senha.ts`), salt aleatório de 16 bytes por senha, comparação com `timingSafeEqual`.
- Duração de sessão: cookie `maxAge` de 7 dias, sem refresh/rotação.
- Cookie assinado mas **não criptografado** — payload (`papel`, `usuarioId`, `igrejaId`, `nome`) é legível por quem tiver acesso ao cookie. Não é dado sensível crítico, mas vale registrar.
- Flags de cookie corretas e consistentes em todos os pontos de emissão: `httpOnly: true`, `sameSite: "lax"`, `secure` condicionado a produção, `path: "/"`.

### 🟠 HIGH — Fallback de `SESSION_SECRET` inseguro

`src/lib/auth/cookie.ts:40-47`. A checagem de obrigatoriedade do segredo só dispara se `NODE_ENV === "production"` no momento do import. Se o processo subir com `NODE_ENV` diferente de `"production"` por erro de config de deploy, container mal configurado etc., mas servindo tráfego real, o segredo cai silenciosamente para o valor hardcoded `"dev-only-insecure-secret-nao-usar-em-producao"`, visível no código-fonte — qualquer um poderia forjar uma sessão de qualquer papel, inclusive `webmaster`.

**Recomendação**: validar a presença de `SESSION_SECRET` de forma incondicional no boot, não depender de `NODE_ENV`.

## Autorização / RBAC

Três papéis (`igreja`, `fiel`, `webmaster`). Middleware (`src/proxy.ts`) protege por prefixo de rota, sem checar posse de recurso. Autorização fina é revalidada ação por ação dentro de cada Server Action — funciona, mas é manual (sem RBAC centralizado).

### 🟠 HIGH — Impersonação sem controle de permissão granular

`src/app/admin/igrejas/actions.ts:49-65`, `src/app/admin/fieis/actions.ts:8-28`. Qualquer webmaster autenticado — primário ou secundário, **com ou sem** as flags `podeAprovarIgrejas`/`podeGerenciarPagamentos` — pode usar "Acessar como" para entrar como qualquer igreja ou fiel e ver 100% dos dados daquela conta (dashboard financeiro, histórico, dados pessoais). As duas flags existentes protegem só aprovação de igreja e edição de chave Pix, não a impersonação em si.

**Cenário**: um Master Secundário criado sem nenhuma flag ainda consegue "ver como se fosse" qualquer conta da plataforma.

**Recomendação**: nova flag (`podeImpersonar` ou granularidade equivalente), checada antes de iniciar o "Acessar como".

## Sistema WebMaster — convites e bootstrap

Bootstrap do primeiro webmaster só é possível se nenhum existir (`existeWebmaster()` checado duas vezes, corretamente, contra race condition). Convites usam token de `randomBytes(24)` (192 bits), expiram em 7 dias, single-use, e só o Master Primário pode gerá-los. Nenhum caminho de auto-elevação encontrado (fiel/igreja não têm rota para virar webmaster).

## Multi-tenancy

Ver detalhamento completo em [`DATABASE.md`](DATABASE.md). Resumo: **falha CRITICAL confirmada** — `getCampanha`/`getLinkPagamento` não filtram por `igrejaId`, permitindo uma igreja ver campanha/link de outra trocando o id na URL.

## Pagamentos

Ver detalhamento completo em [`ARCHITECTURE.md`](ARCHITECTURE.md) e no relatório de auditoria de pagamentos consolidado em [`AUDIT.md`](AUDIT.md). Pontos-chave:

- Confirmação de pagamento sem checagem de dono (`confirmarContribuicao` aceita qualquer id vindo de campo hidden no DOM).
- Nenhuma idempotência — clique duplo (ou reenvio malicioso) reprocessaria a confirmação; hoje inofensivo (mock), mas replicaria cobrança de taxa real com gateway de verdade.
- Sem webhook — confirmação depende só do clique do fiel, sem verificação bancária.
- Cartão: **sem risco de PCI hoje** — só últimos 4 dígitos + bandeira + token fake são persistidos (`mock-gateway.ts:16`, `repo.ts:475`); número completo nunca é salvo nem logado. Isso muda de figura na integração real: tokenização deve acontecer no client via SDK do gateway, nunca passando pelo server da aplicação.

## Rate limiting

**Inexistente em qualquer rota** — nem login (igreja/fiel/webmaster), nem rotas de API, nem Server Actions públicas (busca de igreja, cadastro). `scrypt` sendo lento mitiga parcialmente brute-force, mas não substitui rate limit por IP/conta.

## Input validation

Validação HTML nativa (`required`, `minLength`, `type="email"`) no cliente + checagens dentro das Server Actions. Sem padrão único de retorno de erro — `cadastrar-igreja` é o exemplo correto (`useActionState`); vários outros fluxos (doação, mural) apenas retornam silenciosamente sem mensagem em caso de validação falha.

## Logs

Único `console.log` encontrado em todo `src/`: `src/lib/db/seed.ts:74`, mensagem de conclusão de seed, sem dado sensível, não roda em request de produção.

## Segredos / variáveis de ambiente

4 variáveis usadas: `DATABASE_URL`, `POSTGRES_URL` (fallback), `SESSION_SECRET`, `NODE_ENV`. Nenhum segredo hardcoded encontrado fora do fallback de dev documentado acima. **Não existe `.env.example`** — lacuna de onboarding/documentação, não de segurança em si.

## LGPD / Privacidade

### Dados pessoais tratados

| Dado | Onde | Sensibilidade |
|---|---|---|
| Nome, e-mail, WhatsApp do responsável | `igrejas` | Identificável |
| CNPJ | `igrejas` | Identificável (pessoa jurídica) |
| Nome, telefone, senha (hash) | `fieis` | Identificável + credencial |
| Últimos 4 dígitos + bandeira do cartão | `fieis` (cartão salvo) | Financeiro parcial (não é PAN completo) |
| Histórico de contribuições (valor, data, tipo) | `contribuicoes` | Financeiro |
| Chave Pix da igreja | `igrejas` | Financeiro (da pessoa jurídica, não do fiel) |

### Lacunas encontradas

- Páginas `/privacidade` e `/termos` existem mas são curtas (33-34 linhas) — não foi possível confirmar nesta auditoria se cobrem consentimento, retenção e direitos do titular de forma completa (recomenda-se revisão jurídica dedicada, fora do escopo técnico desta auditoria).
- Nenhum fluxo de **exclusão de conta** ou **exportação de dados** (direito de acesso/portabilidade da LGPD) encontrado no código.
- Nenhum registro de consentimento explícito (checkbox de aceite de termos) encontrado nos formulários de cadastro auditados.
- Sem soft delete/retenção definida — dado fica indefinidamente, sem política de expurgo.

### Recomendações

1. Fluxo de exclusão de conta (fiel) com anonimização do histórico de contribuições (preservar dado agregado da igreja, remover PII do fiel).
2. Checkbox de consentimento explícito no cadastro, com timestamp registrado.
3. Definir política de retenção (ex: dados de fiel inativo há N anos).
4. Revisão jurídica de `/privacidade` e `/termos` antes de captar dinheiro real de terceiros.

## Security headers

`next.config.ts` está vazio — nenhum `headers()` configurado. Recomenda-se adicionar `Content-Security-Policy`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin` como mínimo antes de produção.
