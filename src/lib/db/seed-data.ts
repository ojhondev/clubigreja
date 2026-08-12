import { calcularTaxaProcessamento } from "../comissao";
import type {
  Campanha,
  ComunicadoMural,
  Contribuicao,
  Evento,
  Fiel,
  Igreja,
  LinkPagamento,
  NotificacaoFiel,
  UsuarioIgreja,
} from "../types";

// Dados de demonstração usados só pra popular o banco (npm run db:seed) —
// não são mais a fonte de dados em runtime, isso agora é o Drizzle (ver
// ./repo.ts). Mantém os mesmos registros que a versão mockada em memória
// tinha, pra não perder o cenário de teste que os fluxos já validam.

export const igrejas: Igreja[] = [
  {
    id: "igreja-1",
    slug: "novavida",
    nome: "Igreja Batista Nova Vida",
    cnpj: "12.345.678/0001-90",
    responsavelNome: "Pr. José Andrade",
    responsavelEmail: "pastor.jose@novavida.org.br",
    responsavelWhatsapp: "(19) 99100-2233",
    cidade: "Campinas",
    uf: "SP",
    logoEmoji: "⛪",
    linksExtras: [
      { id: "link-extra-1", rotulo: "Instagram", url: "https://instagram.com/novavidabatista" },
      { id: "link-extra-2", rotulo: "Site da igreja", url: "https://novavida.org.br" },
    ],
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
    titulo: "Bem-vindo ao Dizipay!",
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

export const contribuicoes: Contribuicao[] = [
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
