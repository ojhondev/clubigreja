import { test, expect } from "@playwright/test";
import { skipWithoutTestDb } from "../../helpers/skip-without-db";
import { webmasterPrimario } from "../../fixtures/test-data";

// Não há webmaster pré-seedado (ver tests/fixtures/test-data.ts) — o banco
// de teste recém-resetado não tem nenhum registro em `webmasters`, então
// /webmaster cai no fluxo real de bootstrap da aplicação ("Master
// Primário"), em vez de um fixture artificial. Testa o caminho real que um
// primeiro deploy percorreria.
//
// Impersonação ("Acessar como") e níveis secundário/permissões ficam pro
// sprint de segurança, conforme pedido — não implementados aqui.
test.describe("WebMaster — bootstrap e login", () => {
  test.beforeEach(() => skipWithoutTestDb());

  test("cria o Master Primário e acessa o painel", async ({ page }) => {
    await page.goto("/webmaster");
    await expect(
      page.getByRole("heading", { name: "Configurar Master Primário" }),
    ).toBeVisible();

    await page.getByLabel("Seu nome").fill(webmasterPrimario.nome);
    await page.getByLabel("E-mail").fill(webmasterPrimario.email);
    await page
      .getByLabel("Senha", { exact: true })
      .fill(webmasterPrimario.senha);
    await page.getByLabel("Confirmar senha").fill(webmasterPrimario.senha);
    await page.getByRole("button", { name: "Criar Master Primário" }).click();

    await expect(page).toHaveURL(/\/admin\/igrejas/);
  });
});
