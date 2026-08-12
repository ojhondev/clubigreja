export type PapelIgreja = "administrador" | "tesoureiro" | "secretario";

export type StatusOnboarding = "pendente" | "em_analise" | "aprovado" | "reprovado";

export type MeioPagamento = "pix" | "cartao" | "boleto";

export type TipoArrecadacao = "dizimo" | "oferta" | "campanha" | "evento" | "livre";

export interface LinkExtra {
  id: string;
  rotulo: string;
  url: string;
}

export interface Igreja {
  id: string;
  slug: string;
  nome: string;
  cnpj: string;
  responsavelNome: string;
  responsavelEmail: string;
  responsavelWhatsapp: string;
  cidade: string;
  uf: string;
  logoEmoji: string;
  // Foto de perfil da igreja, exibida na página pública. Sem foto cadastrada,
  // a página cai no emoji como placeholder.
  fotoUrl?: string;
  // Links extras que a igreja escolhe mostrar na própria página pública —
  // Instagram, site, campanha específica etc.
  linksExtras: LinkExtra[];
  statusOnboarding: StatusOnboarding;
  // Chave Pix da própria igreja, cadastrada no banco dela — é pra onde o Pix
  // do fiel vai direto. O Dizipay nunca custodia esse valor.
  chavePix: string;
  criadaEm: string;
}

export interface UsuarioIgreja {
  id: string;
  igrejaId: string;
  nome: string;
  email: string;
  papel: PapelIgreja;
}

export interface CartaoSalvo {
  bandeira: string;
  ultimosDigitos: string;
  tokenFake: string;
}

export interface Fiel {
  id: string;
  igrejaId: string;
  nome: string;
  telefone: string;
  criadoEm: string;
  cartaoSalvo?: CartaoSalvo;
}

export interface LinkPagamento {
  id: string;
  igrejaId: string;
  titulo: string;
  tipo: TipoArrecadacao;
  valorSugerido: number | null;
  ativo: boolean;
  criadoEm: string;
}

export interface Campanha {
  id: string;
  igrejaId: string;
  titulo: string;
  descricao: string;
  meta: number;
  prazo: string;
  imagemEmoji: string;
  encerrada: boolean;
  criadaEm: string;
}

export interface Evento {
  id: string;
  igrejaId: string;
  titulo: string;
  data: string;
  local: string;
  descricao: string;
  arrecadacaoVinculada: boolean;
}

export interface ComunicadoMural {
  id: string;
  igrejaId: string;
  titulo: string;
  corpo: string;
  emoji: string;
  publicadoEm: string;
}

// aguardando_pix: o fiel já escolheu o valor, mas ainda precisa efetivamente
// pagar o Pix no app do banco dele e voltar pra confirmar — a taxa só é
// cobrada nesse momento de confirmação. confirmado: Pix confirmado pelo
// fiel e taxa já cobrada no cartão salvo.
export type StatusContribuicao = "aguardando_pix" | "confirmado";

export interface Contribuicao {
  id: string;
  igrejaId: string;
  fielId: string;
  tipo: TipoArrecadacao;
  campanhaId: string | null;
  meio: MeioPagamento;
  valorBruto: number;
  taxaPercentual: number;
  taxaValor: number;
  valorTotalFiel: number;
  taxaCobradaVia: "cartao_salvo" | "pix_separado";
  status: StatusContribuicao;
  criadaEm: string;
}

export interface NotificacaoFiel {
  id: string;
  fielId: string;
  igrejaId: string;
  tipo: "lembrete_dizimo" | "comunicado" | "campanha";
  titulo: string;
  corpo: string;
  lida: boolean;
  criadaEm: string;
}

export type NivelWebmaster = "primario" | "secundario";

// Equipe interna Dizipay. O Master Primário sempre tem acesso total — as
// colunas pode* só têm efeito prático para masters secundários.
export interface Webmaster {
  id: string;
  nome: string;
  email: string;
  nivel: NivelWebmaster;
  podeGerenciarPagamentos: boolean;
  podeAprovarIgrejas: boolean;
  criadoEm: string;
}

// Convite pendente — mesma linha da tabela webmasters, mas ainda sem senha.
export interface ConviteWebmaster {
  id: string;
  nome: string;
  email: string;
  nivel: NivelWebmaster;
  podeGerenciarPagamentos: boolean;
  podeAprovarIgrejas: boolean;
  conviteToken: string;
  conviteExpiraEm: string;
}

// Linha da tela "Equipe" — um Webmaster ativo ou um convite ainda pendente.
export interface MembroWebmasterListagem {
  id: string;
  nome: string;
  email: string;
  nivel: NivelWebmaster;
  podeGerenciarPagamentos: boolean;
  podeAprovarIgrejas: boolean;
  criadoEm: string;
  pendente: boolean;
  conviteToken?: string;
}
