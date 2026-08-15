# DATABASE-ROADMAP.md — Dizipay

Mudanças estruturais de banco recomendadas por esta auditoria, priorizadas. **Nenhuma foi aplicada** — este documento é a lista de migrations a revisar e criar, não um changelog do que já foi feito. Ver [`DATABASE.md`](DATABASE.md) para o raciocínio completo por trás de cada item.

Convenção de prioridade: **P0** pode causar vazamento de dados, corrupção, duplicidade financeira ou acesso cross-tenant · **P1** importante para produção · **P2** melhoria relevante · **P3** futuro.

## P0 — não é migration, é fix de aplicação (registrado aqui por dependência)

Os dois achados P0 (`getCampanha`/`getLinkPagamento` sem filtro de tenant, `confirmarContribuicao` sem checagem de dono) **não exigem migration** — são bugs de código de acesso a dados, corrigíveis sem alterar schema. Ficam referenciados aqui só porque bloqueiam qualquer plano de crescimento de dados reais. Ver `AUDIT.md` C1/C2 e `BACKLOG.md` DZP-001/DZP-002 para o tratamento completo.

## P1 — migrations recomendadas antes de dinheiro real em produção

### 1. Índices de tenant e de login

```sql
CREATE INDEX idx_campanhas_igreja_id ON campanhas(igreja_id);
CREATE INDEX idx_links_pagamento_igreja_id ON links_pagamento(igreja_id);
CREATE INDEX idx_eventos_igreja_id ON eventos(igreja_id);
CREATE INDEX idx_comunicados_mural_igreja_id ON comunicados_mural(igreja_id);
CREATE INDEX idx_contribuicoes_igreja_status ON contribuicoes(igreja_id, status);
CREATE INDEX idx_contribuicoes_igreja_criada_em ON contribuicoes(igreja_id, criada_em);
CREATE INDEX idx_contribuicoes_campanha_id ON contribuicoes(campanha_id);
CREATE UNIQUE INDEX idx_fieis_igreja_telefone ON fieis(igreja_id, telefone);
```

**Atenção antes de aplicar o último**: se já existirem fiéis duplicados (mesmo telefone, mesma igreja) nos dados atuais, o `CREATE UNIQUE INDEX` vai falhar — rodar uma query de verificação antes:

```sql
SELECT igreja_id, telefone, COUNT(*) FROM fieis GROUP BY igreja_id, telefone HAVING COUNT(*) > 1;
```

**Esforço**: pequeno. **Risco**: baixo (não altera dado existente, só adiciona estrutura — exceto o unique, que pode falhar se houver duplicata, daí a checagem prévia).

### 2. Dinheiro: `real` → `numeric(12,2)`

```sql
ALTER TABLE campanhas ALTER COLUMN meta TYPE numeric(12,2);
ALTER TABLE links_pagamento ALTER COLUMN valor_sugerido TYPE numeric(12,2);
ALTER TABLE contribuicoes ALTER COLUMN valor_bruto TYPE numeric(12,2);
ALTER TABLE contribuicoes ALTER COLUMN taxa_percentual TYPE numeric(6,4);
ALTER TABLE contribuicoes ALTER COLUMN taxa_valor TYPE numeric(12,2);
ALTER TABLE contribuicoes ALTER COLUMN valor_total_fiel TYPE numeric(12,2);
```

Drizzle representa `numeric` como `string` em TypeScript (não `number`) — atenção ao revisar: isso muda a assinatura de tipos em `src/lib/types.ts` e exige tocar `src/lib/comissao.ts`, `calculadora-arrecadacao.ts`, `relatorios.ts` (qualquer lugar que faça aritmética direta sobre esses campos precisa converter explicitamente, ex: `Number(valor)` antes de somar, ou uma lib de decimal). **Não é uma migration "só de banco"** — é banco + aplicação junto, avaliar em conjunto com quem mexe no `src/lib/comissao.ts`. **Esforço**: médio. **Risco**: médio (toca tipos usados em vários pontos da aplicação).

### 3. Estados de contribuição + idempotência

```sql
ALTER TABLE contribuicoes
  ALTER COLUMN status TYPE text,
  ADD CONSTRAINT contribuicoes_status_check
    CHECK (status IN ('aguardando_pix', 'confirmado', 'expirado', 'cancelado', 'falhou', 'estornado'));

ALTER TABLE contribuicoes ADD COLUMN provider text;
ALTER TABLE contribuicoes ADD COLUMN external_payment_id text;
CREATE UNIQUE INDEX idx_contribuicoes_provider_external_id
  ON contribuicoes(provider, external_payment_id)
  WHERE external_payment_id IS NOT NULL;
```

Depende da escolha de gateway real (ver `DECISIONS.md` ADR-003) para saber o que `provider`/`external_payment_id` de fato vão guardar — a estrutura pode ser criada antes, mas fica sem uso até a integração existir. **Esforço**: pequeno (schema) + médio (lógica de quem marca `expirado`/`falhou`). **Risco**: baixo isoladamente, mas acoplado à decisão de gateway.

## P2 — antes de escalar volume de dados

### 4. Timestamps: `text` → `timestamptz`

```sql
ALTER TABLE campanhas ALTER COLUMN criada_em TYPE timestamptz USING criada_em::timestamptz;
-- repetir para toda coluna *_em de todas as tabelas (criada_em, criado_em, publicado_em, convite_expira_em)
```

**Cuidado**: as colunas hoje têm granularidade mista — algumas só `YYYY-MM-DD` (sem hora), outras timestamp ISO completo (ver `DATABASE.md`, seção Timestamps). `USING criada_em::timestamptz` funciona para ambos os formatos (Postgres aceita `YYYY-MM-DD` como timestamp à meia-noite), mas o resultado vai ter granularidade inconsistente entre linhas antigas (meia-noite) e novas (hora real) até os dados antigos serem naturalmente substituídos. Exige também atualizar todo ponto de insert em `src/lib/db/repo.ts` para passar `new Date()` completo (objeto, não string fatiada) e o driver Drizzle/Neon aceitar `timestamptz` corretamente (confirmar compatibilidade do driver HTTP do Neon com esse tipo antes de aplicar em produção). **Esforço**: médio. **Risco**: baixo pra dado novo, cosmético pra dado antigo (granularidade não vira mais precisa retroativamente).

### 5. `atualizado_em` + auditoria mínima de chave Pix

```sql
ALTER TABLE igrejas ADD COLUMN atualizado_em timestamptz;
-- + trigger ou lógica de aplicação que registra quem alterou chave_pix e quando
```

Formato exato da auditoria (tabela de log separada vs. colunas `chave_pix_alterada_por`/`chave_pix_alterada_em`) não decidido — proposta a discutir antes de implementar. **Esforço**: pequeno (coluna) a médio (se virar tabela de log). **Risco**: baixo.

## P3 — futuro

### 6. FK de `webmasters.convidado_por_id`

```sql
ALTER TABLE webmasters ADD CONSTRAINT fk_webmasters_convidado_por
  FOREIGN KEY (convidado_por_id) REFERENCES webmasters(id);
```

**Esforço**: pequeno. **Risco**: baixo — mas confirmar antes que não existem valores órfãos (`convidado_por_id` apontando pra um `id` que não existe mais em `webmasters`).

### 7. Soft delete em `fieis` (dependência do fluxo de exclusão LGPD)

Não implementar preventivamente — desenhar junto com o fluxo de exclusão/anonimização de conta (ver `SECURITY.md`, seção LGPD), que ainda não existe. Registrado aqui só como lembrete de que a FK `contribuicoes.fiel_id` é `cascade` hoje e isso precisa ser revisitado nesse momento.

## Ordem sugerida de execução

1. Índices (item 1) — sem dependência, baixo risco, pode ir primeiro e sozinho.
2. Estados de contribuição + idempotência (item 3) — pode ir em paralelo com o item 1, mas coordenar com quem for desenhar a integração de gateway.
3. Dinheiro `numeric` (item 2) — depois dos dois acima, porque toca tipos usados amplamente; fazer com atenção redobrada e testes (`tests/e2e/campaigns`, `tests/e2e/donations` quando existir) rodando contra `TEST_DATABASE_URL` antes de aplicar em produção.
4. Timestamps (item 4) e auditoria (item 5) — quando houver tempo dedicado, não bloqueiam nada dos itens acima.
5. FK de webmaster (item 6) — a qualquer momento, isolado.
