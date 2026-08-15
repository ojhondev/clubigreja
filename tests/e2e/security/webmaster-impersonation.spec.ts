import { test, expect } from "@playwright/test";
import { skipWithoutTestDb } from "../../helpers/skip-without-db";
import { loginComoWebmaster } from "../../helpers/auth";
import {
  churchA,
  webmasterSecundario,
  SENHA_TESTE,
} from "../../fixtures/test-data";

// Cobre o achado H2 de docs/AUDIT.md e docs/SECURITY.md: "Acessar como"
// (impersonação de igreja/fiel) não checava permissão própria — qualquer
// webmaster autenticado, primário ou secundário, conseguia impersonar
// qualquer conta. Corrigido com podeImpersonar (src/lib/auth/permissoes.ts,
// restrito a nivel === "primario") em src/app/admin/igrejas/actions.ts e
// src/app/admin/fieis/actions.ts.
//
// Sem test.fail() — a correção existe, este teste deve passar de verdade.
test.describe("WebMaster — autorização de impersonação", () => {
  test.beforeEach(() => skipWithoutTestDb());

  test("Master Secundário sem permissão NÃO consegue impersonar uma igreja", async ({
    page,
  }) => {
    await loginComoWebmaster(page, {
      email: webmasterSecundario.email,
      senha: SENHA_TESTE,
    });

    await page.goto("/admin/igrejas");

    const formDaIgrejaA = page.locator("form", {
      has: page.locator(`input[name="igrejaId"][value="${churchA.id}"]`),
    });
    await formDaIgrejaA
      .getByRole("button", { name: "Acessar como igreja" })
      .click();

    // A action rejeita silenciosamente (sem podeImpersonar) — sem
    // redirect, a sessão continua sendo a de webmaster, na mesma página.
    await expect(page).toHaveURL(/\/admin\/igrejas/);
    await expect(page).not.toHaveURL(/\/igreja\/dashboard/);

    // Confirma que a sessão realmente continua sendo de webmaster (não virou
    // "igreja" por baixo dos panos) — uma rota exclusiva de webmaster ainda
    // deve responder normalmente.
    await page.goto("/admin/fieis");
    await expect(page).toHaveURL(/\/admin\/fieis/);
  });
});
