import { test, expect } from "@playwright/test";
import { skipWithoutTestDb } from "../../helpers/skip-without-db";
import { loginComoIgreja } from "../../helpers/auth";
import {
  adminA,
  adminB,
  campaignA,
  campaignB,
  churchA,
  churchB,
  linkB,
  SENHA_TESTE,
} from "../../fixtures/test-data";

// Cobre o achado CRITICAL C1 de docs/AUDIT.md: getCampanha/getLinkPagamento
// não filtravam por igrejaId. Corrigido em src/lib/db/repo.ts (parâmetro
// igrejaId opcional) + src/app/igreja/campanhas/[campanhaId]/qrcode/page.tsx
// e src/app/igreja/links/[linkId]/qrcode/page.tsx (passam sessao.igrejaId).
//
// Sem test.fail() — a correção existe, este teste deve passar de verdade.
// Se voltar a falhar, é regressão real, não resultado esperado.
test.describe("Isolamento entre igrejas (multi-tenancy) — C1", () => {
  test.beforeEach(() => skipWithoutTestDb());

  test("Admin A acessa QR code da própria campanha (Campaign A)", async ({
    page,
  }) => {
    await loginComoIgreja(page, { email: adminA.email, senha: SENHA_TESTE });
    await page.goto(`/igreja/campanhas/${campaignA.id}/qrcode`);

    await expect(page.getByText(churchA.nome)).toBeVisible();
    await expect(
      page.getByText(campaignA.titulo, { exact: false }),
    ).toBeVisible();
  });

  test("Admin A NÃO acessa campanha de Church B via URL direta", async ({
    page,
  }) => {
    await loginComoIgreja(page, { email: adminA.email, senha: SENHA_TESTE });
    await page.goto(`/igreja/campanhas/${campaignB.id}/qrcode`);

    // notFound() do Next.js renderiza a página 404 padrão — sem vazar nome
    // de igreja nem título de campanha de Church B.
    await expect(page.getByText(churchB.nome)).not.toBeVisible();
    await expect(page.getByText(campaignB.titulo)).not.toBeVisible();
  });

  test("Admin B NÃO acessa campanha de Church A via URL direta", async ({
    page,
  }) => {
    await loginComoIgreja(page, { email: adminB.email, senha: SENHA_TESTE });
    await page.goto(`/igreja/campanhas/${campaignA.id}/qrcode`);

    await expect(page.getByText(churchA.nome)).not.toBeVisible();
    await expect(page.getByText(campaignA.titulo)).not.toBeVisible();
  });

  test("Admin A NÃO acessa link de pagamento de Church B via URL direta", async ({
    page,
  }) => {
    await loginComoIgreja(page, { email: adminA.email, senha: SENHA_TESTE });
    await page.goto(`/igreja/links/${linkB.id}/qrcode`);

    await expect(page.getByText(churchB.nome)).not.toBeVisible();
    await expect(page.getByText(linkB.titulo)).not.toBeVisible();
  });
});
