import { pgTable, text, real, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Schema completo do projeto — espelha 1:1 os tipos de src/lib/types.ts.
// Dialeto: PostgreSQL (via Neon, serverless-friendly).

export const igrejas = pgTable("igrejas", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nome: text("nome").notNull(),
  cnpj: text("cnpj").notNull(),
  responsavelNome: text("responsavel_nome").notNull(),
  responsavelEmail: text("responsavel_email").notNull(),
  responsavelWhatsapp: text("responsavel_whatsapp").notNull(),
  cidade: text("cidade").notNull(),
  uf: text("uf").notNull(),
  logoEmoji: text("logo_emoji").notNull().default("⛪"),
  // Foto de perfil exibida na página pública — sem valor, cai no emoji.
  fotoUrl: text("foto_url"),
  statusOnboarding: text("status_onboarding", {
    enum: ["pendente", "em_analise", "aprovado", "reprovado"],
  })
    .notNull()
    .default("em_analise"),
  // Chave Pix da própria igreja — o Dizipay nunca custodia esse valor.
  chavePix: text("chave_pix").notNull(),
  criadaEm: text("criada_em").notNull(),
});

export const usuariosIgreja = pgTable("usuarios_igreja", {
  id: text("id").primaryKey(),
  igrejaId: text("igreja_id")
    .notNull()
    .references(() => igrejas.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  email: text("email").notNull().unique(),
  // "salt:hash" via scrypt — ver src/lib/auth/senha.ts. Nunca exposto fora
  // das funções de autenticação em repo.ts.
  senhaHash: text("senha_hash").notNull(),
  papel: text("papel", { enum: ["administrador", "tesoureiro", "secretario"] }).notNull(),
});

export const fieis = pgTable("fieis", {
  id: text("id").primaryKey(),
  igrejaId: text("igreja_id")
    .notNull()
    .references(() => igrejas.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  telefone: text("telefone").notNull(),
  // Nula pra fiéis criados por doação avulsa (convidado, sem conta própria)
  // — esses nunca fazem login, só existem pra manter o histórico.
  senhaHash: text("senha_hash"),
  criadoEm: text("criado_em").notNull(),
  // Cartão salvo pra cobrança da taxa de processamento — tokenizado, nunca
  // guarda o número real do cartão.
  cartaoBandeira: text("cartao_bandeira"),
  cartaoUltimosDigitos: text("cartao_ultimos_digitos"),
  cartaoTokenFake: text("cartao_token_fake"),
});

export const linksPagamento = pgTable("links_pagamento", {
  id: text("id").primaryKey(),
  igrejaId: text("igreja_id")
    .notNull()
    .references(() => igrejas.id, { onDelete: "cascade" }),
  titulo: text("titulo").notNull(),
  tipo: text("tipo", { enum: ["dizimo", "oferta", "campanha", "evento", "livre"] }).notNull(),
  valorSugerido: real("valor_sugerido"),
  ativo: boolean("ativo").notNull().default(true),
  criadoEm: text("criado_em").notNull(),
});

export const campanhas = pgTable("campanhas", {
  id: text("id").primaryKey(),
  igrejaId: text("igreja_id")
    .notNull()
    .references(() => igrejas.id, { onDelete: "cascade" }),
  titulo: text("titulo").notNull(),
  descricao: text("descricao").notNull(),
  meta: real("meta").notNull(),
  prazo: text("prazo").notNull(),
  imagemEmoji: text("imagem_emoji").notNull().default("🙏"),
  encerrada: boolean("encerrada").notNull().default(false),
  criadaEm: text("criada_em").notNull(),
});

export const eventos = pgTable("eventos", {
  id: text("id").primaryKey(),
  igrejaId: text("igreja_id")
    .notNull()
    .references(() => igrejas.id, { onDelete: "cascade" }),
  titulo: text("titulo").notNull(),
  data: text("data").notNull(),
  local: text("local").notNull(),
  descricao: text("descricao").notNull(),
  arrecadacaoVinculada: boolean("arrecadacao_vinculada").notNull().default(false),
});

export const comunicadosMural = pgTable("comunicados_mural", {
  id: text("id").primaryKey(),
  igrejaId: text("igreja_id")
    .notNull()
    .references(() => igrejas.id, { onDelete: "cascade" }),
  titulo: text("titulo").notNull(),
  corpo: text("corpo").notNull(),
  emoji: text("emoji").notNull(),
  publicadoEm: text("publicado_em").notNull(),
});

// Status do Pix: aguardando_pix = fiel escolheu o valor mas ainda não
// confirmou o pagamento; confirmado = fiel confirmou e a taxa já foi
// cobrada. Ver src/lib/payments/gateway.ts pro fluxo completo.
export const contribuicoes = pgTable("contribuicoes", {
  id: text("id").primaryKey(),
  igrejaId: text("igreja_id")
    .notNull()
    .references(() => igrejas.id, { onDelete: "cascade" }),
  fielId: text("fiel_id")
    .notNull()
    .references(() => fieis.id, { onDelete: "cascade" }),
  tipo: text("tipo", { enum: ["dizimo", "oferta", "campanha", "evento", "livre"] }).notNull(),
  campanhaId: text("campanha_id").references(() => campanhas.id, { onDelete: "set null" }),
  meio: text("meio", { enum: ["pix", "cartao", "boleto"] }).notNull(),
  valorBruto: real("valor_bruto").notNull(),
  taxaPercentual: real("taxa_percentual").notNull(),
  taxaValor: real("taxa_valor").notNull(),
  valorTotalFiel: real("valor_total_fiel").notNull(),
  taxaCobradaVia: text("taxa_cobrada_via", { enum: ["cartao_salvo", "pix_separado"] }).notNull(),
  status: text("status", { enum: ["aguardando_pix", "confirmado"] })
    .notNull()
    .default("aguardando_pix"),
  criadaEm: text("criada_em").notNull(),
});

export const notificacoesFiel = pgTable("notificacoes_fiel", {
  id: text("id").primaryKey(),
  fielId: text("fiel_id")
    .notNull()
    .references(() => fieis.id, { onDelete: "cascade" }),
  igrejaId: text("igreja_id")
    .notNull()
    .references(() => igrejas.id, { onDelete: "cascade" }),
  tipo: text("tipo", { enum: ["lembrete_dizimo", "comunicado", "campanha"] }).notNull(),
  titulo: text("titulo").notNull(),
  corpo: text("corpo").notNull(),
  lida: boolean("lida").notNull().default(false),
  criadaEm: text("criada_em").notNull(),
});

// Links extras que a igreja escolhe mostrar na própria página pública —
// Instagram, site, uma campanha específica etc.
export const linksExtras = pgTable("links_extras", {
  id: text("id").primaryKey(),
  igrejaId: text("igreja_id")
    .notNull()
    .references(() => igrejas.id, { onDelete: "cascade" }),
  rotulo: text("rotulo").notNull(),
  url: text("url").notNull(),
});

export const igrejasRelations = relations(igrejas, ({ many }) => ({
  usuarios: many(usuariosIgreja),
  fieis: many(fieis),
  linksPagamento: many(linksPagamento),
  campanhas: many(campanhas),
  eventos: many(eventos),
  comunicadosMural: many(comunicadosMural),
  contribuicoes: many(contribuicoes),
  linksExtras: many(linksExtras),
}));

export const fieisRelations = relations(fieis, ({ one, many }) => ({
  igreja: one(igrejas, { fields: [fieis.igrejaId], references: [igrejas.id] }),
  contribuicoes: many(contribuicoes),
  notificacoes: many(notificacoesFiel),
}));

export const campanhasRelations = relations(campanhas, ({ one, many }) => ({
  igreja: one(igrejas, { fields: [campanhas.igrejaId], references: [igrejas.id] }),
  contribuicoes: many(contribuicoes),
}));

export const contribuicoesRelations = relations(contribuicoes, ({ one }) => ({
  igreja: one(igrejas, { fields: [contribuicoes.igrejaId], references: [igrejas.id] }),
  fiel: one(fieis, { fields: [contribuicoes.fielId], references: [fieis.id] }),
  campanha: one(campanhas, { fields: [contribuicoes.campanhaId], references: [campanhas.id] }),
}));
