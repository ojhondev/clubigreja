import { test, expect } from "@playwright/test";
import { skipWithoutTestDb } from "../../helpers/skip-without-db";
import { loginComoIgreja } from "../../helpers/auth";
import { adminA, churchA, SENHA_TESTE } from "../../fixtures/test-data";

test.describe("Login da igreja", () => {
  test.beforeEach(() => skipWithoutTestDb());

  test("credenciais válidas redirecionam pro dashboard", async ({ page }) => {
    await loginComoIgreja(page, { email: adminA.email, senha: SENHA_TESTE });
    // Nome da própria igreja no h1 confirma não só que logou, mas que
    // caiu no dashboard da igreja certa (Church A, não outra).
    await expect(
      page.getByRole("heading", { name: churchA.nome }),
    ).toBeVisible();
  });

  test("credenciais inválidas mostram erro e mantêm desautenticado", async ({
    page,
  }) => {
    await page.goto("/entrar/igreja");
    await page.getByLabel("E-mail").fill(adminA.email);
    await page.getByLabel("Senha").fill("senha-errada-de-proposito");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page.getByText("E-mail ou senha incorretos.")).toBeVisible();
    await expect(page).toHaveURL(/\/entrar\/igreja/);

    // Confirma que a sessão de fato não foi criada: rota protegida redireciona.
    await page.goto("/igreja/dashboard");
    await expect(page).toHaveURL(/\/entrar/);
  });
});
