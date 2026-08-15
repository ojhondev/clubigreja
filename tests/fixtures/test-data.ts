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

// WebMaster não é seedado — nenhum webmaster existe no banco de teste
// recém-resetado, então o teste de webmaster (tests/e2e/webmaster) usa o
// próprio fluxo de bootstrap ("Master Primário") da aplicação, e não um
// fixture pré-criado. Ver tests/e2e/webmaster/webmaster-login.spec.ts.
export const webmasterPrimario = {
  nome: "WebMaster E2E",
  email: "webmaster@e2e.dizipay.test",
  senha: SENHA_TESTE,
};
