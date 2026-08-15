# DATABASE.md — Dizipay

Postgres (Neon serverless) via Drizzle ORM, driver HTTP (`@neondatabase/serverless`). Schema único em `src/lib/db/schema.ts`, 12 tabelas, 4 migrations aplicadas até o momento (`drizzle/0000_new_hydra.sql` a `0003_brief_surge.sql`). Nenhuma alteração estrutural foi aplicada nesta auditoria — só levantamento. Recomendações de migration ficam em [`DATABASE-ROADMAP.md`](DATABASE-ROADMAP.md).

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

## Entidades

Para cada entidade: finalidade, PK, campos principais, tenant (como sabe a quem pertence), dados sensíveis.

| Entidade | Finalidade | PK | Tenant (`igrejaId`?) | Dados sensíveis |
|---|---|---|---|---|
| `igrejas` | O tenant raiz — uma igreja cadastrada na plataforma | `id` (text) | é o próprio tenant | CNPJ, e-mail/WhatsApp do responsável, **chave Pix** (pra onde vai o dinheiro) |
| `usuarios_igreja` | Staff da igreja (hoje só 1 usuário por igreja é usado no fluxo real) | `id` | direto (`igrejaId`) | e-mail, hash de senha |
| `fieis` | Doador/membro | `id` | direto (`igrejaId`) | telefone, hash de senha (nullable), cartão tokenizado (bandeira + últimos 4 dígitos, nunca o número completo) |
| `linksPagamento` | Cobrança fixa reutilizável (dízimo, oferta, livre) | `id` | direto (`igrejaId`) | — |
| `campanhas` | Captação com meta e prazo | `id` | direto (`igrejaId`) | — |
| `eventos` | Agenda da igreja | `id` | direto (`igrejaId`) | — |
| `comunicados_mural` | Feed de comunicados | `id` | direto (`igrejaId`) | — |
| `contribuicoes` | **Transação financeira** — o núcleo do domínio | `id` | direto (`igrejaId`) + indireto (`fielId → fieis.igrejaId`, `campanhaId → campanhas.igrejaId`) | valores monetários, método de pagamento |
| `notificacoes_fiel` | Inbox/push do fiel | `id` | direto (`igrejaId`) | — |
| `links_extras` | Links da página pública (Instagram, site) | `id` | direto (`igrejaId`) | — |
| `webmasters` | Equipe interna Dizipay — **não é tenant-scoped, é global** | `id` | não se aplica (staff da plataforma, não de uma igreja) | e-mail, hash de senha, token de convite |

Nenhuma entidade tenant-specific depende **exclusivamente** de uma relação indireta frágil para descobrir seu tenant — todas as tabelas de negócio carregam `igreja_id` direto na própria linha. Isso é a base correta; o problema real de multi-tenancy no Dizipay não é de modelagem, é de **aplicação não usar esse campo em toda leitura** (ver seção Multi-tenancy).

## Multi-tenancy

Modelo escolhido: `igreja_id` como coluna direta em cada tabela filha (não schema-per-tenant, não RLS do Postgres) — decisão implícita e adequada ao tamanho atual do produto (não recomendo RLS ou schema-per-tenant agora, seria complexidade prematura para o volume de dados e de igrejas hoje).

O isolamento é **100% responsabilidade da aplicação**: cada tabela filha tem `igrejaId`, e as funções de **escrita** que alteram/apagam dado de uma igreja combinam `eq(id, x)` com `eq(igrejaId, sessão)` corretamente (`atualizarCampanha`, `alternarEncerramentoCampanha`, `removerCampanha`, `removerLinkExtra`). A sessão vem de cookie assinado, nunca de input do cliente — bom padrão de base.

### 🔴 P0 — Vazamento de dados entre igrejas (achado já registrado em AUDIT.md, C1)

`getCampanha(campanhaId)` e `getLinkPagamento(linkId)` (`src/lib/db/repo.ts:161-169, 259-267`) **não filtram por `igrejaId`**, e são usadas dentro de páginas autenticadas sem checagem de posse:

- `src/app/igreja/campanhas/[campanhaId]/qrcode/page.tsx:12` — busca a campanha só pelo id, nunca compara com `sessao.igrejaId`.
- `src/app/igreja/links/[linkId]/qrcode/page.tsx:20` — mesmo padrão.
- O middleware (`src/proxy.ts`) só valida `papel === "igreja"`, não posse do recurso.

**Cenário de exploração**: uma igreja autenticada troca o id na URL `/igreja/campanhas/<id-de-outra-igreja>/qrcode` e vê nome/logo/dados da campanha de outra igreja. Já existe teste E2E reproduzindo isso (`tests/e2e/security/tenant-isolation.spec.ts`, marcado `test.fail()` até ser corrigido).

### 🟠 P0 — confirmação de contribuição sem dono

`confirmarContribuicao(contribuicaoId)` (`repo.ts:464-473`) não valida `igrejaId` nem `fielId`. Tratado como P0 aqui (não P1) porque é especificamente uma falha de integridade **financeira** cross-tenant, não só leitura de dado. Ver `AUDIT.md` C2 para o cenário completo.

### 🟡 Uso legítimo sem escopo (não é bug)

`getContribuicao`, `getFiel` também não escopam por igreja, mas o uso encontrado é majoritariamente em páginas **públicas por design** (`/doar/campanha/[id]`, `/doar/link/[id]`, `/doar/pagar/[id]`) — modelo de link público de doação, não falha.

## Integridade referencial

Todas as FKs de tabela-filha → `igrejas` estão declaradas e corretas, com `onDelete: cascade` (exceto `contribuicoes.campanhaId`, `set null` — proposital, preserva o valor arrecadado se a campanha for removida). `contribuicoes.fielId` também é `cascade` — deletar um fiel apaga seu histórico de contribuições (ver observação de auditoria financeira abaixo, isso pode ser indesejado).

### 🟢 P3 — FK não declarada

`webmasters.convidadoPorId` (`schema.ts:194`) é `text` solto, sem `.references()` — o resto do schema sempre declara FK explícita. Não é um risco ativo (não há orphan visível hoje, é uma tabela pequena controlada só por fluxo interno), mas é uma inconsistência de modelagem que vale corrigir na próxima migration que tocar essa tabela.

Nenhuma outra FK ausente/incorreta encontrada. Nenhum ID solto sem `.references()` em relação que deveria ser obrigatória, fora o caso acima.

## Índices

**Nenhum índice explícito além de PK/unique existe hoje** nas 4 migrations. Toda leitura por tenant faz sequential scan — inofensivo no volume de demo atual, vira gargalo real assim que houver múltiplas igrejas com histórico de meses.

Recomendações, cada uma com a query que se beneficia:

| Índice proposto | Query beneficiada | Motivo | Custo aproximado |
|---|---|---|---|
| `campanhas(igreja_id)` | `getCampanhasDaIgreja` — toda vez que a igreja abre `/igreja/campanhas` ou `/igreja/dashboard` | Sequential scan hoje, cresce linear com o total de campanhas de **todas** as igrejas | Baixo — tabela pequena, escrita pouco frequente (criar campanha não é uma ação de alta frequência) |
| `links_pagamento(igreja_id)` | `getLinksDaIgreja` | Mesmo padrão acima | Baixo |
| `eventos(igreja_id)` | listagem de eventos da igreja | Mesmo padrão | Baixo |
| `comunicados_mural(igreja_id)` | mural da igreja/fiel | Mesmo padrão | Baixo |
| `contribuicoes(igreja_id, status)` | `getResumoFinanceiro`, `getContribuicoesPorTipo` — filtram por igreja **e** por `status === "confirmado"` em todo carregamento do dashboard | Índice composto evita scan completo da tabela que mais cresce no sistema (toda doação vira uma linha) | Médio — tabela de maior volume, mas escrita (insert de contribuição) não é sensível a index overhead nesse volume |
| `contribuicoes(igreja_id, criada_em)` | ordenação/filtro por período em relatórios | Suporta consultas de "mês atual"/exportação CSV sem scan | Médio |
| `contribuicoes(campanha_id)` | `getArrecadadoCampanha` — chamada pra **cada campanha** listada em `/igreja/campanhas` e nas páginas públicas | N+1 de leitura hoje já é caro por si (ver seção Performance); índice reduz o custo por chamada | Baixo |
| `fieis(igreja_id, telefone)` **único** | `autenticarFiel`, `getFielPorTelefone` — usadas no login do fiel | Ver próxima seção — hoje é scan completo da tabela inteira, não só falta de índice | Baixo, ganho grande |

Não recomendo índice em `usuarios_igreja.igreja_id` (tabela pequena, 1 linha por igreja no fluxo real hoje) nem em `notificacoes_fiel`/`links_extras` agora — volume não justifica.

### 🟠 P1 — login de fiel escaneia a tabela inteira

`autenticarFiel`/`getFielPorTelefone` (`repo.ts:398-412`, `209-217`) carregam **toda a tabela `fieis`** para a aplicação e comparam telefone normalizado em JavaScript — O(n) por tentativa de login, em vez de uma query indexada. O próprio comentário no código já reconhece a limitação. Isso é o gargalo de performance mais sério do banco hoje, porque roda a cada login, não só em relatório.

## Unique constraints

| Campo | Hoje | Deveria ser | Raciocínio |
|---|---|---|---|
| `igrejas.slug` | `UNIQUE(slug)` global | Mantém global | Slug é a URL pública (`/[slug]`) — precisa ser único na plataforma inteira, não por tenant (não existe "tenant" antes do slug resolver a igreja) |
| `usuarios_igreja.email` | `UNIQUE(email)` global | Mantém global | E-mail como identidade de login único faz sentido — decisão consciente, não um bug. Efeito colateral aceitável: a mesma pessoa não pode ser admin de duas igrejas com o mesmo e-mail; não há indício de que isso seja um requisito de produto |
| `webmasters.email` | `UNIQUE(email)` global | Mantém global | Equipe interna, não é tenant-scoped por definição |
| `fieis.telefone` | **sem unique nenhum** | `UNIQUE(igreja_id, telefone)` | Fiel é tenant-scoped — a mesma pessoa pode legitimamente ser fiel em duas igrejas diferentes (contexto realista: alguém frequenta duas comunidades), então o unique correto é composto, não global. Hoje nem o composto existe — nada impede dois fiéis duplicados na mesma igreja com o mesmo telefone |

## Modelo de pagamento/contribuição

### 🟠 P1 — Estados de contribuição incompletos

`contribuicoes.status` (`schema.ts:141`) só define dois valores: `"aguardando_pix" | "confirmado"`. Isso não representa o domínio real de um pagamento:

- Um Pix nunca pago **fica pendente para sempre** — não há como diferenciar "abandonou o checkout" de "vai pagar daqui a pouco".
- Não há como registrar recusa de gateway, expiração, cancelamento pelo fiel, nem estorno.

Recomendação — expandir para um enum mais completo, seguindo a convenção de nomenclatura já usada no projeto (`snake_case`, em português, minúsculo — ver `status_onboarding` em `igrejas` como referência):

```
aguardando_pix   (existente)
confirmado       (existente)
expirado         (novo — Pix não pago dentro do prazo)
cancelado        (novo — fiel ou igreja cancelou)
falhou           (novo — gateway recusou, quando houver gateway real)
estornado        (novo — devolução)
```

Não implementado nesta etapa — é mudança de schema (migration) e de lógica de negócio (quem marca `expirado`, com que prazo), depende também da escolha de gateway real (ver `docs/DECISIONS.md` ADR-003). Registrado como proposta em `DATABASE-ROADMAP.md`.

### 🟠 P1 — Sem suporte a idempotência

Não existem colunas para identificar um evento de pagamento externo (`provider`, `external_payment_id`/`transaction_id`). Isso é esperado enquanto o gateway é mock, mas precisa existir **antes** de qualquer integração real, porque hoje nada impede duas confirmações da mesma transação criarem efeito duplicado (ver `AUDIT.md` H1).

Recomendação de schema, para quando o gateway for escolhido:

```
contribuicoes.provider              text (nullable até integração real)
contribuicoes.external_payment_id   text (nullable)
UNIQUE(provider, external_payment_id) WHERE external_payment_id IS NOT NULL
```

O `WHERE` parcial evita que múltiplas linhas com `NULL` (contribuições que ainda não têm id do provedor, ou nunca terão porque o Pix é direto pra chave da igreja) violem a constraint — `NULL` não conflita com `NULL` em unique constraints do Postgres, mas o `WHERE` deixa a intenção explícita.

## Dinheiro — 🟠 P1, ponto de atenção real

Todos os campos monetários (`campanhas.meta`, `links_pagamento.valor_sugerido`, `contribuicoes.valor_bruto`, `taxa_percentual`, `taxa_valor`, `valor_total_fiel`) usam `real` no Drizzle — que mapeia para `real` do Postgres, **ponto flutuante de precisão simples (4 bytes, ~6-7 dígitos decimais significativos)**.

Isso é uma escolha arriscada para dinheiro. Não é teórico: `Math.round(valor * taxa * 100) / 100` (o próprio padrão de arredondamento usado em `src/lib/comissao.ts`) já é uma tentativa de contornar imprecisão de ponto flutuante em JavaScript — e o valor ainda é persistido num tipo Postgres que também é ponto flutuante, então o arredondamento em JS não garante que o valor gravado seja exatamente o mesmo lido de volta. Em valores de poucas dezenas/centenas de reais o erro é geralmente invisível, mas cresce com o valor e se acumula em somas (`relatorios.ts` faz `reduce` somando `valorBruto`/`taxaValor` de todas as contribuições — erro de arredondamento acumulado numa igreja com muitas contribuições é uma preocupação legítima de auditoria financeira).

**Estratégia recomendada** (documentando, não aplicando):

```
R$ 100,50
↓
10050  (integer, centavos)
```

ou, alternativa que muda menos a camada de aplicação (que hoje trabalha em reais com casas decimais, não em inteiros): trocar `real` por `numeric(12, 2)` — decimal exato do Postgres, sem os riscos de ponto flutuante, sem exigir reescrever `comissao.ts`/`calculadora-arrecadacao.ts` para trabalhar em centavos.

Recomendo `numeric(12,2)` sobre integer-centavos aqui especificamente porque a mudança é só de tipo de coluna (uma migration de `ALTER COLUMN ... TYPE numeric(12,2)`), sem exigir reescrever a camada de cálculo em `src/lib/comissao.ts` e `calculadora-arrecadacao.ts`, que já trabalha em reais decimais. Registrado como ADR proposto em `DECISIONS.md`.

**Não misturar as duas estratégias** — se algum dia adotar centavos-inteiros, aplicar em todas as colunas monetárias de uma vez, nunca parcialmente.

## Timestamps e timezone — 🟡 P2

- Todos os campos de data (`criada_em`, `criado_em`, `publicado_em`, `convite_expira_em`) são `text` — string, não `timestamp`/`timestamptz` nativo do Postgres. Isso impede comparação/ordenação nativa eficiente no banco (`ORDER BY criada_em` funciona por acaso, porque o formato ISO ordena lexicograficamente igual a cronologicamente — funciona, mas é frágil e não é o que o tipo `text` garante).
- **Granularidade inconsistente**: a função local `hoje()` em `src/lib/db/repo.ts:29-31` (usada para preencher `criadaEm`/`criadoEm` na maioria dos inserts) retorna só `YYYY-MM-DD` (`new Date().toISOString().slice(0, 10)`) — **sem hora**. Duas contribuições criadas no mesmo dia não podem ser ordenadas entre si por horário de criação. Já o convite de webmaster (`repo.ts:920`, `conviteExpiraEm`) usa `new Date().toISOString()` completo, com hora — inconsistente com o resto do schema.
- **Timezone**: `new Date().toISOString()` sempre gera UTC. Não há campo/coluna guardando fuso, e a apresentação ao usuário (`formatarData` em `src/lib/formato.ts`, `dataLocal` em `src/lib/hoje.ts`) assume fuso do Brasil na leitura, sem converter explicitamente — funciona hoje porque o servidor/os usuários estão majoritariamente no mesmo fuso, mas não é uma garantia do schema.
- **Achado à parte, fora do escopo de schema mas relevante pra confiabilidade do dado**: `src/lib/hoje.ts` (função **diferente** da `hoje()` local de `repo.ts`) retorna uma data **hardcoded** (`new Date("2026-08-05T12:00:00")`), com comentário do próprio autor indicando que é proposital enquanto os dados eram mockados ("troque por `new Date()` quando os dados deixarem de ser simulados"). Essa função alimenta `relatorios.ts` (cálculo de "mês atual" no dashboard), `dizimo.ts` (lembrete de dízimo recorrente) e `frase-do-dia.ts`. Não é um problema de banco — é um TODO de aplicação já sinalizado pelo autor —, mas **compromete a confiabilidade dos números financeiros do dashboard assim que o calendário real passar de agosto/2026**, então está registrado aqui e em `DATABASE-ROADMAP.md` como dependência a resolver antes de qualquer dado financeiro real.

**Recomendação**: migrar `criada_em`/`criado_em`/`publicado_em`/`convite_expira_em` para `timestamptz` do Postgres (guarda instante absoluto, sempre comparável, sem ambiguidade de fuso), preenchido sempre com `new Date()` completo (não `.slice(0,10)`). Padronizar armazenamento em UTC (comportamento nativo do `timestamptz`), conversão para fuso do usuário só na camada de apresentação — não implementado nesta etapa, é migration + mudança de todo ponto de inserção.

## Soft delete / auditoria

- Nenhuma tabela tem soft delete (`deletado_em`/`ativo` como flag de exclusão) nem `atualizado_em` em lugar nenhum.
- `removerCampanha` faz hard delete real (mitigado pelo `set null` em contribuições).
- **`contribuicoes.fielId` é `onDelete: cascade`** — deletar um fiel apaga seu histórico de contribuições. Ponto de atenção pra auditoria financeira: se algum fluxo futuro de LGPD (exclusão de conta, ver `SECURITY.md`) apagar o registro de `fieis`, o histórico financeiro da igreja some junto. Recomendação: quando o fluxo de exclusão de conta for implementado, anonimizar o fiel (remover PII) em vez de deletar a linha, preservando a contribuição agregada da igreja — ou trocar essa FK específica para `set null` como já é feito em `campanhaId`.
- Alterações em dado financeiro sensível (`atualizarPerfilIgreja`, `atualizarChavePixIgreja`) **não deixam rastro de quem mudou o quê nem quando** — a chave Pix pode ser alterada tanto pela própria igreja quanto por um webmaster interno, sem log de auditoria.

## Performance — achados adicionais

- **N+1 em `getArrecadadoCampanha`**: `src/app/igreja/campanhas/page.tsx` chama `getArrecadadoCampanha(c.id)` dentro de um `Promise.all` mapeando cada campanha — uma query por campanha listada, em vez de uma agregação única. Resolvido junto com o índice `contribuicoes(campanha_id)` recomendado acima, mas o padrão de query (uma consulta por linha, não agregação em lote) continua sendo uma escolha a revisar quando o número de campanhas por igreja crescer.
- Nenhum outro N+1 relevante encontrado nas leituras auditadas (dashboard, relatórios, mural).
- Sem paginação em nenhuma listagem (`getCampanhasDaIgreja`, `getContribuicoesDaIgreja` etc.) — não é um problema hoje (volume de demo), mas não escala indefinidamente; não é uma prioridade agora, registrado como P3.

## Estratégia de migrations

Drizzle Kit, `npm run db:generate` (gera SQL a partir do diff de schema) + `npm run db:migrate` (aplica). 4 migrations até agora, histórico linear, sem edição manual aparente — bom padrão, manter. Nenhuma migration foi criada nesta auditoria (por instrução explícita: auditar e documentar, não alterar estrutura).

## Backups

**Não verificável nesta sessão** — depende do console do Neon (retenção de point-in-time-recovery, branch de produção vs. dev), ao qual não tenho acesso. Registrado como dependência: confirmar com quem administra o projeto Neon (1) se PITR está habilitado no plano atual, (2) qual a janela de retenção, (3) processo de restauração testado ao menos uma vez. Ver `SECURITY.md`.

## Credenciais e permissões de acesso ao banco

**Não verificável nesta sessão** — não há acesso ao `DATABASE_URL` real nem ao painel do Neon para confirmar se a aplicação usa uma role com privilégios mínimos (só o schema `public`, sem superuser) ou a role admin default do projeto. Registrado como dependência de verificação em `SECURITY.md`.

## Recomendações prioritárias (consolidado)

Ver [`DATABASE-ROADMAP.md`](DATABASE-ROADMAP.md) para a lista completa priorizada com esforço estimado. Resumo dos P0/P1 de banco:

1. **P0** — Corrigir `getCampanha`/`getLinkPagamento` para exigir `igrejaId` (aplicação, não migration).
2. **P0** — Checagem de dono em `confirmarContribuicao` (aplicação, não migration).
3. **P1** — Índice em `fieis(igreja_id, telefone)` + resolver login por scan completo.
4. **P1** — Índices em FKs usadas por tenant (`campanhas`, `links_pagamento`, `contribuicoes`, etc.).
5. **P1** — Migrar colunas monetárias de `real` para `numeric(12,2)`.
6. **P1** — Expandir estados de `contribuicoes.status` + colunas de idempotência (`provider`, `external_payment_id`).
7. **P2** — Migrar timestamps de `text` para `timestamptz`, com hora completa (não só data).
8. **P3** — Declarar FK de `webmasters.convidadoPorId`.
9. **P3** — `atualizado_em` + log de auditoria mínimo para alteração de chave Pix.
