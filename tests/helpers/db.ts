// Acesso ao banco de teste — usado só pelo global-setup (reset + seed) e,
// pontualmente, por specs que precisam ler o estado direto do banco.
//
// SALVAGUARDA: lê exclusivamente TEST_DATABASE_URL, uma env var própria,
// nunca DATABASE_URL/POSTGRES_URL (as usadas pela aplicação em dev/produção).
// Isso é intencional — não existe fallback entre elas. Se TEST_DATABASE_URL
// não estiver setada, os testes que dependem de banco são pulados (ver
// tests/playwright/global-setup.ts), nunca redirecionados silenciosamente
// para o banco de dev/produção.
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql, eq } from "drizzle-orm";
import * as schema from "../../src/lib/db/schema";
import { hashSenha } from "../../src/lib/auth/senha";
import {
  churchA,
  churchB,
  adminA,
  adminB,
  campaignA,
  campaignB,
  linkA,
  linkB,
  fielA,
  fielB,
  donationA,
  donationB,
  donationPendenteA,
  donationPendenteA2,
  webmasterSecundario,
  SENHA_TESTE,
} from "../fixtures/test-data";

export function getTestDatabaseUrl(): string | undefined {
  return process.env.TEST_DATABASE_URL;
}

export function isTestDbConfigured(): boolean {
  return !!getTestDatabaseUrl();
}

function getTestDb() {
  const url = getTestDatabaseUrl();
  if (!url) {
    throw new Error(
      "TEST_DATABASE_URL não configurada. Ver docs/TESTING.md — seção " +
        "'Ambiente de teste' — antes de chamar qualquer função de tests/helpers/db.ts.",
    );
  }
  const client = neon(url);
  return drizzle(client, { schema });
}

// Todas as tabelas do schema, em qualquer ordem — TRUNCATE ... CASCADE
// resolve dependência de FK sozinho, ao contrário de DELETE tabela por
// tabela (que exigiria ordem manual filho→pai).
const TODAS_AS_TABELAS = [
  "contribuicoes",
  "notificacoes_fiel",
  "links_extras",
  "comunicados_mural",
  "eventos",
  "campanhas",
  "links_pagamento",
  "fieis",
  "usuarios_igreja",
  "webmasters",
  "igrejas",
] as const;

async function limparBancoDeTeste() {
  const db = getTestDb();
  await db.execute(
    sql.raw(`TRUNCATE TABLE ${TODAS_AS_TABELAS.join(", ")} CASCADE;`),
  );
}

// Semente mínima e determinística pra suíte baseline: 2 igrejas, 2 admins,
// 2 fiéis, 2 campanhas, 2 links de pagamento, 2 contribuições confirmadas,
// 1 webmaster secundário sem permissões — o suficiente pros testes de
// login, criação de campanha, página pública, relatório/dashboard,
// isolamento multi-tenant e autorização de impersonação.
// Master Primário não é seedado aqui — o teste que precisa dele cria via
// fluxo real de bootstrap da aplicação (ver tests/e2e/webmaster).
export async function resetAndSeedTestDb() {
  await limparBancoDeTeste();
  const db = getTestDb();
  const senhaHash = await hashSenha(SENHA_TESTE);

  await db.insert(schema.igrejas).values([churchA, churchB]);
  await db.insert(schema.usuariosIgreja).values([
    { ...adminA, senhaHash },
    { ...adminB, senhaHash },
  ]);
  await db.insert(schema.fieis).values([
    { ...fielA, senhaHash },
    { ...fielB, senhaHash },
  ]);
  await db.insert(schema.campanhas).values([campaignA, campaignB]);
  await db.insert(schema.linksPagamento).values([linkA, linkB]);
  await db
    .insert(schema.contribuicoes)
    .values([donationA, donationB, donationPendenteA, donationPendenteA2]);
  await db.insert(schema.webmasters).values({
    ...webmasterSecundario,
    senhaHash,
  });
}

// Leitura direta de status — usada pra confirmar que uma tentativa de
// confirmação não autorizada (C2) realmente não mudou nada no banco, em vez
// de inferir isso só pelo comportamento da UI (que hoje é um throw genérico
// sem página de erro dedicada — ver src/app/fiel/doar/pagar/[id]/actions.ts).
export async function getContribuicaoStatusTeste(
  contribuicaoId: string,
): Promise<string | undefined> {
  const db = getTestDb();
  const [row] = await db
    .select({ status: schema.contribuicoes.status })
    .from(schema.contribuicoes)
    .where(eq(schema.contribuicoes.id, contribuicaoId));
  return row?.status;
}
