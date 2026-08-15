import { test, expect } from "@playwright/test";
import { skipWithoutTestDb } from "../../helpers/skip-without-db";
import { loginComoIgreja } from "../../helpers/auth";
import {
  adminA,
  campaignB,
  churchB,
  SENHA_TESTE,
} from "../../fixtures/test-data";

// Reproduz o achado CRITICAL C1 de docs/AUDIT.md: getCampanha/getLinkPagamento
// não filtram por igrejaId. Este teste é o baseline de segurança pedido —
// ele NÃO corrige a vulnerabilidade, só a transforma num teste reproduzível.
//
// test.fail() marca a suíte como "falha esperada": o relatório do Playwright
// mostra a falha (não some, não vira verde), mas não quebra o exit code do
// CI como um teste comum quebraria. Quando a vulnerabilidade for corrigida
// (ver docs/BACKLOG.md DZP-001), este teste vai começar a PASSAR — e o
// Playwright vai reportar isso como inesperado, forçando remover o
// test.fail() aqui. É o sinal de que a correção funcionou.
test.describe("Isolamento entre igrejas (multi-tenancy)", () => {
  test.beforeEach(() => skipWithoutTestDb());

  test.fail(
    true,
    "Vulnerabilidade conhecida — docs/AUDIT.md C1: getCampanha não filtra por igrejaId. " +
      "Remover test.fail() quando DZP-001 for corrigido.",
  );

  test("Admin A não deve conseguir ver campanha de Church B via URL direta", async ({
    page,
  }) => {
    await loginComoIgreja(page, { email: adminA.email, senha: SENHA_TESTE });

    // Admin A, autenticado como Church A, troca o id na URL pra uma
    // campanha que pertence a Church B.
    await page.goto(`/igreja/campanhas/${campaignB.id}/qrcode`);

    // Comportamento esperado (seguro): nenhum dado de Church B aparece —
    // idealmente a rota nem deveria resolver (404/redirect).
    // Comportamento real hoje: a página renderiza normalmente com os dados
    // de Church B, porque getCampanha() não valida posse.
    await expect(page.getByText(churchB.nome)).not.toBeVisible();
    await expect(page.getByText(campaignB.titulo)).not.toBeVisible();
  });
});
