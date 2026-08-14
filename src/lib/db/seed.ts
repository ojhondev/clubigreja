// Popula o banco Drizzle com os dados de demonstração de seed-data.ts,
// pra ter algo pra ver assim que o banco existe. Roda com `npm run db:seed`.
import { db } from "./client";
import * as schema from "./schema";
import { hashSenha } from "../auth/senha";
import {
  igrejas,
  usuariosIgreja,
  fieis,
  linksPagamento,
  campanhas,
  eventos,
  comunicadosMural,
  contribuicoes,
  notificacoes,
} from "./seed-data";

// Senha padrão de todas as contas de demonstração — só pra popular o banco
// local/preview, nunca usada em conta real.
const SENHA_DEMO = "dizipay123";

async function seed() {
  const senhaHashDemo = await hashSenha(SENHA_DEMO);
  await db.insert(schema.igrejas).values(
    igrejas.map((i) => ({
      id: i.id,
      slug: i.slug,
      nome: i.nome,
      cnpj: i.cnpj,
      responsavelNome: i.responsavelNome,
      responsavelEmail: i.responsavelEmail,
      responsavelWhatsapp: i.responsavelWhatsapp,
      cidade: i.cidade,
      uf: i.uf,
      logoEmoji: i.logoEmoji,
      fotoUrl: i.fotoUrl,
      statusOnboarding: i.statusOnboarding,
      chavePix: i.chavePix,
      criadaEm: i.criadaEm,
    })),
  );

  await db
    .insert(schema.usuariosIgreja)
    .values(usuariosIgreja.map((u) => ({ ...u, senhaHash: senhaHashDemo })));

  await db.insert(schema.fieis).values(
    fieis.map((f) => ({
      id: f.id,
      igrejaId: f.igrejaId,
      nome: f.nome,
      telefone: f.telefone,
      senhaHash: senhaHashDemo,
      criadoEm: f.criadoEm,
      cartaoBandeira: f.cartaoSalvo?.bandeira,
      cartaoUltimosDigitos: f.cartaoSalvo?.ultimosDigitos,
      cartaoTokenFake: f.cartaoSalvo?.tokenFake,
    })),
  );

  const linksExtras = igrejas.flatMap((i) =>
    i.linksExtras.map((l) => ({ ...l, igrejaId: i.id })),
  );
  if (linksExtras.length > 0)
    await db.insert(schema.linksExtras).values(linksExtras);

  await db.insert(schema.linksPagamento).values(linksPagamento);
  await db.insert(schema.campanhas).values(campanhas);
  await db.insert(schema.eventos).values(eventos);
  await db.insert(schema.comunicadosMural).values(comunicadosMural);
  await db.insert(schema.contribuicoes).values(contribuicoes);
  await db.insert(schema.notificacoesFiel).values(notificacoes);

  console.log("Banco populado com os dados de demonstração.");
}

seed()
  .then(() => process.exit(0))
  .catch((erro) => {
    console.error(erro);
    process.exit(1);
  });
