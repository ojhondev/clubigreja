import { test, expect } from "@playwright/test";
import { skipWithoutTestDb } from "../../helpers/skip-without-db";
import { loginComoWebmaster } from "../../helpers/auth";
import { webmasterSecundario, SENHA_TESTE } from "../../fixtures/test-data";

// O banco de teste agora semeia um webmaster secundário por padrão (ver
// tests/fixtures/test-data.ts — necessário pro teste de autorização de
// impersonação em tests/e2e/security/webmaster-impersonation.spec.ts), então
// /webmaster sempre cai no formulário de login, não no de bootstrap
// ("Configurar Master Primário"). O cenário de bootstrap com tabela
// `webmasters` vazia não é coberto por esta suíte — fora do escopo do sprint
// de segurança (foco: C1, C2, autorização de impersonação), e incompatível
// com um seed compartilhado que já garante um webmaster pra outros testes.
test.describe("WebMaster — login", () => {
  test.beforeEach(() => skipWithoutTestDb());

  test("credenciais válidas acessam o painel", async ({ page }) => {
    await loginComoWebmaster(page, {
      email: webmasterSecundario.email,
      senha: SENHA_TESTE,
    });

    await expect(
      page.getByRole("heading", { name: "Igrejas na plataforma" }),
    ).toBeVisible();
  });

  test("credenciais inválidas mostram erro e mantêm desautenticado", async ({
    page,
  }) => {
    await page.goto("/webmaster");
    await page.getByLabel("E-mail").fill(webmasterSecundario.email);
    await page.getByLabel("Senha", { exact: true }).fill("senha-errada");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page.getByText("E-mail ou senha incorretos.")).toBeVisible();
    await expect(page).toHaveURL(/\/webmaster/);

    await page.goto("/admin/igrejas");
    await expect(page).toHaveURL(/\/webmaster/);
  });
});
