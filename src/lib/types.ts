export type PapelIgreja = "administrador" | "tesoureiro" | "secretario";

export type StatusOnboarding = "pendente" | "em_analise" | "aprovado" | "reprovado";

export type MeioPagamento = "pix" | "cartao" | "boleto";

export type TipoArrecadacao = "dizimo" | "oferta" | "campanha" | "evento" | "livre";

export interface Igreja {
  id: string;
  slug: string;
  nome: string;
  cnpj: string;
  responsavelNome: string;
  responsavelEmail: string;
  cidade: string;
  uf: string;
  logoEmoji: string;
  statusOnboarding: StatusOnboarding;
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
