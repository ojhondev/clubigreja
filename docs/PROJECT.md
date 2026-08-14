# PROJECT.md — Dizipay

## O que é

**Dizipay** (nome comercial atual; código-fonte e banco ainda usam `club-igreja`/`clubigreja` como identificador técnico) é uma plataforma de captação de recursos para igrejas: dízimo, ofertas e campanhas, recebidos via Pix e cartão, com uma taxa de processamento cobrada à parte do fiel.

Não é "um site de doação" genérico — o produto assume que a igreja tem uma operação contínua (não só uma campanha pontual): perfil público, mural de comunicados, eventos, campanhas com meta e prazo, links de pagamento reutilizáveis, dashboard financeiro e relatórios.

## Problema

Igrejas brasileiras, especialmente as menores e menos "tech-savvy", têm dificuldade em:
- Captar dízimo/oferta fora do culto presencial (dinheiro/cartão físico na cesta).
- Rodar campanhas de arrecadação (reforma, equipamento, projeto social) com transparência de quanto já foi arrecadado.
- Oferecer aos membros uma forma simples de contribuir remotamente sem fricção técnica.

## Solução

Uma página pública por igreja (`/[slug]`), com identidade própria, onde o fiel se cadastra, contribui via Pix ou cartão salvo, e acompanha campanhas em andamento. A igreja tem um painel para gerenciar campanhas, links de pagamento, eventos, mural e ver relatórios financeiros. O dinheiro da doação em si **nunca passa pela conta do Dizipay** — vai direto via Pix para a chave cadastrada pela própria igreja. O modelo de receita do Dizipay é a taxa de processamento, cobrada separadamente do fiel no cartão salvo dele (decisão registrada no commit `459c6b9`, ver [`DECISIONS.md`](DECISIONS.md)).

## Público (quem usa)

- **Igreja** (perfil `igreja`, único usuário de staff por enquanto — sem multiusuário por igreja ainda): cadastra a igreja, gerencia campanhas/links/eventos/mural, vê dashboard e relatórios.
- **Fiel** (perfil `fiel`): membro/contribuinte, se cadastra numa igreja específica, contribui, acompanha histórico e recebe notificações push.
- **WebMaster** (perfil `webmaster`, interno): equipe do próprio Dizipay — aprova cadastro de igreja, gerencia convites de outros webmasters, pode "acessar como" qualquer igreja ou fiel para suporte.
- **Visitante não cadastrado**: pode contribuir num link/campanha público sem se cadastrar como fiel (fluxo de "convidado").

## Proposta de valor

- Para a igreja: menos fricção pra captar recursos remotamente, sem custodiar dinheiro de terceiros (chave Pix é sempre da própria igreja), com visão financeira consolidada.
- Para o fiel: contribuir em segundos, com histórico e lembrete de dízimo recorrente, numa experiência pensada para quem "nem sempre é familiarizado com tecnologia" (citação do README original do projeto).

## Principais conceitos (vocabulário do domínio)

| Termo | Significado |
|---|---|
| Igreja | Tenant da plataforma — tem slug público, chave Pix própria, staff |
| Fiel | Membro/doador vinculado a uma igreja |
| Campanha | Captação com meta e prazo (reforma, equipamento etc.) |
| Link de pagamento | Cobrança fixa reutilizável (dízimo, oferta, livre) |
| Contribuição | Uma transação de doação (Pix ou cartão), com taxa associada |
| WebMaster | Equipe interna do Dizipay, hierarquia própria (primário/secundário) |
| Comissão / taxa de processamento | Cobrada do fiel, não da igreja — 3,5% dízimo/oferta, 2,5% campanha/evento/livre |

## Status atual (nesta auditoria)

Produto em estágio **pré-lançamento comercial**: banco real (Postgres/Neon) e autenticação real (scrypt) já substituíram os mocks originais, mas o gateway de pagamento continua **100% mockado** (Pix é gerado de verdade — payload EMV válido — mas a confirmação de pagamento é o próprio fiel clicando "já paguei", sem verificação bancária real). Não há testes automatizados, CI/CD, nem `.env.example`. Ver [`AUDIT.md`](AUDIT.md) para o detalhamento completo e [`ROADMAP.md`](ROADMAP.md) para o caminho até produção real.
