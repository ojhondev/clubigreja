// Dados de teste centralizados — nenhuma credencial hardcoded espalhada
// pelos specs. Tudo aqui é sintético, usado só contra TEST_DATABASE_URL
// (nunca produção/demo) e recriado do zero a cada `npx playwright test`
// pelo global-setup. Senha fixa é aceitável aqui: não é segredo real, só
// existe dentro de um banco de teste descartável.
//
// IDs prefixados com "e2e-" para nunca colidir com os dados de
// src/lib/db/seed-data.ts (usados em dev/demo, não em teste).

export const SENHA_TESTE = "E2eTeste123!";

export const churchA = {
  id: "e2e-church-a",
  slug: "e2e-igreja-a",
  nome: "Igreja E2E Alfa",
  cnpj: "11.111.111/0001-11",
  responsavelNome: "Admin A",
  responsavelEmail: "admin-a@e2e.dizipay.test",
  responsavelWhatsapp: "(11) 90000-0001",
  cidade: "São Paulo",
  uf: "SP",
  logoEmoji: "⛪",
  statusOnboarding: "aprovado" as const,
  chavePix: "financeiro-a@e2e.dizipay.test",
  criadaEm: "2026-01-01",
};

export const churchB = {
  id: "e2e-church-b",
  slug: "e2e-igreja-b",
  nome: "Igreja E2E Beta",
  cnpj: "22.222.222/0001-22",
  responsavelNome: "Admin B",
  responsavelEmail: "admin-b@e2e.dizipay.test",
  responsavelWhatsapp: "(11) 90000-0002",
  cidade: "Rio de Janeiro",
  uf: "RJ",
  logoEmoji: "⛪",
  statusOnboarding: "aprovado" as const,
  chavePix: "financeiro-b@e2e.dizipay.test",
  criadaEm: "2026-01-01",
};

export const adminA = {
  id: "e2e-user-admin-a",
  igrejaId: churchA.id,
  nome: "Admin A",
  email: churchA.responsavelEmail,
  papel: "administrador" as const,
};

export const adminB = {
  id: "e2e-user-admin-b",
  igrejaId: churchB.id,
  nome: "Admin B",
  email: churchB.responsavelEmail,
  papel: "administrador" as const,
};

export const campaignA = {
  id: "e2e-campanha-a",
  igrejaId: churchA.id,
  titulo: "Reforma do Templo A",
  descricao: "Campanha de teste E2E da Igreja Alfa.",
  meta: 10_000,
  prazo: "2026-12-31",
  imagemEmoji: "🙏",
  encerrada: false,
  criadaEm: "2026-01-02",
};

export const campaignB = {
  id: "e2e-campanha-b",
  igrejaId: churchB.id,
  titulo: "Novo Equipamento B",
  descricao: "Campanha de teste E2E da Igreja Beta.",
  meta: 20_000,
  prazo: "2026-12-31",
  imagemEmoji: "🎸",
  encerrada: false,
  criadaEm: "2026-01-02",
};

export const linkA = {
  id: "e2e-link-a",
  igrejaId: churchA.id,
  titulo: "Dízimo Igreja Alfa",
  tipo: "dizimo" as const,
  valorSugerido: 50,
  ativo: true,
  criadoEm: "2026-01-02",
};

export const linkB = {
  id: "e2e-link-b",
  igrejaId: churchB.id,
  titulo: "Oferta Igreja Beta",
  tipo: "oferta" as const,
  valorSugerido: 30,
  ativo: true,
  criadoEm: "2026-01-02",
};

export const fielA = {
  id: "e2e-fiel-a",
  igrejaId: churchA.id,
  nome: "Fiel Teste A",
  telefone: "(11) 90000-1001",
  criadoEm: "2026-01-03",
};

export const fielB = {
  id: "e2e-fiel-b",
  igrejaId: churchB.id,
  nome: "Fiel Teste B",
  telefone: "(11) 90000-1002",
  criadoEm: "2026-01-03",
};

// Uma contribuição confirmada por igreja — suficiente para testar relatório/
// dashboard (soma de arrecadação) e, futuramente, um teste de isolamento
// multi-tenant sobre dado financeiro (não só sobre campanha/link).
export const donationA = {
  id: "e2e-doacao-a",
  igrejaId: churchA.id,
  fielId: fielA.id,
  campanhaId: campaignA.id,
  tipo: "campanha" as const,
  meio: "pix" as const,
  valorBruto: 100,
  taxaPercentual: 0.025,
  taxaValor: 2.5,
  valorTotalFiel: 102.5,
  taxaCobradaVia: "pix_separado" as const,
  status: "confirmado" as const,
  criadaEm: "2026-01-04",
};

// Contribuição de Fiel A ainda não confirmada — usada pra testar que outra
// pessoa (Fiel B, ou uma sessão de igreja) não consegue confirmá-la em nome
// do dono (achado C2/AUDIT.md). Fica de fora do resetAndSeedTestDb padrão
// só se algum teste precisar resetar status entre execuções; hoje é
// seedada junto, já que confirmá-la (ou falhar em confirmar) não afeta
// outros testes.
export const donationPendenteA = {
  id: "e2e-doacao-pendente-a",
  igrejaId: churchA.id,
  fielId: fielA.id,
  campanhaId: null,
  tipo: "dizimo" as const,
  meio: "pix" as const,
  valorBruto: 50,
  taxaPercentual: 0.035,
  taxaValor: 1.75,
  valorTotalFiel: 51.75,
  taxaCobradaVia: "pix_separado" as const,
  status: "aguardando_pix" as const,
  criadaEm: "2026-01-05",
};

// Segunda contribuição pendente de Fiel A, dedicada ao teste de confirmação
// bem-sucedida pelo próprio dono — separada de donationPendenteA pra não
// criar dependência de ordem entre os dois testes de C2 (um confirma de
// verdade, mudando o status; o outro precisa que o status continue
// "aguardando_pix" o tempo todo).
export const donationPendenteA2 = {
  id: "e2e-doacao-pendente-a2",
  igrejaId: churchA.id,
  fielId: fielA.id,
  campanhaId: null,
  tipo: "oferta" as const,
  meio: "pix" as const,
  valorBruto: 40,
  taxaPercentual: 0.035,
  taxaValor: 1.4,
  valorTotalFiel: 41.4,
  taxaCobradaVia: "pix_separado" as const,
  status: "aguardando_pix" as const,
  criadaEm: "2026-01-05",
};

export const donationB = {
  id: "e2e-doacao-b",
  igrejaId: churchB.id,
  fielId: fielB.id,
  campanhaId: campaignB.id,
  tipo: "campanha" as const,
  meio: "pix" as const,
  valorBruto: 200,
  taxaPercentual: 0.025,
  taxaValor: 5,
  valorTotalFiel: 205,
  taxaCobradaVia: "pix_separado" as const,
  status: "confirmado" as const,
  criadaEm: "2026-01-04",
};

// WebMaster não é seedado — nenhum webmaster existe no banco de teste
// recém-resetado, então o teste de webmaster (tests/e2e/webmaster) usa o
// próprio fluxo de bootstrap ("Master Primário") da aplicação, e não um
// fixture pré-criado. Ver tests/e2e/webmaster/webmaster-login.spec.ts.
export const webmasterPrimario = {
  nome: "WebMaster E2E",
  email: "webmaster@e2e.dizipay.test",
  senha: SENHA_TESTE,
};

// Master Secundário sem nenhuma flag de permissão — seedado direto (ao
// contrário do primário, que nasce só via bootstrap da UI), pra testar que
// ele NÃO consegue impersonar (achado H2/AUDIT.md, corrigido com
// podeImpersonar em src/lib/auth/permissoes.ts).
export const webmasterSecundario = {
  id: "e2e-webmaster-secundario",
  nome: "WebMaster Secundário E2E",
  email: "webmaster-secundario@e2e.dizipay.test",
  nivel: "secundario" as const,
  podeGerenciarPagamentos: false,
  podeAprovarIgrejas: false,
  criadoEm: "2026-01-01",
};
