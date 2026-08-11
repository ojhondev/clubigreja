import { calcularTaxaProcessamento } from "./comissao";
import { slugify } from "./slug";
import type {
  CartaoSalvo,
  Campanha,
  ComunicadoMural,
  Contribuicao,
  Evento,
  Fiel,
  Igreja,
  LinkPagamento,
  NotificacaoFiel,
  UsuarioIgreja,
} from "./types";

// Camada de dados 100% mockada, em memória — sem banco externo.
// Toda leitura/escrita passa pelas funções abaixo para que, no futuro,
// baste trocar a implementação interna por Supabase/Postgres real.

export const igrejas: Igreja[] = [
  {
    id: "igreja-1",
    slug: "novavida",
    nome: "Igreja Batista Nova Vida",
    cnpj: "12.345.678/0001-90",
    responsavelNome: "Pr. José Andrade",
    responsavelEmail: "pastor.jose@novavida.org.br",
    cidade: "Campinas",
    uf: "SP",
    logoEmoji: "⛪",
    statusOnboarding: "aprovado",
    chavePix: "financeiro@novavida.org.br",
    criadaEm: "2026-05-10",
  },
];

export const usuariosIgreja: UsuarioIgreja[] = [
  {
    id: "user-igreja-1",
    igrejaId: "igreja-1",
    nome: "Pr. José Andrade",
    email: "pastor.jose@novavida.org.br",
    papel: "administrador",
  },
  {
    id: "user-igreja-2",
    igrejaId: "igreja-1",
    nome: "Maria Silva",
    email: "maria.tesouraria@novavida.org.br",
    papel: "tesoureiro",
  },
];

export const fieis: Fiel[] = [
  {
    id: "fiel-1",
    igrejaId: "igreja-1",
    nome: "Ana Beatriz Souza",
    telefone: "(19) 99111-2233",
    criadoEm: "2026-05-12",
    cartaoSalvo: { bandeira: "Visa", ultimosDigitos: "4242", tokenFake: "tok_fake_ana" },
  },
  { id: "fiel-2", igrejaId: "igreja-1", nome: "Carlos Eduardo Lima", telefone: "(19) 99222-3344", criadoEm: "2026-05-15" },
  {
    id: "fiel-3",
    igrejaId: "igreja-1",
    nome: "Beatriz Ramos",
    telefone: "(19) 99333-4455",
    criadoEm: "2026-06-01",
    cartaoSalvo: { bandeira: "Mastercard", ultimosDigitos: "8821", tokenFake: "tok_fake_beatriz" },
  },
  {
    id: "fiel-4",
    igrejaId: "igreja-1",
    nome: "Roberto Nascimento",
    telefone: "(19) 99444-5566",
    criadoEm: "2026-06-20",
    cartaoSalvo: { bandeira: "Visa", ultimosDigitos: "1099", tokenFake: "tok_fake_roberto" },
  },
  { id: "fiel-5", igrejaId: "igreja-1", nome: "Lúcia Ferreira", telefone: "(19) 99555-6677", criadoEm: "2026-07-02" },
];

export const linksPagamento: LinkPagamento[] = [
  { id: "link-1", igrejaId: "igreja-1", titulo: "Dízimo mensal", tipo: "dizimo", valorSugerido: null, ativo: true, criadoEm: "2026-05-10" },
  { id: "link-2", igrejaId: "igreja-1", titulo: "Oferta de gratidão", tipo: "oferta", valorSugerido: 50, ativo: true, criadoEm: "2026-05-10" },
  { id: "link-3", igrejaId: "igreja-1", titulo: "Contribuição livre", tipo: "livre", valorSugerido: null, ativo: true, criadoEm: "2026-05-10" },
];

export const campanhas: Campanha[] = [
  {
    id: "campanha-1",
    igrejaId: "igreja-1",
    titulo: "Reforma do telhado do templo",
    descricao: "Reforma emergencial do telhado após as chuvas de junho — meta para concluir antes do fim do ano.",
    meta: 15000,
    prazo: "2026-10-15",
    imagemEmoji: "🔨",
    encerrada: false,
    criadaEm: "2026-06-05",
  },
  {
    id: "campanha-2",
    igrejaId: "igreja-1",
    titulo: "Missão Moçambique 2026",
    descricao: "Apoio à equipe missionária que parte em novembro para plantar uma nova congregação.",
    meta: 8000,
    prazo: "2026-11-01",
    imagemEmoji: "✈️",
    encerrada: false,
    criadaEm: "2026-07-01",
  },
];

export const eventos: Evento[] = [
  {
    id: "evento-1",
    igrejaId: "igreja-1",
    titulo: "Culto de Ação de Graças",
    data: "2026-08-30",
    local: "Templo sede — Campinas/SP",
    descricao: "Culto especial de gratidão pelo ano, com contribuição voluntária para as missões.",
    arrecadacaoVinculada: true,
  },
];

export const comunicadosMural: ComunicadoMural[] = [
  {
    id: "comunicado-1",
    igrejaId: "igreja-1",
    titulo: "Bem-vindo ao Club Igreja!",
    corpo: "Agora você pode acompanhar tudo por aqui: mural, campanhas e sua contribuição, tudo em um só lugar.",
    emoji: "👋",
    publicadoEm: "2026-07-20",
  },
  {
    id: "comunicado-2",
    igrejaId: "igreja-1",
    titulo: "Obrigado pela campanha do telhado!",
    corpo: "Já arrecadamos boa parte da meta graças à generosidade de vocês. Continue acompanhando o progresso.",
    emoji: "🙏",
    publicadoEm: "2026-07-28",
  },
  {
    id: "comunicado-3",
    igrejaId: "igreja-1",
    titulo: "Culto de Ação de Graças em agosto",
    corpo: "Separe a data: 30 de agosto teremos um culto especial de gratidão. Contribuição voluntária para as missões.",
    emoji: "📅",
    publicadoEm: "2026-08-02",
  },
];

export const contribuicoes: Contribuicao[] = seedContribuicoes();

export const notificacoes: NotificacaoFiel[] = [
  {
    id: "notif-1",
    fielId: "fiel-1",
    igrejaId: "igreja-1",
    tipo: "comunicado",
    titulo: "Novo comunicado no mural",
    corpo: "Culto de Ação de Graças em agosto — separe a data!",
    lida: false,
    criadaEm: "2026-08-02",
  },
];

function contribuicao(
  id: string,
  fielId: string,
  tipo: Contribuicao["tipo"],
  campanhaId: string | null,
  valorBruto: number,
  criadaEm: string
): Contribuicao {
  const taxa = calcularTaxaProcessamento(tipo, valorBruto);
  return {
    id,
    igrejaId: "igreja-1",
    fielId,
    tipo,
    campanhaId,
    meio: "pix",
    valorBruto,
    taxaPercentual: taxa.taxaPercentual,
    taxaValor: taxa.taxaValor,
    valorTotalFiel: taxa.valorTotalFiel,
    taxaCobradaVia: "cartao_salvo",
    status: "confirmado",
    criadaEm,
  };
}

function seedContribuicoes(): Contribuicao[] {
  return [
    // Ana: dízimo em dia (contribuiu este mês)
    contribuicao("contrib-1", "fiel-1", "dizimo", null, 300, "2026-06-04"),
    contribuicao("contrib-2", "fiel-1", "dizimo", null, 300, "2026-07-05"),
    contribuicao("contrib-3", "fiel-1", "dizimo", null, 320, "2026-08-03"),
    contribuicao("contrib-4", "fiel-1", "campanha", "campanha-1", 100, "2026-06-15"),

    // Carlos: parou de contribuir em junho — deve aparecer o lembrete
    contribuicao("contrib-5", "fiel-2", "dizimo", null, 250, "2026-06-10"),
    contribuicao("contrib-6", "fiel-2", "campanha", "campanha-1", 200, "2026-06-20"),

    // Beatriz: contribuiu em julho, ainda não em agosto — lembrete deve aparecer
    contribuicao("contrib-7", "fiel-3", "dizimo", null, 180, "2026-07-08"),
    contribuicao("contrib-8", "fiel-3", "oferta", null, 50, "2026-07-08"),

    // Roberto: dízimo recorrente em dia
    contribuicao("contrib-9", "fiel-4", "dizimo", null, 400, "2026-07-01"),
    contribuicao("contrib-10", "fiel-4", "dizimo", null, 400, "2026-08-01"),
    contribuicao("contrib-11", "fiel-4", "campanha", "campanha-2", 150, "2026-07-15"),

    // Lúcia: nunca contribuiu com dízimo ainda (só campanha) — lembrete deve aparecer
    contribuicao("contrib-12", "fiel-5", "campanha", "campanha-1", 80, "2026-07-10"),
  ];
}

// --- Helpers de leitura ---

export function getIgreja(igrejaId: string): Igreja | undefined {
  return igrejas.find((i) => i.id === igrejaId);
}

export function getFiel(fielId: string): Fiel | undefined {
  return fieis.find((f) => f.id === fielId);
}

export function getFieisDaIgreja(igrejaId: string): Fiel[] {
  return fieis.filter((f) => f.igrejaId === igrejaId);
}

export function getIgrejasAprovadas(): Igreja[] {
  return igrejas.filter((i) => i.statusOnboarding === "aprovado");
}

export function getIgrejaPorSlug(slug: string): Igreja | undefined {
  return igrejas.find((i) => i.slug === slug);
}

// Busca leve por nome — pensada para escalar (milhares de igrejas): o
// cliente nunca recebe a lista inteira, só os poucos resultados que batem
// com o texto digitado. Usada no cadastro de fiel quando ele não chega por
// um link/QR code específico da igreja.
export function buscarIgrejasAprovadas(consulta: string, limite = 8): Igreja[] {
  const termo = consulta.trim().toLowerCase();
  if (!termo) return [];
  return getIgrejasAprovadas()
    .filter((i) => i.nome.toLowerCase().includes(termo) || i.cidade.toLowerCase().includes(termo))
    .slice(0, limite);
}

function normalizarTelefone(telefone: string): string {
  return telefone.replace(/\D/g, "");
}

// Login do fiel é por telefone, não por seleção de igreja — a igreja já
// vem junto do cadastro existente, então ele nunca precisa "achar" a
// própria igreja numa lista pra entrar.
export function getFielPorTelefone(telefone: string): Fiel | undefined {
  const alvo = normalizarTelefone(telefone);
  if (!alvo) return undefined;
  return fieis.find((f) => normalizarTelefone(f.telefone) === alvo);
}

let proximoIdFielConvidado = 1000;

// Doação via link avulso não exige cadastro prévio (ver PRD) — criamos um
// registro leve de fiel "convidado" para manter o histórico consistente.
export function criarFielConvidado(igrejaId: string, nome: string): Fiel {
  const novo: Fiel = {
    id: `fiel-convidado-${proximoIdFielConvidado++}`,
    igrejaId,
    nome: nome || "Doador",
    telefone: "—",
    criadoEm: new Date().toISOString().slice(0, 10),
  };
  fieis.push(novo);
  return novo;
}

export function getLinksDaIgreja(igrejaId: string): LinkPagamento[] {
  return linksPagamento.filter((l) => l.igrejaId === igrejaId);
}

export function getCampanhasDaIgreja(igrejaId: string): Campanha[] {
  return campanhas.filter((c) => c.igrejaId === igrejaId);
}

export function getCampanha(campanhaId: string): Campanha | undefined {
  return campanhas.find((c) => c.id === campanhaId);
}

export function getEventosDaIgreja(igrejaId: string): Evento[] {
  return eventos.filter((e) => e.igrejaId === igrejaId);
}

export function getMuralDaIgreja(igrejaId: string): ComunicadoMural[] {
  return comunicadosMural
    .filter((c) => c.igrejaId === igrejaId)
    .sort((a, b) => (a.publicadoEm < b.publicadoEm ? 1 : -1));
}

export function getContribuicoesDaIgreja(igrejaId: string): Contribuicao[] {
  return contribuicoes.filter((c) => c.igrejaId === igrejaId);
}

export function getContribuicao(contribuicaoId: string): Contribuicao | undefined {
  return contribuicoes.find((c) => c.id === contribuicaoId);
}

export function getContribuicoesDoFiel(fielId: string): Contribuicao[] {
  return contribuicoes
    .filter((c) => c.fielId === fielId)
    .sort((a, b) => (a.criadaEm < b.criadaEm ? 1 : -1));
}

// Só conta Pix já confirmado pelo fiel — enquanto ele não volta pra confirmar
// que pagou, esse valor ainda não foi de fato recebido pela igreja.
export function getArrecadadoCampanha(campanhaId: string): number {
  return contribuicoes
    .filter((c) => c.campanhaId === campanhaId && c.status === "confirmado")
    .reduce((soma, c) => soma + c.valorBruto, 0);
}

export function getUsuariosDaIgreja(igrejaId: string): UsuarioIgreja[] {
  return usuariosIgreja.filter((u) => u.igrejaId === igrejaId);
}

export function getUsuarioIgrejaPorEmail(email: string): UsuarioIgreja | undefined {
  const alvo = email.trim().toLowerCase();
  return usuariosIgreja.find((u) => u.email.toLowerCase() === alvo);
}

export function getNotificacoesDoFiel(fielId: string): NotificacaoFiel[] {
  return notificacoes
    .filter((n) => n.fielId === fielId)
    .sort((a, b) => (a.criadaEm < b.criadaEm ? 1 : -1));
}

// --- Helpers de escrita (mutam o array em memória) ---

let proximoIdContribuicao = contribuicoes.length + 1;

// Passo 1 do fluxo real: o fiel escolheu o valor, mas ainda não pagou nada.
// Criamos o registro como "aguardando_pix" — a igreja só aparece como tendo
// recebido depois que o fiel volta e confirma que pagou (ver
// confirmarContribuicao). Nenhuma cobrança acontece aqui.
export function iniciarContribuicao(input: {
  fielId: string;
  igrejaId: string;
  tipo: Contribuicao["tipo"];
  campanhaId: string | null;
  valorBruto: number;
}): Contribuicao {
  const taxa = calcularTaxaProcessamento(input.tipo, input.valorBruto);
  const fiel = getFiel(input.fielId);

  const nova: Contribuicao = {
    id: `contrib-${proximoIdContribuicao++}`,
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
    criadaEm: new Date().toISOString().slice(0, 10),
  };
  contribuicoes.push(nova);
  return nova;
}

// Passo 2: o fiel confirma que já pagou o Pix pra chave da igreja. É esse
// clique — não um webhook bancário — que dispara a cobrança da taxa de
// processamento no cartão salvo (ou como Pix separado, se não tiver cartão).
export function confirmarContribuicao(contribuicaoId: string): Contribuicao | undefined {
  const contribuicao = contribuicoes.find((c) => c.id === contribuicaoId);
  if (!contribuicao) return undefined;
  contribuicao.status = "confirmado";
  return contribuicao;
}

export function salvarCartaoFiel(fielId: string, cartao: CartaoSalvo): void {
  const fiel = fieis.find((f) => f.id === fielId);
  if (fiel) fiel.cartaoSalvo = cartao;
}

let proximoIdLink = linksPagamento.length + 1;

export function criarLinkPagamento(input: {
  igrejaId: string;
  titulo: string;
  tipo: LinkPagamento["tipo"];
  valorSugerido: number | null;
}): LinkPagamento {
  const novo: LinkPagamento = {
    id: `link-${proximoIdLink++}`,
    igrejaId: input.igrejaId,
    titulo: input.titulo,
    tipo: input.tipo,
    valorSugerido: input.valorSugerido,
    ativo: true,
    criadoEm: new Date().toISOString().slice(0, 10),
  };
  linksPagamento.push(novo);
  return novo;
}

let proximoIdCampanha = campanhas.length + 1;

export function criarCampanha(input: {
  igrejaId: string;
  titulo: string;
  descricao: string;
  meta: number;
  prazo: string;
  imagemEmoji: string;
}): Campanha {
  const nova: Campanha = {
    id: `campanha-${proximoIdCampanha++}`,
    igrejaId: input.igrejaId,
    titulo: input.titulo,
    descricao: input.descricao,
    meta: input.meta,
    prazo: input.prazo,
    imagemEmoji: input.imagemEmoji || "🙏",
    encerrada: false,
    criadaEm: new Date().toISOString().slice(0, 10),
  };
  campanhas.push(nova);
  return nova;
}

let proximoIdEvento = eventos.length + 1;

export function criarEvento(input: {
  igrejaId: string;
  titulo: string;
  data: string;
  local: string;
  descricao: string;
  arrecadacaoVinculada: boolean;
}): Evento {
  const novo: Evento = {
    id: `evento-${proximoIdEvento++}`,
    igrejaId: input.igrejaId,
    titulo: input.titulo,
    data: input.data,
    local: input.local,
    descricao: input.descricao,
    arrecadacaoVinculada: input.arrecadacaoVinculada,
  };
  eventos.push(novo);
  return novo;
}

let proximoIdIgreja = igrejas.length + 1;
let proximoIdUsuarioIgreja = usuariosIgreja.length + 1;

// Autoatendimento: igreja se cadastra e entra em análise (ver seção 12 do PRD
// — KYC antes de habilitar recebimento). Fica bloqueada até um superadmin aprovar.
function gerarSlugUnico(nome: string): string {
  const base = slugify(nome);
  let slug = base;
  let sufixo = 2;
  while (igrejas.some((i) => i.slug === slug)) {
    slug = `${base}-${sufixo++}`;
  }
  return slug;
}

export function criarIgreja(input: {
  nome: string;
  cnpj: string;
  responsavelNome: string;
  responsavelEmail: string;
  cidade: string;
  uf: string;
}): Igreja {
  const nova: Igreja = {
    id: `igreja-${proximoIdIgreja++}`,
    slug: gerarSlugUnico(input.nome),
    nome: input.nome,
    cnpj: input.cnpj,
    responsavelNome: input.responsavelNome,
    responsavelEmail: input.responsavelEmail,
    cidade: input.cidade,
    uf: input.uf,
    logoEmoji: "⛪",
    statusOnboarding: "em_analise",
    // A igreja informa a própria chave Pix depois, na aprovação — usamos o
    // e-mail do responsável como valor inicial pra nunca ficar vazia.
    chavePix: input.responsavelEmail,
    criadaEm: new Date().toISOString().slice(0, 10),
  };
  igrejas.push(nova);
  return nova;
}

export function criarUsuarioIgreja(input: {
  igrejaId: string;
  nome: string;
  email: string;
  papel: UsuarioIgreja["papel"];
}): UsuarioIgreja {
  const novo: UsuarioIgreja = {
    id: `user-igreja-${proximoIdUsuarioIgreja++}`,
    igrejaId: input.igrejaId,
    nome: input.nome,
    email: input.email,
    papel: input.papel,
  };
  usuariosIgreja.push(novo);
  return novo;
}

export function atualizarStatusIgreja(igrejaId: string, status: Igreja["statusOnboarding"]): void {
  const igreja = igrejas.find((i) => i.id === igrejaId);
  if (igreja) igreja.statusOnboarding = status;
}

let proximoIdFiel = 1;

export function criarFiel(input: { igrejaId: string; nome: string; telefone: string }): Fiel {
  const novo: Fiel = {
    id: `fiel-cad-${proximoIdFiel++}`,
    igrejaId: input.igrejaId,
    nome: input.nome,
    telefone: input.telefone,
    criadoEm: new Date().toISOString().slice(0, 10),
  };
  fieis.push(novo);
  return novo;
}

let proximoIdNotificacao = notificacoes.length + 1;

export function criarNotificacao(input: {
  fielId: string;
  igrejaId: string;
  tipo: NotificacaoFiel["tipo"];
  titulo: string;
  corpo: string;
}): NotificacaoFiel {
  const nova: NotificacaoFiel = {
    id: `notif-${proximoIdNotificacao++}`,
    fielId: input.fielId,
    igrejaId: input.igrejaId,
    tipo: input.tipo,
    titulo: input.titulo,
    corpo: input.corpo,
    lida: false,
    criadaEm: new Date().toISOString().slice(0, 10),
  };
  notificacoes.push(nova);
  return nova;
}

export function notificarFieisDaIgreja(
  igrejaId: string,
  input: { tipo: NotificacaoFiel["tipo"]; titulo: string; corpo: string }
): void {
  for (const fiel of getFieisDaIgreja(igrejaId)) {
    criarNotificacao({ fielId: fiel.id, igrejaId, ...input });
  }
}

export function marcarNotificacaoLida(notificacaoId: string): void {
  const notificacao = notificacoes.find((n) => n.id === notificacaoId);
  if (notificacao) notificacao.lida = true;
}
