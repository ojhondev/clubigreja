# PRODUCT.md — Dizipay

## Personas

| Persona | Papel no sistema | Objetivo principal |
|---|---|---|
| Responsável pela igreja (pastor/tesoureiro/secretário) | `igreja` | Captar recursos, acompanhar arrecadação, gerenciar campanhas e comunicação com a comunidade |
| Fiel/membro | `fiel` | Contribuir com dízimo/oferta/campanha de forma simples, acompanhar histórico |
| Contribuinte avulso (visitante) | sem cadastro (fluxo "convidado") | Doar uma vez via link/campanha público, sem criar conta |
| Equipe Dizipay (webmaster) | `webmaster` (primário/secundário) | Aprovar cadastro de igrejas, dar suporte via "acessar como", gerenciar chave Pix em nome da igreja quando necessário |

Não existe hoje (e não deve ser assumido): múltiplos usuários de staff por igreja com papéis diferentes (`PapelIgreja` — `administrador`/`tesoureiro`/`secretario` — **está definido em `types.ts` mas não implementado**: a tabela `usuarios_igreja` existe no schema, mas não há fluxo de convite de staff adicional, só o login único da igreja).

## Jobs-to-be-done

- "Quando alguém quer doar pra minha igreja mas não está no culto, preciso de um jeito de receber sem fricção." (igreja)
- "Quando a igreja está arrecadando pra uma reforma, quero ver quanto falta e contribuir sabendo que vai pra essa causa específica." (fiel)
- "Quando esqueço de dizimar, quero um lembrete simples." (fiel — parcialmente implementado, ver abaixo)
- "Quando uma igreja se cadastra, preciso validar que é legítima antes de liberar." (webmaster)

## Principais fluxos

### Igreja
Cadastro (`cadastrar-igreja`) → análise/aprovação por webmaster (`admin/igrejas`) → login (`entrar/igreja`) → perfil público configurado (`igreja/perfil`) → criação de campanha/link (`igreja/campanhas`, `igreja/links`) → publicação → recebimento de contribuições → acompanhamento (`igreja/dashboard`, `igreja/relatorios`) → comunicação via mural/eventos.

### Fiel
Descobre a igreja (link direto ou slug) → cadastro (`cadastrar-fiel`) ou contribuição avulsa sem cadastro → escolhe campanha/link → escolhe valor → Pix (copia-e-cola gerado na hora) ou cartão salvo → confirma pagamento manualmente → comprovante → histórico (`fiel/historico`) → notificações push (`fiel/notificacoes`).

### WebMaster
Setup do primeiro webmaster (só possível se nenhum existir) → convite de outros webmasters (token único, 7 dias, primário apenas) → aprovação de igrejas → suporte via "Acessar como" (impersonação de igreja ou fiel).

## Funcionalidades — existente / em desenvolvimento / planejado / recomendado

### EXISTENTE (implementado e funcional, ainda que com lacunas documentadas em AUDIT.md)

- Cadastro e aprovação de igreja
- Cadastro de fiel (com fluxo de convidado sem conta)
- Login separado por papel (igreja/fiel/webmaster)
- Página pública da igreja por slug
- Campanhas com meta/prazo, links de pagamento fixos
- Contribuição via Pix real (payload EMV) + cartão (tokenizado fake)
- Cálculo e cobrança de taxa de processamento (mockada no cartão)
- Dashboard financeiro com gráficos (Recharts)
- Relatórios com exportação CSV
- Mural de comunicados, eventos
- QR Code para campanhas/links
- Notificações push (opt-in, service worker) — **funcionalmente incompleto em produção**, ver AUDIT.md (armazenamento em memória)
- Sistema WebMaster com convites e "acessar como"
- Calculadora de arrecadação (landing/marketing)

### EM DESENVOLVIMENTO / INCOMPLETO

- Gateway de pagamento real (hoje 100% mock, ponto de troca já preparado em `src/lib/payments/index.ts`)
- Confirmação de pagamento (hoje depende do clique do fiel, sem verificação bancária)
- Multiusuário de staff por igreja (`PapelIgreja` definido no tipo, não implementado no fluxo)
- Boleto (listado como `MeioPagamento` no schema e em labels de UI, **sem nenhuma lógica de geração** — é enum morto hoje)

### PLANEJADO (mencionado em comentário de código ou histórico de commit, não implementado)

- Integração real com Asaas (comentário explícito em `payments/index.ts`)
- Tabela real de inscrições push (hoje é array em memória, comentário confirma a intenção)

### RECOMENDADO (não mencionado no código, sugestão desta auditoria)

- Webhook de confirmação de pagamento (ver SECURITY.md e AUDIT.md)
- Estados adicionais de contribuição (cancelado/expirado/estornado)
- Rate limiting em login
- Testes automatizados nos fluxos críticos (auth, multi-tenancy, pagamento)
- `.env.example` documentando variáveis obrigatórias

## MVP (o que já cobre um ciclo completo utilizável)

O produto **já tem um MVP funcional de ponta a ponta** no sentido de fluxo de produto (igreja se cadastra → recebe aprovação → publica campanha → fiel contribui → igreja vê o dinheiro no dashboard). O que falta para o MVP ser **seguro para dinheiro real** é diferente do que falta para o fluxo de produto existir — ver distinção em [`AUDIT.md`](AUDIT.md) e [`ROADMAP.md`](ROADMAP.md).

## Regras de negócio confirmadas no código

- A doação vai 100% para a chave Pix da própria igreja — o Dizipay nunca custodia esse valor (decisão explícita, ver DECISIONS.md).
- A taxa de processamento é cobrada à parte, do fiel, no cartão salvo — 3,5% para dízimo/oferta, 2,5% para campanha/evento/livre (`src/lib/comissao.ts`).
- Um fiel pode contribuir sem se cadastrar (fluxo convidado), mas precisa de cartão salvo (cadastro leve) para a segunda cobrança (taxa) funcionar.
- Só existe um webmaster primário por vez sem convite — bootstrap é bloqueado assim que o primeiro é criado.
