import type { TipoArrecadacao } from "./types";

// Fonte única da taxa de processamento — reaproveitada pelo cálculo real de
// cobrança e pelo simulador público da landing page, para nunca divergirem.
//
// Modelo: a igreja recebe 100% do valor que o fiel escolheu contribuir. A
// taxa de processamento é somada ao valor e paga pelo próprio fiel — nunca
// é descontada da igreja.
export const TAXA_DIZIMO = 0.035;
export const TAXA_CAMPANHA = 0.025;

const PERCENTUAL_POR_TIPO: Record<TipoArrecadacao, number> = {
  dizimo: TAXA_DIZIMO,
  oferta: TAXA_DIZIMO,
  campanha: TAXA_CAMPANHA,
  evento: TAXA_CAMPANHA,
  livre: TAXA_CAMPANHA,
};

export function taxaPercentualDoTipo(tipo: TipoArrecadacao): number {
  return PERCENTUAL_POR_TIPO[tipo];
}

export interface CalculoTaxa {
  valorBruto: number;
  taxaPercentual: number;
  taxaValor: number;
  valorTotalFiel: number;
}

// valorBruto é o que a igreja recebe (100%, sem desconto). taxaValor é
// somado por cima e pago pelo fiel — valorTotalFiel é o que sai do bolso dele.
export function calcularTaxaProcessamento(tipo: TipoArrecadacao, valorBruto: number): CalculoTaxa {
  const taxaPercentual = PERCENTUAL_POR_TIPO[tipo];
  const taxaValor = Math.round(valorBruto * taxaPercentual * 100) / 100;
  const valorTotalFiel = Math.round((valorBruto + taxaValor) * 100) / 100;

  return { valorBruto, taxaPercentual, taxaValor, valorTotalFiel };
}

export function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
