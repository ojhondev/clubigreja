import type { CartaoSalvo, TipoArrecadacao } from "../types";

export interface IniciarContribuicaoInput {
  igrejaId: string;
  fielId: string;
  tipo: TipoArrecadacao;
  campanhaId: string | null;
  valorBruto: number;
  // Presente só quando o fiel está cadastrando um cartão nessa mesma contribuição
  // (primeira vez, sem cartão salvo ainda) — usado só pra taxa, depois de confirmar.
  novoCartao?: { numero: string; nome: string };
}

// Dados pra o fiel efetivamente pagar: nenhum dinheiro muda de mãos ainda
// nesse momento. copiaECola é o Pix Copia-e-Cola real, gerado a partir da
// própria chave da igreja — o fiel paga direto no app do banco dele.
export interface DadosParaPagamento {
  contribuicaoId: string;
  chavePix: string;
  nomeIgreja: string;
  valorBruto: number;
  taxaValor: number;
  valorTotalFiel: number;
  copiaECola: string;
}

export interface ConfirmacaoPagamento {
  id: string;
  status: "CONFIRMADO";
  valorBruto: number;
  taxaValor: number;
  valorTotalFiel: number;
  taxaCobradaVia: "cartao_salvo" | "pix_separado";
  cartaoSalvo?: CartaoSalvo;
  criadaEm: string;
}

// Contrato que a integração real (Asaas ou gateway de cartão equivalente)
// precisa satisfazer. A implementação mockada em mock-gateway.ts simula a
// resposta sem chamar nenhuma API externa — trocar para produção é substituir
// a implementação usada em index.ts, sem tocar nas telas que chamam o gateway.
//
// Modelo: a doação em si é um Pix direto pra chave da própria igreja — nunca
// passa pela conta do Dizipay, então não há split nem subconta. Por isso
// o fluxo tem duas etapas reais, não uma:
//   1. iniciarContribuicao — registra a intenção e devolve os dados de
//      pagamento (chave Pix + copia-e-cola). Nenhuma cobrança acontece aqui.
//   2. confirmarPagamento — chamado só depois que o fiel volta e confirma
//      que já pagou o Pix. É esse clique que dispara a segunda cobrança,
//      independente, no cartão salvo do fiel — que cai na conta do Dizipay.
export interface PaymentGateway {
  iniciarContribuicao(
    input: IniciarContribuicaoInput,
  ): Promise<DadosParaPagamento>;
  confirmarPagamento(contribuicaoId: string): Promise<ConfirmacaoPagamento>;
}
