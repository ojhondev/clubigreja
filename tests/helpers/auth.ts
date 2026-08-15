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

export async function loginComoFiel(
  page: Page,
  credenciais: { telefone: string; senha: string },
) {
  await page.goto("/entrar/fiel");
  await page.getByLabel("Seu celular").fill(credenciais.telefone);
  await page.getByLabel("Senha").fill(credenciais.senha);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/fiel\/inicio/);
}

// Assume que já existe pelo menos um webmaster no banco de teste (a rota
// /webmaster cai no formulário de login, não no de bootstrap, quando já
// existe algum). Para bootstrap do Master Primário num banco vazio, ver
// tests/e2e/webmaster/webmaster-login.spec.ts, que preenche o formulário
// direto em vez de usar este helper.
export async function loginComoWebmaster(
  page: Page,
  credenciais: { email: string; senha: string },
) {
  await page.goto("/webmaster");
  await page.getByLabel("E-mail").fill(credenciais.email);
  await page.getByLabel("Senha", { exact: true }).fill(credenciais.senha);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/admin\/igrejas/);
}
