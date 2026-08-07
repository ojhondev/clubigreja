import type { CartaoSalvo, TipoArrecadacao } from "../types";

export interface CobrancaInput {
  igrejaId: string;
  fielId: string;
  tipo: TipoArrecadacao;
  campanhaId: string | null;
  valorBruto: number;
  // Presente só quando o fiel está cadastrando um cartão nessa mesma contribuição
  // (primeira vez, sem cartão salvo ainda).
  novoCartao?: { numero: string; nome: string };
}

export interface CobrancaResultado {
  id: string;
  status: "CONFIRMADO" | "PENDENTE" | "RECUSADO";
  valorBruto: number;
  taxaValor: number;
  valorTotalFiel: number;
  taxaCobradaVia: "cartao_salvo" | "pix_separado";
  cartaoSalvo?: CartaoSalvo;
  criadaEm: string;
}

// Contrato que a integração real (Asaas) precisa satisfazer. A implementação
// mockada em mock-gateway.ts simula a resposta sem chamar nenhuma API externa —
// trocar para produção é substituir a implementação usada em index.ts, sem
// tocar nas telas que chamam `gateway.criarCobranca(...)`.
//
// Modelo: a doação em si é um Pix direto pra chave da própria igreja — nunca
// passa pela conta do Club Igreja, então não há split nem subconta. A taxa de
// processamento é uma segunda cobrança, independente, que cai na conta do
// Club Igreja — cobrada automaticamente no cartão salvo do fiel (sem pedir
// uma segunda confirmação) ou, na ausência de cartão, como um Pix separado.
export interface PaymentGateway {
  criarCobranca(input: CobrancaInput): Promise<CobrancaResultado>;
}
