// Roda uma vez antes de toda a suíte. Ver docs/TESTING.md — "Ambiente de
// teste" — para o raciocínio completo por trás desta estratégia.
//
// Regra de ouro: TEST_DATABASE_URL nunca é opcional-com-fallback. Se não
// estiver configurada, NÃO caímos silenciosamente para DATABASE_URL/
// POSTGRES_URL (que apontam pro banco de dev/produção/demo). Em vez disso,
// marcamos E2E_DB_AVAILABLE=false e cada spec que depende de banco decide
// sozinho pular (test.skip), com um motivo visível no relatório — nunca
// finge que passou.
import { isTestDbConfigured, resetAndSeedTestDb } from "../helpers/db";

async function globalSetup() {
  if (!isTestDbConfigured()) {
    console.warn(
      "\n[e2e] TEST_DATABASE_URL não configurada — testes que dependem de " +
        "banco serão PULADOS (não vão falhar silenciosamente nem apontar " +
        "para produção). Ver docs/TESTING.md, seção 'Ambiente de teste', " +
        "para configurar um banco de teste dedicado (ex: branch do Neon).\n",
    );
    process.env.E2E_DB_AVAILABLE = "false";
    return;
  }

  await resetAndSeedTestDb();
  process.env.E2E_DB_AVAILABLE = "true";
}

export default globalSetup;
