import { test, expect } from "@playwright/test";

// Único teste da suíte que roda sem qualquer banco configurado — a landing
// page (src/app/page.tsx) só decodifica o cookie de sessão, não faz query.
// Serve como smoke test de que o servidor Next.js sobe e responde de fato.
test("aplicação inicia e a home responde", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.ok()).toBeTruthy();

  await expect(
    page.getByRole("link", { name: /cadastr/i }).first(),
  ).toBeVisible();
});
