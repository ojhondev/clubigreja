import { test, expect } from "@playwright/test";
import { skipWithoutTestDb } from "../../helpers/skip-without-db";
import { loginComoFiel } from "../../helpers/auth";
import { getContribuicaoStatusTeste } from "../../helpers/db";
import {
  donationPendenteA,
  donationPendenteA2,
  fielA,
  fielB,
  SENHA_TESTE,
} from "../../fixtures/test-data";

// Cobre o achado CRITICAL C2 de docs/AUDIT.md: confirmarContribuicao não
// validava dono. Corrigido em src/lib/db/repo.ts (parâmetro fielIdEsperado)
// + src/app/fiel/doar/pagar/[id]/actions.ts (passa sessao.usuarioId).
//
// Sem test.fail() — a correção existe, este teste deve passar de verdade.
test.describe("Autorização de confirmação de contribuição — C2", () => {
  test.beforeEach(() => skipWithoutTestDb());

  test("Fiel B NÃO consegue confirmar contribuição pendente de Fiel A", async ({
    page,
  }) => {
    await loginComoFiel(page, {
      telefone: fielB.telefone,
      senha: SENHA_TESTE,
    });

    // Fiel B, autenticado, vai direto pra tela de pagamento de uma
    // contribuição que pertence a Fiel A (id conhecido/adivinhado) e tenta
    // confirmar "já paguei" em nome dele.
    await page.goto(`/fiel/doar/pagar/${donationPendenteA.id}`);
    await page.getByRole("button", { name: "Continuar para o Pix" }).click();
    await page.getByRole("button", { name: "Entendi, continuar" }).click();

    // Não deve ter ido pro comprovante (a action deveria rejeitar antes do
    // redirect).
    await expect(page).not.toHaveURL(
      new RegExp(`/fiel/doar/comprovante/${donationPendenteA.id}`),
    );

    // E, o que realmente importa: o status no banco continua
    // "aguardando_pix" — Fiel B não confirmou nada em nome de Fiel A.
    const status = await getContribuicaoStatusTeste(donationPendenteA.id);
    expect(status).toBe("aguardando_pix");
  });

  test("Fiel A consegue confirmar a própria contribuição pendente", async ({
    page,
  }) => {
    await loginComoFiel(page, {
      telefone: fielA.telefone,
      senha: SENHA_TESTE,
    });

    await page.goto(`/fiel/doar/pagar/${donationPendenteA2.id}`);
    await page.getByRole("button", { name: "Continuar para o Pix" }).click();
    await page.getByRole("button", { name: "Entendi, continuar" }).click();

    await expect(page).toHaveURL(
      new RegExp(`/fiel/doar/comprovante/${donationPendenteA2.id}`),
    );

    const status = await getContribuicaoStatusTeste(donationPendenteA2.id);
    expect(status).toBe("confirmado");
  });
});
