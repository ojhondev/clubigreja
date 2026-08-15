import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

// Login sempre via UI real (não injeção de cookie) — os testes de auth e de
// isolamento multi-tenant precisam exercitar o fluxo de verdade, não um
// atalho que puderia mascarar um bug no próprio login.
export async function loginComoIgreja(
  page: Page,
  credenciais: { email: string; senha: string },
) {
  await page.goto("/entrar/igreja");
  await page.getByLabel("E-mail").fill(credenciais.email);
  await page.getByLabel("Senha").fill(credenciais.senha);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/igreja\/dashboard/);
}
