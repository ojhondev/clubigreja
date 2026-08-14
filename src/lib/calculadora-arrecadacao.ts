// Projeção de aumento de arrecadação ao ativar o canal digital de
// contribuição — usada tanto no popup quanto na página dedicada da
// calculadora. Mesmo aumento médio citado na copy (40%), então os dois
// lugares nunca podem divergir.
export const AUMENTO_PERCENTUAL = 0.4;

export const DIZIMISTAS_MIN = 20;
export const DIZIMISTAS_MAX = 3000;
export const VALOR_MEDIO_MIN = 10;
export const VALOR_MEDIO_MAX = 500;

export interface ProjecaoArrecadacao {
  arrecadacaoAtual: number;
  projecaoComClub: number;
  aumentoMensal: number;
  aumentoAnual: number;
}

export function calcularProjecaoArrecadacao(
  dizimistas: number,
  valorMedio: number,
): ProjecaoArrecadacao {
  const arrecadacaoAtual = dizimistas * valorMedio;
  const projecaoComClub = Math.round(
    arrecadacaoAtual * (1 + AUMENTO_PERCENTUAL),
  );
  const aumentoMensal = projecaoComClub - arrecadacaoAtual;
  const aumentoAnual = aumentoMensal * 12;

  return { arrecadacaoAtual, projecaoComClub, aumentoMensal, aumentoAnual };
}
