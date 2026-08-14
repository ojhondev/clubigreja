# DATABASE.md — Dizipay

Postgres (Neon serverless) via Drizzle ORM. Schema único em `src/lib/db/schema.ts`, 12 tabelas, 4 migrations aplicadas até o momento (`drizzle/0000_new_hydra.sql` a `0003_brief_surge.sql`).

## ERD conceitual

```
igrejas (1) ──< usuarios_igreja (N)      [staff da igreja: admin/tesoureiro/secretario — tipo existe, fluxo não]
igrejas (1) ──< fieis (N)                 [membros/doadores da igreja]
igrejas (1) ──< linksPagamento (N)
igrejas (1) ──< campanhas (N)
igrejas (1) ──< eventos (N)
igrejas (1) ──< comunicadosMural (N)
igrejas (1) ──< linksExtras (N)
igrejas (1) ──< contribuicoes (N)
igrejas (1) ──< notificacoesFiel (N)
fieis (1)   ──< contribuicoes (N)
fieis (1)   ──< notificacoesFiel (N)
campanhas (1) ──< contribuicoes (N)       [nullable — onDelete: set null]
webmasters (standalone — equipe interna Dizipay, fora do tenant igreja)
```

Todas as FKs para `igrejas` usam `onDelete: cascade`, exceto `contribuicoes.campanhaId` (`onDelete: set null` — deletar campanha preserva o histórico de doação já realizado).

## Tabelas

| Tabela | Colunas-chave | FKs | Domínio |
|---|---|---|---|
| `igrejas` | `slug` (unique), `statusOnboarding` (enum), `chavePix` | — | Tenant raiz |
| `usuarios_igreja` | `email` (unique), `senhaHash`, `papel` (enum) | `igrejaId → igrejas` cascade | Staff da igreja (não usado em fluxo hoje) |
| `fieis` | `telefone`, `senhaHash` (nullable — convidado sem login) | `igrejaId → igrejas` cascade | Doador/membro |
| `linksPagamento` | `tipo` (enum), `valorSugerido`, `ativo` | `igrejaId → igrejas` cascade | Link fixo de cobrança |
| `campanhas` | `meta`, `prazo`, `encerrada` | `igrejaId → igrejas` cascade | Captação com meta |
| `eventos` | `data`, `local`, `arrecadacaoVinculada` | `igrejaId → igrejas` cascade | Agenda |
| `comunicados_mural` | `titulo`, `corpo` | `igrejaId → igrejas` cascade | Feed da igreja |
| `contribuicoes` | `tipo`/`meio`/`status` (enum), valores, `taxaCobradaVia` (enum) | `igrejaId`, `fielId` cascade; `campanhaId` set null | Transação financeira |
| `notificacoes_fiel` | `tipo` (enum), `lida` | `fielId`, `igrejaId` cascade | Push/inbox do fiel |
| `links_extras` | `rotulo`, `url` | `igrejaId → igrejas` cascade | Redes sociais/links da página pública |
| `webmasters` | `nivel` (enum), 2 flags de permissão, `conviteToken` | `convidadoPorId` **sem `.references()` declarada** | Equipe interna Dizipay |

## Multi-tenancy

Não há isolamento por linha via RLS do Postgres nem middleware central de escopo — é 100% responsabilidade da aplicação. Cada tabela filha tem `igrejaId`, e as funções de **escrita** que alteram/apagam dado de uma igreja combinam `eq(id, x)` com `eq(igrejaId, sessão)` corretamente (`atualizarCampanha`, `alternarEncerramentoCampanha`, `removerCampanha`, `removerLinkExtra`). A sessão vem de cookie assinado, nunca de input do cliente — bom padrão de base.

### 🔴 Risco CRITICAL de isolamento entre igrejas

`getCampanha(campanhaId)` e `getLinkPagamento(linkId)` (`src/lib/db/repo.ts:161-169, 259-267`) **não filtram por `igrejaId`**, e são usadas dentro de páginas autenticadas sem checagem de posse:

- `src/app/igreja/campanhas/[campanhaId]/qrcode/page.tsx:12` — busca a campanha só pelo id, nunca compara com `sessao.igrejaId`.
- `src/app/igreja/links/[linkId]/qrcode/page.tsx:20` — mesmo padrão.
- O middleware (`src/proxy.ts`) só valida `papel === "igreja"`, não posse do recurso.

**Cenário de exploração**: uma igreja autenticada troca o id na URL `/igreja/campanhas/<id-de-outra-igreja>/qrcode` e vê nome/logo/dados da campanha de outra igreja.

### 🟠 Risco HIGH — confirmação de contribuição sem dono

`confirmarContribuicao(contribuicaoId)` (`repo.ts:464-473`) não valida `igrejaId` nem `fielId`. É chamada a partir de `contribuicaoId` num `<input type="hidden">` exposto no DOM (`src/components/pagamento-pix.tsx:91`). Qualquer sessão de fiel autenticada que descubra/adivinhe um id de contribuição de outra pessoa pode confirmá-la — disparando cobrança de taxa no cartão salvo do dono real, sem ele ter agido.

### 🟡 MEDIUM — uso legítimo sem escopo (não é bug)

`getContribuicao`, `getFiel` também não escopam por igreja, mas o uso encontrado é majoritariamente em páginas **públicas por design** (`/doar/campanha/[id]`, `/doar/link/[id]`, `/doar/pagar/[id]`) — modelo de link público de doação, não falha.

## Índices e constraints

- **Nenhum índice explícito em nenhuma FK** (`igreja_id`, `fiel_id`, `campanha_id`) nas 4 migrations — só PKs e uniques (`igrejas.slug`, `usuarios_igreja.email`, `webmasters.email`). Toda leitura por tenant faz full scan à medida que a tabela cresce.
- `getFielPorTelefone`/`autenticarFiel` (`repo.ts:209-217, 398-412`, usadas no **login do fiel**) carregam **toda a tabela `fieis`** para RAM e comparam telefone normalizado em JS — O(n) por tentativa de login, comentário no próprio código já reconhece a limitação.
- Sem índice único em `(igreja_id, telefone)` — nada no schema impede dois fiéis com mesmo telefone na mesma igreja.

## Soft delete / auditoria

- Nenhuma tabela tem soft delete (`deletado_em`/`ativo` como flag de exclusão).
- Timestamps são só `criada_em`/`criado_em`, sempre `text` (string ISO), não `timestamp` nativo do Postgres — sem `atualizado_em` em lugar nenhum.
- `removerCampanha` faz hard delete real (mitigado pelo `set null` em contribuições, que preserva o valor arrecadado).
- Alterações em dado financeiro sensível (`atualizarPerfilIgreja`, `atualizarChavePixIgreja` — a chave Pix, que define pra onde o dinheiro da igreja vai) **não deixam rastro de quem mudou o quê nem quando**. Relevante porque a chave Pix pode ser alterada tanto pela própria igreja quanto por um webmaster interno, sem log de auditoria.

## Estratégia de migrations

Drizzle Kit, `npm run db:generate` (gera SQL a partir do diff de schema) + `npm run db:migrate` (aplica). 4 migrations até agora, histórico linear, sem edição manual aparente. Recomendação: manter esse fluxo, adicionar índices via migration dedicada antes de qualquer crescimento de dados reais.

## Recomendações prioritárias

1. Corrigir `getCampanha`/`getLinkPagamento` para exigir `igrejaId` nos contextos autenticados (CRITICAL).
2. Adicionar checagem de dono em `confirmarContribuicao` (HIGH).
3. Índices em todas as FKs usadas em query por tenant + índice único em `(igreja_id, telefone)`.
4. Resolver login de fiel por telefone com índice, não scan completo.
5. Declarar a FK de `webmasters.convidadoPorId` (consistência de schema).
6. Considerar `atualizado_em` + log de auditoria mínimo para alteração de chave Pix.
