import { test, expect } from "@playwright/test";
import { skipWithoutTestDb } from "../../helpers/skip-without-db";
import { loginComoIgreja } from "../../helpers/auth";
import { adminA, SENHA_TESTE } from "../../fixtures/test-data";

test.describe("Criação de campanha", () => {
  test.beforeEach(() => skipWithoutTestDb());

  test("igreja cria campanha e ela aparece na lista", async ({ page }) => {
    await loginComoIgreja(page, { email: adminA.email, senha: SENHA_TESTE });

    await page.goto("/igreja/campanhas");

    const titulo = `Campanha E2E ${Date.now()}`;
    await page.getByLabel("Título").fill(titulo);
    await page
      .getByLabel("Descrição")
      .fill("Criada pelo teste E2E de baseline.");
    await page.getByLabel("Meta (R$)").fill("5000");
    await page.getByLabel("Prazo").fill("2026-12-31");
    await page.getByRole("button", { name: "Criar campanha" }).click();

    await expect(page.getByText(titulo)).toBeVisible();
  });
});
