# API.md — Dizipay

O Dizipay **não expõe uma API REST tradicional**. A via principal de leitura/escrita é **Server Actions** do Next.js (função assíncrona chamada diretamente pelo componente, sem endpoint HTTP público). Rotas HTTP reais em `src/app/api/` existem só para os poucos casos que exigem isso.

## Rotas HTTP reais (`src/app/api/`)

| Rota | Método | Autenticação | Descrição |
|---|---|---|---|
| `/api/igrejas/buscar` | GET | Pública | Busca igreja por slug/nome, para autocomplete de cadastro de fiel |
| `/api/push/subscribe` | POST | Sessão de fiel (cookie) | Registra inscrição de push notification |
| `/api/push/vapid-public-key` | GET | Pública | Retorna a chave pública VAPID atual (gerada em memória, muda a cada boot — ver AUDIT.md) |

Nenhuma dessas rotas tem proteção de rate limiting. `/api/push/subscribe` não valida `Origin`/`Sec-Fetch-Site` (CSRF de baixo impacto — ver SECURITY.md).

## Server Actions (superfície real de "API")

Organizadas por área, cada `actions.ts` ao lado das páginas que usa. Principais grupos:

- **Auth** (`src/lib/auth/actions.ts`): login/logout de igreja e fiel, criação de sessão.
- **Cadastro** (`cadastrar-igreja/actions.ts`, `cadastrar-fiel/actions.ts`): criação de conta.
- **Campanhas/Links** (`igreja/campanhas/actions.ts`, `igreja/links/actions.ts`): CRUD escopado por `igrejaId` da sessão.
- **Doação** (`doar/campanha/[id]/actions.ts`, `doar/link/[id]/actions.ts`, `fiel/doar/actions.ts`): geração de Pix, confirmação de pagamento.
- **Admin/WebMaster** (`admin/igrejas/actions.ts`, `admin/fieis/actions.ts`, `admin/equipe/actions.ts`, `webmaster/actions.ts`, `webmaster/convite/[token]/actions.ts`): aprovação de igreja, impersonação, convites.
- **Perfil/Mural/Eventos** (`igreja/perfil/actions.ts`, `igreja/mural/actions.ts`, `igreja/eventos/actions.ts`).

### Padrão de autorização

Cada Server Action revalida a sessão internamente (`getSessao()` ou `webmasterDaSessao()`) — não existe um decorator/wrapper central de autorização. Isso é correto hoje, mas depende de disciplina: uma nova action que esqueça de revalidar fica desprotegida além do gate de papel do middleware (`src/proxy.ts`, que só olha prefixo de rota).

### Padrão de erro/retorno

Inconsistente entre grupos: `cadastrar-igreja` usa `useActionState` com objeto `{ erro?: string }` retornado — o padrão correto. Várias actions do fluxo de doação e do mural apenas fazem `return` silencioso em caso de validação falha, sem retornar erro estruturado (ver UX.md).

## Ausências relevantes

- **Sem webhook de pagamento** — não existe endpoint para gateway externo confirmar transação (esperado, hoje é mock; vira obrigatório na integração real, ver DECISIONS.md).
- **Sem versionamento de API** — não é uma preocupação hoje dado que não há consumidores externos.
- **Sem OpenAPI/schema formal** — não é necessário enquanto o consumidor é só o próprio front Next.js via Server Actions.

## Recomendação para quando a API precisar ser exposta externamente

Se o Dizipay algum dia precisar de app mobile nativo ou integração de terceiro (ex: contabilidade da igreja puxando relatório via API), aí sim caberia uma camada de rotas REST/tRPC versionada e documentada — não recomendado antecipar essa complexidade agora (ver seção "NÃO FAÇA ISSO" da diretriz desta auditoria).
