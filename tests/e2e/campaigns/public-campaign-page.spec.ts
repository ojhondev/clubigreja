import { test, expect } from "@playwright/test";
import { skipWithoutTestDb } from "../../helpers/skip-without-db";
import { campaignA, churchA } from "../../fixtures/test-data";
import { formatarMoeda } from "../../../src/lib/comissao";

test.describe("Página pública da campanha", () => {
  test.beforeEach(() => skipWithoutTestDb());

  test("mostra nome da igreja, título, meta e CTA de contribuição", async ({
    page,
  }) => {
    await page.goto(`/doar/campanha/${campaignA.id}`);

    await expect(page.getByText(churchA.nome)).toBeVisible();
    await expect(
      page.getByRole("heading", { name: new RegExp(campaignA.titulo) }),
    ).toBeVisible();
    await expect(page.getByText(campaignA.descricao)).toBeVisible();
    await expect(
      page.getByText(`de ${formatarMoeda(campaignA.meta)}`),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Continuar para o Pix" }),
    ).toBeVisible();
  });
});
