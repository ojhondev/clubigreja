import { getContribuicoesDoFiel } from "./mock-db";
import { dataLocal, hoje, mesAno } from "./hoje";

export interface StatusDizimo {
  contribuiuEsteMes: boolean;
  ultimaContribuicaoEm: string | null;
  mesesSemContribuir: number;
}

export function getStatusDizimo(fielId: string): StatusDizimo {
  const contribuicoesDizimo = getContribuicoesDoFiel(fielId).filter(
    (c) => c.tipo === "dizimo"
  );

  if (contribuicoesDizimo.length === 0) {
    return { contribuiuEsteMes: false, ultimaContribuicaoEm: null, mesesSemContribuir: 1 };
  }

  const ultima = contribuicoesDizimo[0]; // já vem ordenado desc por getContribuicoesDoFiel
  const contribuiuEsteMes = mesAno(ultima.criadaEm) === mesAno(hoje());

  const dataUltima = dataLocal(ultima.criadaEm);
  const referencia = hoje();
  const mesesSemContribuir =
    (referencia.getFullYear() - dataUltima.getFullYear()) * 12 +
    (referencia.getMonth() - dataUltima.getMonth());

  return {
    contribuiuEsteMes,
    ultimaContribuicaoEm: ultima.criadaEm,
    mesesSemContribuir: contribuiuEsteMes ? 0 : mesesSemContribuir,
  };
}

const NOMES_MES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

export function nomeMesAtual(): string {
  return NOMES_MES[hoje().getMonth()];
}
