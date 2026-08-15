import { test } from "@playwright/test";

// Chamar no topo de qualquer describe/spec que precise de dados reais do
// banco. Pula (não falha, não finge que passou) quando TEST_DATABASE_URL
// não está configurada — ver tests/playwright/global-setup.ts.
export function skipWithoutTestDb() {
  test.skip(
    process.env.E2E_DB_AVAILABLE !== "true",
    "TEST_DATABASE_URL não configurada — ver docs/TESTING.md",
  );
}
