import { randomUUID, randomBytes } from "node:crypto";
import { and, desc, eq, or, sql } from "drizzle-orm";
import { calcularTaxaProcessamento } from "../comissao";
import { slugify } from "../slug";
import { hashSenha, verificarSenha } from "../auth/senha";
import { db } from "./client";
import * as schema from "./schema";
import type {
  CartaoSalvo,
  Campanha,
  ComunicadoMural,
  ConviteWebmaster,
  Contribuicao,
  Evento,
  Fiel,
  Igreja,
  LinkExtra,
  LinkPagamento,
  MembroWebmasterListagem,
  NotificacaoFiel,
  UsuarioIgreja,
  Webmaster,
} from "../types";

// Camada de dados real, sobre Drizzle/SQLite (libsql) — substitui o antigo
// mock-db.ts em memória. Mesmas assinaturas de função de antes, agora
// assíncronas, pra bater com qualquer chamada de banco.

function hoje(): string {
  return new Date().toISOString().slice(0, 10);
}

function gerarId(prefixo: string): string {
  return `${prefixo}-${randomUUID().replace(/-/g, "").slice(0, 10)}`;
}

function normalizarTelefone(telefone: string): string {
  return telefone.replace(/\D/g, "");
}

function rowParaFiel(row: typeof schema.fieis.$inferSelect): Fiel {
  return {
    id: row.id,
    igrejaId: row.igrejaId,
    nome: row.nome,
    telefone: row.telefone,
    criadoEm: row.criadoEm,
    cartaoSalvo: row.cartaoBandeira
      ? {
          bandeira: row.cartaoBandeira,
          ultimosDigitos: row.cartaoUltimosDigitos ?? "",
          tokenFake: row.cartaoTokenFake ?? "",
        }
      : undefined,
  };
}

// Colunas seguras de usuarios_igreja pra qualquer leitura que não seja
// autenticação — nunca inclui senha_hash, nem por engano.
const COLUNAS_USUARIO_IGREJA = {
  id: schema.usuariosIgreja.id,
  igrejaId: schema.usuariosIgreja.igrejaId,
  nome: schema.usuariosIgreja.nome,
  email: schema.usuariosIgreja.email,
  papel: schema.usuariosIgreja.papel,
};

// Junta cada linha de igreja com os próprios linksExtras — numa query só,
// mesmo pra várias igrejas de uma vez, pra nunca cair em N+1.
async function hidratarIgrejas(
  rows: (typeof schema.igrejas.$inferSelect)[],
): Promise<Igreja[]> {
  if (rows.length === 0) return [];
  const ids = rows.map((r) => r.id);
  const links = await db
    .select()
    .from(schema.linksExtras)
    .where(sql`${schema.linksExtras.igrejaId} in ${ids}`);
  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    nome: row.nome,
    cnpj: row.cnpj,
    responsavelNome: row.responsavelNome,
    responsavelEmail: row.responsavelEmail,
    responsavelWhatsapp: row.responsavelWhatsapp,
    cidade: row.cidade,
    uf: row.uf,
    logoEmoji: row.logoEmoji,
    fotoUrl: row.fotoUrl ?? undefined,
    linksExtras: links
      .filter((l) => l.igrejaId === row.id)
      .map((l): LinkExtra => ({ id: l.id, rotulo: l.rotulo, url: l.url })),
    statusOnboarding: row.statusOnboarding,
    chavePix: row.chavePix,
    criadaEm: row.criadaEm,
  }));
}

// --- Helpers de leitura ---

export async function getIgreja(igrejaId: string): Promise<Igreja | undefined> {
  const [row] = await db
    .select()
    .from(schema.igrejas)
    .where(eq(schema.igrejas.id, igrejaId));
  if (!row) return undefined;
  return (await hidratarIgrejas([row]))[0];
}

export async function getFiel(fielId: string): Promise<Fiel | undefined> {
  const [row] = await db
    .select()
    .from(schema.fieis)
    .where(eq(schema.fieis.id, fielId));
  return row ? rowParaFiel(row) : undefined;
}

export async function getFieisDaIgreja(igrejaId: string): Promise<Fiel[]> {
  const rows = await db
    .select()
    .from(schema.fieis)
    .where(eq(schema.fieis.igrejaId, igrejaId));
  return rows.map(rowParaFiel);
}

export async function getIgrejasAprovadas(): Promise<Igreja[]> {
  const rows = await db
    .select()
    .from(schema.igrejas)
    .where(eq(schema.igrejas.statusOnboarding, "aprovado"));
  return hidratarIgrejas(rows);
}

// Todas as igrejas, independente do status — usada pelo painel interno
// (superadmin) e pelo acesso master de testes.
export async function getTodasIgrejas(): Promise<Igreja[]> {
  const rows = await db.select().from(schema.igrejas);
  return hidratarIgrejas(rows);
}

export async function getTodosFieis(): Promise<Fiel[]> {
  const rows = await db.select().from(schema.fieis);
  return rows.map(rowParaFiel);
}

export async function getTodosUsuariosIgreja(): Promise<UsuarioIgreja[]> {
  return db.select(COLUNAS_USUARIO_IGREJA).from(schema.usuariosIgreja);
}

export async function getUsuarioIgrejaPorId(
  usuarioId: string,
): Promise<UsuarioIgreja | undefined> {
  const [row] = await db
    .select(COLUNAS_USUARIO_IGREJA)
    .from(schema.usuariosIgreja)
    .where(eq(schema.usuariosIgreja.id, usuarioId));
  return row;
}

// `igrejaId`, quando informado, restringe a busca ao link daquela igreja —
// obrigatório em qualquer contexto autenticado (painel da igreja), pra não
// permitir acesso a link de outra igreja via id manipulado na URL. Omitido
// nos fluxos públicos de doação (/doar/link/[id]), onde o próprio id já
// funciona como capability pública por design.
export async function getLinkPagamento(
  linkId: string,
  igrejaId?: string,
): Promise<LinkPagamento | undefined> {
  const [row] = await db
    .select()
    .from(schema.linksPagamento)
    .where(
      igrejaId
        ? and(
            eq(schema.linksPagamento.id, linkId),
            eq(schema.linksPagamento.igrejaId, igrejaId),
          )
        : eq(schema.linksPagamento.id, linkId),
    );
  return row;
}

export async function getIgrejaPorSlug(
  slug: string,
): Promise<Igreja | undefined> {
  const [row] = await db
    .select()
    .from(schema.igrejas)
    .where(eq(schema.igrejas.slug, slug));
  if (!row) return undefined;
  return (await hidratarIgrejas([row]))[0];
}

// Busca leve por nome — usada no cadastro de fiel quando ele não chega por
// um link/QR code específico da igreja.
export async function buscarIgrejasAprovadas(
  consulta: string,
  limite = 8,
): Promise<Igreja[]> {
  const termo = consulta.trim().toLowerCase();
  if (!termo) return [];
  const padrao = `%${termo}%`;
  const rows = await db
    .select()
    .from(schema.igrejas)
    .where(
      and(
        eq(schema.igrejas.statusOnboarding, "aprovado"),
        or(
          sql`lower(${schema.igrejas.nome}) like ${padrao}`,
          sql`lower(${schema.igrejas.cidade}) like ${padrao}`,
        ),
      ),
    )
    .limit(limite);
  return hidratarIgrejas(rows);
}

// Login do fiel é por telefone — tabela ainda pequena o bastante pra
// normalizar em memória; numa base grande isso viraria uma coluna indexada.
export async function getFielPorTelefone(
  telefone: string,
): Promise<Fiel | undefined> {
  const alvo = normalizarTelefone(telefone);
  if (!alvo) return undefined;
  const rows = await db.select().from(schema.fieis);
  const encontrado = rows.find((f) => normalizarTelefone(f.telefone) === alvo);
  return encontrado ? rowParaFiel(encontrado) : undefined;
}

// Doação via link avulso não exige cadastro prévio — criamos um registro
// leve de fiel "convidado" para manter o histórico consistente.
export async function criarFielConvidado(
  igrejaId: string,
  nome: string,
): Promise<Fiel> {
  const [row] = await db
    .insert(schema.fieis)
    .values({
      id: gerarId("fiel-convidado"),
      igrejaId,
      nome: nome || "Doador",
      telefone: "—",
      criadoEm: hoje(),
    })
    .returning();
  return rowParaFiel(row);
}

export async function getLinksDaIgreja(
  igrejaId: string,
): Promise<LinkPagamento[]> {
  return db
    .select()
    .from(schema.linksPagamento)
    .where(eq(schema.linksPagamento.igrejaId, igrejaId));
}

// Mais nova primeiro — a campanha recém-criada é a que deve aparecer em
// destaque, tanto pra igreja gerenciar quanto pro fiel ver.
export async function getCampanhasDaIgreja(
  igrejaId: string,
): Promise<Campanha[]> {
  return db
    .select()
    .from(schema.campanhas)
    .where(eq(schema.campanhas.igrejaId, igrejaId))
    .orderBy(desc(schema.campanhas.criadaEm));
}

// `igrejaId`, quando informado, restringe a busca à campanha daquela igreja
// — obrigatório em qualquer contexto autenticado (painel da igreja, seleção
// de campanha pelo fiel logado), pra não permitir acesso/uso de campanha de
// outra igreja via id manipulado. Omitido nos fluxos públicos de doação
// (/doar/campanha/[id]), onde o próprio id já funciona como capability
// pública por design.
export async function getCampanha(
  campanhaId: string,
  igrejaId?: string,
): Promise<Campanha | undefined> {
  const [row] = await db
    .select()
    .from(schema.campanhas)
    .where(
      igrejaId
        ? and(
            eq(schema.campanhas.id, campanhaId),
            eq(schema.campanhas.igrejaId, igrejaId),
          )
        : eq(schema.campanhas.id, campanhaId),
    );
  return row;
}

export async function getEventosDaIgreja(igrejaId: string): Promise<Evento[]> {
  return db
    .select()
    .from(schema.eventos)
    .where(eq(schema.eventos.igrejaId, igrejaId));
}

export async function criarComunicado(input: {
  igrejaId: string;
  titulo: string;
  corpo: string;
  emoji: string;
}): Promise<ComunicadoMural> {
  const [row] = await db
    .insert(schema.comunicadosMural)
    .values({
      id: gerarId("comunicado"),
      igrejaId: input.igrejaId,
      titulo: input.titulo,
      corpo: input.corpo,
      emoji: input.emoji,
      publicadoEm: hoje(),
    })
    .returning();
  return row;
}

export async function getMuralDaIgreja(
  igrejaId: string,
): Promise<ComunicadoMural[]> {
  return db
    .select()
    .from(schema.comunicadosMural)
    .where(eq(schema.comunicadosMural.igrejaId, igrejaId))
    .orderBy(desc(schema.comunicadosMural.publicadoEm));
}

export async function getContribuicoesDaIgreja(
  igrejaId: string,
): Promise<Contribuicao[]> {
  return db
    .select()
    .from(schema.contribuicoes)
    .where(eq(schema.contribuicoes.igrejaId, igrejaId));
}

export async function getContribuicao(
  contribuicaoId: string,
): Promise<Contribuicao | undefined> {
  const [row] = await db
    .select()
    .from(schema.contribuicoes)
    .where(eq(schema.contribuicoes.id, contribuicaoId));
  return row;
}

export async function getContribuicoesDoFiel(
  fielId: string,
): Promise<Contribuicao[]> {
  return db
    .select()
    .from(schema.contribuicoes)
    .where(eq(schema.contribuicoes.fielId, fielId))
    .orderBy(desc(schema.contribuicoes.criadaEm));
}

// Só conta Pix já confirmado pelo fiel — enquanto ele não volta pra confirmar
// que pagou, esse valor ainda não foi de fato recebido pela igreja.
export async function getArrecadadoCampanha(
  campanhaId: string,
): Promise<number> {
  const rows = await db
    .select({ valorBruto: schema.contribuicoes.valorBruto })
    .from(schema.contribuicoes)
    .where(
      and(
        eq(schema.contribuicoes.campanhaId, campanhaId),
        eq(schema.contribuicoes.status, "confirmado"),
      ),
    );
  return rows.reduce((soma, r) => soma + r.valorBruto, 0);
}

export async function getUsuariosDaIgreja(
  igrejaId: string,
): Promise<UsuarioIgreja[]> {
  return db
    .select(COLUNAS_USUARIO_IGREJA)
    .from(schema.usuariosIgreja)
    .where(eq(schema.usuariosIgreja.igrejaId, igrejaId));
}

export async function getUsuarioIgrejaPorEmail(
  email: string,
): Promise<UsuarioIgreja | undefined> {
  const alvo = email.trim().toLowerCase();
  const [row] = await db
    .select(COLUNAS_USUARIO_IGREJA)
    .from(schema.usuariosIgreja)
    .where(sql`lower(${schema.usuariosIgreja.email}) = ${alvo}`);
  return row;
}

// Confere e-mail + senha. Só essa função (e o cadastro) toca em senha_hash —
// todo o resto do app usa os getters acima, que nunca selecionam a coluna.
export async function autenticarIgreja(
  email: string,
  senha: string,
): Promise<UsuarioIgreja | null> {
  const alvo = email.trim().toLowerCase();
  const [row] = await db
    .select()
    .from(schema.usuariosIgreja)
    .where(sql`lower(${schema.usuariosIgreja.email}) = ${alvo}`);
  if (!row) return null;

  const ok = await verificarSenha(senha, row.senhaHash);
  if (!ok) return null;

  return {
    id: row.id,
    igrejaId: row.igrejaId,
    nome: row.nome,
    email: row.email,
    papel: row.papel,
  };
}

// Idem para o fiel, por telefone — mesmo esquema "salt:hash" via scrypt.
export async function autenticarFiel(
  telefone: string,
  senha: string,
): Promise<Fiel | null> {
  const alvo = normalizarTelefone(telefone);
  if (!alvo) return null;
  const rows = await db.select().from(schema.fieis);
  const row = rows.find((f) => normalizarTelefone(f.telefone) === alvo);
  if (!row || !row.senhaHash) return null;

  const ok = await verificarSenha(senha, row.senhaHash);
  if (!ok) return null;

  return rowParaFiel(row);
}

export async function getNotificacoesDoFiel(
  fielId: string,
): Promise<NotificacaoFiel[]> {
  return db
    .select()
    .from(schema.notificacoesFiel)
    .where(eq(schema.notificacoesFiel.fielId, fielId))
    .orderBy(desc(schema.notificacoesFiel.criadaEm));
}

// --- Helpers de escrita ---

// Passo 1 do fluxo real: o fiel escolheu o valor, mas ainda não pagou nada.
// Criamos o registro como "aguardando_pix" — a igreja só aparece como tendo
// recebido depois que o fiel volta e confirma que pagou (ver
// confirmarContribuicao). Nenhuma cobrança acontece aqui.
export async function iniciarContribuicao(input: {
  fielId: string;
  igrejaId: string;
  tipo: Contribuicao["tipo"];
  campanhaId: string | null;
  valorBruto: number;
}): Promise<Contribuicao> {
  const taxa = calcularTaxaProcessamento(input.tipo, input.valorBruto);
  const fiel = await getFiel(input.fielId);

  const [row] = await db
    .insert(schema.contribuicoes)
    .values({
      id: gerarId("contrib"),
      igrejaId: input.igrejaId,
      fielId: input.fielId,
      tipo: input.tipo,
      campanhaId: input.campanhaId,
      meio: "pix",
      valorBruto: input.valorBruto,
      taxaPercentual: taxa.taxaPercentual,
      taxaValor: taxa.taxaValor,
      valorTotalFiel: taxa.valorTotalFiel,
      taxaCobradaVia: fiel?.cartaoSalvo ? "cartao_salvo" : "pix_separado",
      status: "aguardando_pix",
      criadaEm: hoje(),
    })
    .returning();
  return row;
}

// Passo 2: o fiel confirma que já pagou o Pix pra chave da igreja. É esse
// clique — não um webhook bancário — que dispara a cobrança da taxa de
// processamento no cartão salvo (ou como Pix separado, se não tiver cartão).
// `fielIdEsperado`, quando informado, exige que a contribuição pertença a
// esse fiel — obrigatório no fluxo autenticado (/fiel/doar/pagar/[id]), pra
// impedir que uma sessão de fiel confirme (e dispare cobrança de taxa em
// cima de) uma contribuição alheia via id manipulado. Omitido no fluxo
// público de convidado (/doar/pagar/[id]), que não tem sessão pra comparar
// — lá o id da contribuição (10 hex chars aleatórios, gerado em gerarId)
// já funciona como capability, mesmo padrão do link/campanha públicos.
export async function confirmarContribuicao(
  contribuicaoId: string,
  fielIdEsperado?: string,
): Promise<Contribuicao | undefined> {
  const [row] = await db
    .update(schema.contribuicoes)
    .set({ status: "confirmado" })
    .where(
      fielIdEsperado
        ? and(
            eq(schema.contribuicoes.id, contribuicaoId),
            eq(schema.contribuicoes.fielId, fielIdEsperado),
          )
        : eq(schema.contribuicoes.id, contribuicaoId),
    )
    .returning();
  return row;
}

export async function salvarCartaoFiel(
  fielId: string,
  cartao: CartaoSalvo,
): Promise<void> {
  await db
    .update(schema.fieis)
    .set({
      cartaoBandeira: cartao.bandeira,
      cartaoUltimosDigitos: cartao.ultimosDigitos,
      cartaoTokenFake: cartao.tokenFake,
    })
    .where(eq(schema.fieis.id, fielId));
}

export async function criarLinkPagamento(input: {
  igrejaId: string;
  titulo: string;
  tipo: LinkPagamento["tipo"];
  valorSugerido: number | null;
}): Promise<LinkPagamento> {
  const [row] = await db
    .insert(schema.linksPagamento)
    .values({
      id: gerarId("link"),
      igrejaId: input.igrejaId,
      titulo: input.titulo,
      tipo: input.tipo,
      valorSugerido: input.valorSugerido,
      ativo: true,
      criadoEm: hoje(),
    })
    .returning();
  return row;
}

export async function criarCampanha(input: {
  igrejaId: string;
  titulo: string;
  descricao: string;
  meta: number;
  prazo: string;
  imagemEmoji: string;
}): Promise<Campanha> {
  const [row] = await db
    .insert(schema.campanhas)
    .values({
      id: gerarId("campanha"),
      igrejaId: input.igrejaId,
      titulo: input.titulo,
      descricao: input.descricao,
      meta: input.meta,
      prazo: input.prazo,
      imagemEmoji: input.imagemEmoji || "🙏",
      encerrada: false,
      criadaEm: hoje(),
    })
    .returning();
  return row;
}

export async function atualizarCampanha(
  campanhaId: string,
  igrejaId: string,
  input: {
    titulo: string;
    descricao: string;
    meta: number;
    prazo: string;
    imagemEmoji: string;
  },
): Promise<Campanha | undefined> {
  const [row] = await db
    .update(schema.campanhas)
    .set({
      titulo: input.titulo,
      descricao: input.descricao,
      meta: input.meta,
      prazo: input.prazo,
      imagemEmoji: input.imagemEmoji || "🙏",
    })
    .where(
      and(
        eq(schema.campanhas.id, campanhaId),
        eq(schema.campanhas.igrejaId, igrejaId),
      ),
    )
    .returning();
  return row;
}

export async function alternarEncerramentoCampanha(
  campanhaId: string,
  igrejaId: string,
  encerrada: boolean,
): Promise<void> {
  await db
    .update(schema.campanhas)
    .set({ encerrada })
    .where(
      and(
        eq(schema.campanhas.id, campanhaId),
        eq(schema.campanhas.igrejaId, igrejaId),
      ),
    );
}

// Apagar de verdade é seguro no banco (contribuicoes.campanhaId vira NULL via
// onDelete: "set null" — o histórico de doações não some, só perde o vínculo
// com a campanha). Ainda assim, escopado à própria igreja.
export async function removerCampanha(
  campanhaId: string,
  igrejaId: string,
): Promise<void> {
  await db
    .delete(schema.campanhas)
    .where(
      and(
        eq(schema.campanhas.id, campanhaId),
        eq(schema.campanhas.igrejaId, igrejaId),
      ),
    );
}

export async function criarEvento(input: {
  igrejaId: string;
  titulo: string;
  data: string;
  local: string;
  descricao: string;
  arrecadacaoVinculada: boolean;
}): Promise<Evento> {
  const [row] = await db
    .insert(schema.eventos)
    .values({
      id: gerarId("evento"),
      igrejaId: input.igrejaId,
      titulo: input.titulo,
      data: input.data,
      local: input.local,
      descricao: input.descricao,
      arrecadacaoVinculada: input.arrecadacaoVinculada,
    })
    .returning();
  return row;
}

// Autoatendimento: igreja se cadastra e entra em análise (ver seção 12 do PRD
// — KYC antes de habilitar recebimento). Fica bloqueada até um superadmin aprovar.
async function gerarSlugUnico(nome: string): Promise<string> {
  const base = slugify(nome);
  let slug = base;
  let sufixo = 2;
  // eslint-disable-next-line no-constant-condition -- só sai quando encontra um slug livre
  while (true) {
    const [existe] = await db
      .select({ id: schema.igrejas.id })
      .from(schema.igrejas)
      .where(eq(schema.igrejas.slug, slug));
    if (!existe) return slug;
    slug = `${base}-${sufixo++}`;
  }
}

export async function criarIgreja(input: {
  nome: string;
  cnpj: string;
  responsavelNome: string;
  responsavelEmail: string;
  responsavelWhatsapp: string;
  cidade: string;
  uf: string;
  chavePix: string;
}): Promise<Igreja> {
  const slug = await gerarSlugUnico(input.nome);
  const [row] = await db
    .insert(schema.igrejas)
    .values({
      id: gerarId("igreja"),
      slug,
      nome: input.nome,
      cnpj: input.cnpj,
      responsavelNome: input.responsavelNome,
      responsavelEmail: input.responsavelEmail,
      responsavelWhatsapp: input.responsavelWhatsapp,
      cidade: input.cidade,
      uf: input.uf,
      logoEmoji: "⛪",
      statusOnboarding: "em_analise",
      chavePix: input.chavePix,
      criadaEm: hoje(),
    })
    .returning();
  return { ...row, fotoUrl: row.fotoUrl ?? undefined, linksExtras: [] };
}

export async function criarUsuarioIgreja(input: {
  igrejaId: string;
  nome: string;
  email: string;
  senha: string;
  papel: UsuarioIgreja["papel"];
}): Promise<UsuarioIgreja> {
  const senhaHash = await hashSenha(input.senha);
  const [row] = await db
    .insert(schema.usuariosIgreja)
    .values({
      id: gerarId("user-igreja"),
      igrejaId: input.igrejaId,
      nome: input.nome,
      email: input.email,
      senhaHash,
      papel: input.papel,
    })
    .returning(COLUNAS_USUARIO_IGREJA);
  return row;
}

export async function atualizarStatusIgreja(
  igrejaId: string,
  status: Igreja["statusOnboarding"],
): Promise<void> {
  await db
    .update(schema.igrejas)
    .set({ statusOnboarding: status })
    .where(eq(schema.igrejas.id, igrejaId));
}

// Dados cadastrais que a própria igreja pode alterar depois, na área de
// perfil — nunca o slug nem o status de aprovação, que são controlados à
// parte (URL pública e aprovação do superadmin).
export async function atualizarPerfilIgreja(
  igrejaId: string,
  input: {
    nome: string;
    cnpj: string;
    responsavelNome: string;
    responsavelEmail: string;
    responsavelWhatsapp: string;
    cidade: string;
    uf: string;
    chavePix: string;
    fotoUrl?: string;
  },
): Promise<Igreja | undefined> {
  const [row] = await db
    .update(schema.igrejas)
    .set({
      nome: input.nome,
      cnpj: input.cnpj,
      responsavelNome: input.responsavelNome,
      responsavelEmail: input.responsavelEmail,
      responsavelWhatsapp: input.responsavelWhatsapp,
      cidade: input.cidade,
      uf: input.uf,
      chavePix: input.chavePix,
      fotoUrl: input.fotoUrl ?? null,
    })
    .where(eq(schema.igrejas.id, igrejaId))
    .returning();
  if (!row) return undefined;
  return (await hidratarIgrejas([row]))[0];
}

export async function adicionarLinkExtra(
  igrejaId: string,
  input: { rotulo: string; url: string },
): Promise<LinkExtra | undefined> {
  const igreja = await getIgreja(igrejaId);
  if (!igreja) return undefined;
  const [row] = await db
    .insert(schema.linksExtras)
    .values({
      id: gerarId("link-extra"),
      igrejaId,
      rotulo: input.rotulo,
      url: input.url,
    })
    .returning();
  return { id: row.id, rotulo: row.rotulo, url: row.url };
}

export async function removerLinkExtra(
  igrejaId: string,
  linkExtraId: string,
): Promise<void> {
  await db
    .delete(schema.linksExtras)
    .where(
      and(
        eq(schema.linksExtras.id, linkExtraId),
        eq(schema.linksExtras.igrejaId, igrejaId),
      ),
    );
}

export async function criarFiel(input: {
  igrejaId: string;
  nome: string;
  telefone: string;
  senha: string;
}): Promise<Fiel> {
  const senhaHash = await hashSenha(input.senha);
  const [row] = await db
    .insert(schema.fieis)
    .values({
      id: gerarId("fiel"),
      igrejaId: input.igrejaId,
      nome: input.nome,
      telefone: input.telefone,
      senhaHash,
      criadoEm: hoje(),
    })
    .returning();
  return rowParaFiel(row);
}

export async function criarNotificacao(input: {
  fielId: string;
  igrejaId: string;
  tipo: NotificacaoFiel["tipo"];
  titulo: string;
  corpo: string;
}): Promise<NotificacaoFiel> {
  const [row] = await db
    .insert(schema.notificacoesFiel)
    .values({
      id: gerarId("notif"),
      fielId: input.fielId,
      igrejaId: input.igrejaId,
      tipo: input.tipo,
      titulo: input.titulo,
      corpo: input.corpo,
      lida: false,
      criadaEm: hoje(),
    })
    .returning();
  return row;
}

export async function notificarFieisDaIgreja(
  igrejaId: string,
  input: { tipo: NotificacaoFiel["tipo"]; titulo: string; corpo: string },
): Promise<void> {
  const fieisDaIgreja = await getFieisDaIgreja(igrejaId);
  if (fieisDaIgreja.length === 0) return;
  await db.insert(schema.notificacoesFiel).values(
    fieisDaIgreja.map((f) => ({
      id: gerarId("notif"),
      fielId: f.id,
      igrejaId,
      tipo: input.tipo,
      titulo: input.titulo,
      corpo: input.corpo,
      lida: false,
      criadaEm: hoje(),
    })),
  );
}

// Escopado ao próprio fiel — sem isso, qualquer sessão de fiel autenticada
// conseguiria marcar como lida a notificação de outra pessoa (de qualquer
// igreja) só sabendo/adivinhando o id.
export async function marcarNotificacaoLida(
  notificacaoId: string,
  fielId: string,
): Promise<void> {
  await db
    .update(schema.notificacoesFiel)
    .set({ lida: true })
    .where(
      and(
        eq(schema.notificacoesFiel.id, notificacaoId),
        eq(schema.notificacoesFiel.fielId, fielId),
      ),
    );
}

// --- Equipe interna (WebMaster) ---------------------------------------

function rowParaWebmaster(
  row: typeof schema.webmasters.$inferSelect,
): Webmaster {
  return {
    id: row.id,
    nome: row.nome,
    email: row.email,
    nivel: row.nivel,
    podeGerenciarPagamentos: row.podeGerenciarPagamentos,
    podeAprovarIgrejas: row.podeAprovarIgrejas,
    criadoEm: row.criadoEm,
  };
}

const DURACAO_CONVITE_DIAS = 7;

function gerarTokenConvite(): string {
  return randomBytes(24).toString("base64url");
}

export async function existeWebmaster(): Promise<boolean> {
  const [row] = await db
    .select({ id: schema.webmasters.id })
    .from(schema.webmasters)
    .limit(1);
  return !!row;
}

// Bootstrap: cria o Master Primário — só funciona a primeira vez (nenhum
// webmaster ainda cadastrado). Depois disso, novas contas só entram por
// convite do Master Primário.
export async function criarWebmasterPrimario(input: {
  nome: string;
  email: string;
  senha: string;
}): Promise<Webmaster | null> {
  if (await existeWebmaster()) return null;
  const senhaHash = await hashSenha(input.senha);
  const [row] = await db
    .insert(schema.webmasters)
    .values({
      id: gerarId("webmaster"),
      nome: input.nome,
      email: input.email.trim().toLowerCase(),
      senhaHash,
      nivel: "primario",
      podeGerenciarPagamentos: true,
      podeAprovarIgrejas: true,
      criadoEm: hoje(),
    })
    .returning();
  return rowParaWebmaster(row);
}

// Só o Master Primário chama isso (a checagem de quem pode convidar fica na
// action/página que envolve a autorização de sessão).
export async function gerarConviteWebmaster(input: {
  nome: string;
  email: string;
  podeGerenciarPagamentos: boolean;
  podeAprovarIgrejas: boolean;
  convidadoPorId: string;
}): Promise<ConviteWebmaster> {
  const expira = new Date();
  expira.setDate(expira.getDate() + DURACAO_CONVITE_DIAS);
  const [row] = await db
    .insert(schema.webmasters)
    .values({
      id: gerarId("webmaster"),
      nome: input.nome,
      email: input.email.trim().toLowerCase(),
      nivel: "secundario",
      podeGerenciarPagamentos: input.podeGerenciarPagamentos,
      podeAprovarIgrejas: input.podeAprovarIgrejas,
      conviteToken: gerarTokenConvite(),
      conviteExpiraEm: expira.toISOString(),
      convidadoPorId: input.convidadoPorId,
      criadoEm: hoje(),
    })
    .returning();
  return {
    id: row.id,
    nome: row.nome,
    email: row.email,
    nivel: row.nivel,
    podeGerenciarPagamentos: row.podeGerenciarPagamentos,
    podeAprovarIgrejas: row.podeAprovarIgrejas,
    conviteToken: row.conviteToken!,
    conviteExpiraEm: row.conviteExpiraEm!,
  };
}

export async function getConviteWebmasterPorToken(
  token: string,
): Promise<ConviteWebmaster | undefined> {
  const [row] = await db
    .select()
    .from(schema.webmasters)
    .where(eq(schema.webmasters.conviteToken, token));
  if (!row || !row.conviteToken || !row.conviteExpiraEm) return undefined;
  if (new Date(row.conviteExpiraEm).getTime() < Date.now()) return undefined;
  return {
    id: row.id,
    nome: row.nome,
    email: row.email,
    nivel: row.nivel,
    podeGerenciarPagamentos: row.podeGerenciarPagamentos,
    podeAprovarIgrejas: row.podeAprovarIgrejas,
    conviteToken: row.conviteToken,
    conviteExpiraEm: row.conviteExpiraEm,
  };
}

export async function aceitarConviteWebmaster(
  token: string,
  senha: string,
): Promise<Webmaster | null> {
  const convite = await getConviteWebmasterPorToken(token);
  if (!convite) return null;
  const senhaHash = await hashSenha(senha);
  const [row] = await db
    .update(schema.webmasters)
    .set({ senhaHash, conviteToken: null, conviteExpiraEm: null })
    .where(eq(schema.webmasters.id, convite.id))
    .returning();
  return rowParaWebmaster(row);
}

export async function autenticarWebmaster(
  email: string,
  senha: string,
): Promise<Webmaster | null> {
  const alvo = email.trim().toLowerCase();
  const [row] = await db
    .select()
    .from(schema.webmasters)
    .where(sql`lower(${schema.webmasters.email}) = ${alvo}`);
  if (!row || !row.senhaHash) return null;
  const ok = await verificarSenha(senha, row.senhaHash);
  if (!ok) return null;
  return rowParaWebmaster(row);
}

export async function getWebmasterPorId(
  id: string,
): Promise<Webmaster | undefined> {
  const [row] = await db
    .select()
    .from(schema.webmasters)
    .where(eq(schema.webmasters.id, id));
  return row ? rowParaWebmaster(row) : undefined;
}

export async function getTodosMembrosWebmaster(): Promise<
  MembroWebmasterListagem[]
> {
  const rows = await db
    .select()
    .from(schema.webmasters)
    .orderBy(schema.webmasters.criadoEm);
  return rows.map((row) => ({
    id: row.id,
    nome: row.nome,
    email: row.email,
    nivel: row.nivel,
    podeGerenciarPagamentos: row.podeGerenciarPagamentos,
    podeAprovarIgrejas: row.podeAprovarIgrejas,
    criadoEm: row.criadoEm,
    pendente: !row.senhaHash,
    conviteToken: row.senhaHash ? undefined : (row.conviteToken ?? undefined),
  }));
}

// Nunca mexe no nível nem no Master Primário — só o Primário chama isso, e
// só pra ajustar as permissões de um secundário.
export async function atualizarPermissoesWebmaster(
  id: string,
  input: { podeGerenciarPagamentos: boolean; podeAprovarIgrejas: boolean },
): Promise<void> {
  await db
    .update(schema.webmasters)
    .set({
      podeGerenciarPagamentos: input.podeGerenciarPagamentos,
      podeAprovarIgrejas: input.podeAprovarIgrejas,
    })
    .where(
      and(
        eq(schema.webmasters.id, id),
        eq(schema.webmasters.nivel, "secundario"),
      ),
    );
}

// Ação sensível gatilhada pela permissão podeGerenciarPagamentos — permite à
// equipe interna corrigir a chave Pix de uma igreja (ex.: suporte a pedido
// da própria igreja), sem que a igreja precise ter acesso ao próprio painel.
export async function atualizarChavePixIgreja(
  igrejaId: string,
  chavePix: string,
): Promise<void> {
  await db
    .update(schema.igrejas)
    .set({ chavePix })
    .where(eq(schema.igrejas.id, igrejaId));
}
