import type { MeioPagamento, TipoArrecadacao } from "./types";

// Fonte única das taxas — reaproveitada pelo cálculo de split real e pelo
// simulador público da landing page, para nunca divergirem.
export const TAXA_CAMPANHA = 0.015;
export const TAXA_DIZIMO = 0.01;

const PERCENTUAL_POR_TIPO: Record<TipoArrecadacao, number> = {
  dizimo: TAXA_DIZIMO,
  oferta: TAXA_DIZIMO,
  campanha: TAXA_CAMPANHA,
  evento: TAXA_CAMPANHA,
  livre: TAXA_CAMPANHA,
};

// Estimativa de custo do gateway (Asaas) usada para calcular a margem líquida do Club Igreja.
// A comissão cobrada da igreja já inclui esse custo — nunca é destacada ao doador.
function custoGateway(meio: MeioPagamento, valorBruto: number): number {
  if (meio === "pix") return 0.99;
  if (meio === "cartao") return valorBruto * 0.0199 + 0.49;
  return 3.49; // boleto (fora do MVP, mantido para referência futura)
}

export interface CalculoSplit {
  comissaoPercentual: number;
  comissaoValor: number;
  custoGateway: number;
  valorLiquido: number;
}

export function calcularSplit(
  tipo: TipoArrecadacao,
  meio: MeioPagamento,
  valorBruto: number
): CalculoSplit {
  const comissaoPercentual = PERCENTUAL_POR_TIPO[tipo];
  const comissaoValor = Math.round(valorBruto * comissaoPercentual * 100) / 100;
  const custo = Math.round(custoGateway(meio, valorBruto) * 100) / 100;
  const valorLiquido = Math.round((valorBruto - comissaoValor) * 100) / 100;

  return {
    comissaoPercentual,
    comissaoValor,
    custoGateway: custo,
    valorLiquido,
  };
}

export function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
