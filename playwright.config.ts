import { defineConfig, devices } from "@playwright/test";

// Porta dedicada aos testes E2E, distinta da porta padrão do `npm run dev`
// (3000) — evita colidir com um servidor de desenvolvimento já rodando.
const PORT = process.env.PLAYWRIGHT_PORT ?? "3100";
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
  ],
  globalSetup: "./tests/playwright/global-setup.ts",

  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  // Só Chromium por enquanto — reduz complexidade e tempo de execução
  // enquanto a suíte é baseline. Adicionar Firefox/WebKit quando houver
  // motivo concreto (bug específico de browser, requisito de compatibilidade
  // reportado) — não por precaução.
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // Sobe o próprio `next dev` numa porta dedicada. Funciona mesmo sem banco
  // configurado — a landing page (`/`) não faz nenhuma query — mas qualquer
  // teste que dependa de dados reais é pulado automaticamente se
  // TEST_DATABASE_URL não estiver setada (ver tests/playwright/global-setup.ts
  // e docs/TESTING.md).
  webServer: {
    command: `npm run dev -- --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
