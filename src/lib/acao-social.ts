// Lógica do Club Ação Social: empresas parceiras da comunidade dão um
// benefício (desconto/cashback) para fiéis cadastrados no app, e uma parte
// desse benefício é redirecionada automaticamente para o projeto social da
// igreja do fiel — sem custo adicional para o fiel nem para a igreja.
//
// Exemplo de referência: compra de R$200 → R$20 de benefício (10%) → R$5
// para o projeto social (25% do benefício, equivalente a 2,5% da compra).
export const TAXA_BENEFICIO_SOBRE_COMPRA = 0.1;
export const TAXA_PROJETO_SOCIAL_SOBRE_BENEFICIO = 0.25;

export interface CalculoAcaoSocial {
  valorCompra: number;
  beneficioFiel: number;
  paraProjetoSocial: number;
  liquidoParaFiel: number;
}

export function calcularBeneficio(valorCompra: number): CalculoAcaoSocial {
  const beneficioFiel = Math.round(valorCompra * TAXA_BENEFICIO_SOBRE_COMPRA * 100) / 100;
  const paraProjetoSocial =
    Math.round(beneficioFiel * TAXA_PROJETO_SOCIAL_SOBRE_BENEFICIO * 100) / 100;
  const liquidoParaFiel = Math.round((beneficioFiel - paraProjetoSocial) * 100) / 100;

  return { valorCompra, beneficioFiel, paraProjetoSocial, liquidoParaFiel };
}
