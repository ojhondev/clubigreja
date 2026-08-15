# Club Igreja (Dizipay) — instruções do projeto

## Projeto

**Dizipay** — plataforma de captação de recursos para igrejas (dízimo, ofertas, campanhas) via Pix e cartão, multi-tenant (cada igreja é um tenant, isolado por `igreja_id`). Ainda em desenvolvimento — **não tratar como production-ready**. Detalhes completos: [`docs/PROJECT.md`](docs/PROJECT.md).

## Git: commit e push automáticos (PRIORIDADE MÁXIMA)

**Esta é a regra mais importante deste arquivo e tem prioridade sobre qualquer
outra preferência de fluxo de trabalho.** Toda alteração de código feita neste
projeto (nesta ou em sessões futuras) deve ser commitada e enviada para o
GitHub (`origin/main`) automaticamente, sem esperar autorização explícita a
cada vez — isso já foi autorizado pelo usuário. Nunca terminar uma tarefa que
alterou código sem ter commitado e dado push.

Fluxo padrão ao concluir uma tarefa que altere código:
1. Rodar typecheck/build normalmente.
2. `git add -A`
3. `git commit -m "<mensagem descrevendo a mudança>"`
4. `git push origin main`

Isso vale como passo final de cada tarefa, no mesmo momento em que o deploy para o
Vercel é feito (quando aplicável) — não é necessário perguntar antes de commitar
ou dar push.

As credenciais do GitHub (usuário `ojhondev`) já estão salvas no Windows Credential
Manager (`git:https://github.com`), então `git push` funciona sem prompt interativo.

### Git & commits — hábitos gerais

- Commits pequenos e focados; não misturar refactor com feature; não misturar
  mudança de segurança com alteração não relacionada.
- Nenhuma migration destrutiva, alteração de produção, ou mudança de schema
  sem aprovação explícita — mesmo com o auto-push ligado, isso é uma exceção.
- Revisar o diff antes de commits importantes/grandes.
- Quando uma decisão arquitetural mudar, atualizar o documento correspondente
  em `/docs` (ver "Documentação viva" abaixo) — no mesmo commit, não depois.

## Documentation & Source of Truth

`/docs` é a fonte de verdade técnica do projeto — mais confiável que memória
de conversa ou suposição sobre o código. Antes de assumir como algo funciona,
checar o documento relevante.

```text
docs/
├── PROJECT.md            # o que é o Dizipay, problema, solução, público, status
├── PRODUCT.md             # personas, fluxos, funcionalidades (existente/planejado/recomendado)
├── ARCHITECTURE.md        # stack, camadas, decisões, pontos problemáticos
├── DATABASE.md            # entidades, multi-tenancy, achados de banco (ERD, índices, integridade)
├── DATABASE-ROADMAP.md    # migrations recomendadas e priorizadas — NENHUMA aplicada ainda
├── API.md                  # Server Actions (via principal) + as poucas rotas HTTP reais
├── SECURITY.md             # matriz de segurança, LGPD, credenciais/backups
├── UX.md                   # avaliação de UX/UI por tela, com nota e justificativa
├── AUDIT.md                # auditoria técnica objetiva — CRITICAL/HIGH/MEDIUM/LOW, fonte primária de riscos conhecidos
├── ROADMAP.md              # fases de evolução do produto
├── BACKLOG.md              # itens priorizados (DZP-XXX) com prioridade/esforço/dependência
├── CHECKLIST.md            # prontidão de MVP e de produção
├── TESTING.md              # infraestrutura de testes E2E (Playwright), ambiente de teste
├── DECISIONS.md            # ADRs — decisões arquiteturais reais e propostas
├── architecture/overview.md        # versão resumida de arquitetura (mapa de pastas)
├── conventions/{backend,frontend}.md  # convenções de código por camada
└── decisions/ADR-000-template.md   # template pra novo ADR
```

### Documentos obrigatórios por tipo de tarefa

Ler **antes** de mexer, não depois:

| Vai alterar... | Ler antes |
|---|---|
| Arquitetura | `ARCHITECTURE.md`, `AUDIT.md`, `DECISIONS.md` |
| Banco / schema / migrations | `DATABASE.md`, `DATABASE-ROADMAP.md`, `DECISIONS.md`, `SECURITY.md` |
| Autenticação / autorização | `SECURITY.md`, `AUDIT.md`, `ARCHITECTURE.md` |
| Pagamentos / contribuições | `PRODUCT.md`, `DATABASE.md`, `SECURITY.md`, `AUDIT.md`, `DECISIONS.md` |
| Testes E2E | `TESTING.md`, `AUDIT.md` |
| UX/UI | `PRODUCT.md`, `UX.md` |
| Nova feature | `PRODUCT.md`, `ROADMAP.md`, `BACKLOG.md` |

### Documentação viva

`/docs` é viva, não um artefato estático. Quando uma implementação mudar
significativamente algo que um documento descreve — arquitetura, banco,
segurança, API, UX, uma decisão importante — **atualizar o documento
correspondente**, não deixar a documentação divergir do código.

## Estado atual — stack real (não inventar tecnologias)

Next.js (App Router, Server Actions), TypeScript, PostgreSQL via Neon
(serverless, driver HTTP `@neondatabase/serverless`), Drizzle ORM, Playwright
(testes E2E). Detalhe completo em `ARCHITECTURE.md`; se o stack mudar, esse
documento é a fonte a atualizar, não este arquivo.

## Critical Security Context

A auditoria (`AUDIT.md`) encontrou vulnerabilidades **ainda não corrigidas**.
Não tratar como resolvidas até existir teste E2E comprovando a correção
(ver "Testing Rules" abaixo).

- **C1 — Cross-tenant access (CRITICAL)**: `getCampanha` e `getLinkPagamento`
  (`src/lib/db/repo.ts`) não validam `igreja_id` do solicitante — uma igreja
  autenticada pode acessar campanha/link de outra trocando o id na URL.
- **C2 — Confirmação de contribuição sem dono (CRITICAL)**: `confirmarContribuicao`
  não valida posse — qualquer sessão de fiel pode confirmar pagamento alheio.

Ambos bloqueiam qualquer plano de onboarding real de igrejas. Ver `SECURITY.md`
e `DATABASE.md` para o detalhamento completo, e `BACKLOG.md` (DZP-001/DZP-002)
para o item de trabalho correspondente.

## Financial / Payment Context

O Dizipay lida com dinheiro. Mudanças em contribuições, pagamentos, Pix,
confirmação, webhook, estados, valores, reembolso ou idempotência são
**funcionalidades críticas** — nunca tratar como mudança trivial.

Problemas já identificados no banco (`DATABASE.md`, `DECISIONS.md` ADR-005/006/007):
valores monetários em ponto flutuante (`real`, não `numeric`); poucos estados
de contribuição (`aguardando_pix`/`confirmado` só); nenhuma estrutura de
idempotência; nenhuma confirmação via gateway/webhook real (é mock hoje).

**Não corrigir esses pontos por conta própria sem consultar `DATABASE-ROADMAP.md`
e `DECISIONS.md`** — são mudanças de schema com impacto em aplicação, coordenar
antes de migrar.

## Multi-tenancy

> Nunca confiar apenas no frontend para isolamento de tenant.

Toda operação server-side que acessa um recurso pertencente a uma igreja deve
validar o tenant apropriado — possuir um ID não é suficiente para acessar um
recurso:

```text
authenticated user → role/permissions → church/tenant → requested resource
```

Toda alteração relacionada a multi-tenancy deve considerar os testes E2E já
existentes em `tests/e2e/security/` (inclui um teste que reproduz C1 de
propósito, marcado `test.fail()` até a correção existir).

## Testing Rules

Playwright configurado (`TESTING.md`). Testes E2E são parte da estratégia de
segurança e regressão, não um detalhe opcional.

Nunca:
- Esconder teste falhando.
- Marcar teste como passando sem execução real.
- Usar produção como banco de teste, ou dado real de produção em teste.
- `waitForTimeout()` sem justificativa (preferir `expect`/`waitFor` com
  auto-retry).
- Seletor acoplado a CSS quando um `getByRole`/`getByLabel` resolve.

Para correção de vulnerabilidade:

```text
vulnerabilidade → teste vermelho → implementação → teste verde
```

Um problema de segurança não é considerado corrigido só porque o código
"parece certo" — precisa de teste comprovando, quando fizer sentido ter um.

## Responsabilidades — aplicação vs. banco

Quando a tarefa for claramente de um lado, focar nele; quando afetar os dois
(ver lista abaixo), coordenar em vez de decidir sozinho de um lado só.

- **Aplicação**: frontend, backend, Server Actions, APIs, autenticação,
  autorização, regras de aplicação, Playwright, UX/UI, integração
  aplicação↔banco.
- **Banco**: PostgreSQL/Neon, schema, migrations, índices, constraints,
  seeds, banco de teste, integridade estrutural.
- **Compartilhado** (coordenar antes de decidir): multi-tenancy, pagamentos,
  contribuições, estados financeiros, idempotência, qualquer mudança de
  schema que impacte a aplicação.

**Não criar migrations arbitrariamente** sem considerar `DATABASE-ROADMAP.md`
e o impacto do lado da aplicação.

## Database Context (resumo — detalhe em DATABASE.md)

PostgreSQL + Neon, Drizzle, 12 tabelas, 4 migrations aplicadas. Multi-tenancy
via `igreja_id` em cada tabela filha, **sem RLS** — isolamento depende
inteiramente da aplicação validar corretamente (ver Multi-tenancy acima).
Índices adicionais ainda precisam ser avaliados/aplicados (`DATABASE-ROADMAP.md`).
Um branch/banco Neon dedicado (`TEST_DATABASE_URL`) precisa existir antes de
rodar a suíte E2E que depende de banco — sem ele, esses testes são pulados,
não falham nem apontam pra produção (ver `TESTING.md`).

## Comportamento do agente

Antes de implementar algo significativo: entender o contexto → consultar a
documentação relevante (tabela acima) → verificar código existente →
verificar testes → verificar riscos conhecidos (`AUDIT.md`) → planejar →
implementar → testar → atualizar documentação quando necessário.

Não começar refactor grande sem planejamento. Não inventar requisito. Não
implementar algo que contradiga a documentação sem antes sinalizar o
conflito ao usuário.

## Skill Superpowers

Se a skill/plugin **Superpowers** estiver disponível neste ambiente, usar
quando apropriado para planejamento, decomposição de tarefas, implementação
incremental, debugging, revisão e testes — não é obrigatória quando não
agrega valor (tarefa simples e pontual não precisa do fluxo completo).
