import { getContribuicoesDaIgreja as getTodasContribuicoesDaIgreja, getFiel } from "./mock-db";
import { mesAno, hoje } from "./hoje";
import type { Contribuicao } from "./types";

// Todo cálculo financeiro deste arquivo considera só Pix já confirmado pelo
// fiel — enquanto ele não volta pra confirmar, esse dinheiro ainda não foi
// de fato recebido pela igreja.
function getContribuicoesDaIgreja(igrejaId: string): Contribuicao[] {
  return getTodasContribuicoesDaIgreja(igrejaId).filter((c) => c.status === "confirmado");
}

// A igreja recebe 100% do valorBruto — a taxa de processamento é paga pelo
// fiel, por fora, e nunca é descontada do que a igreja arrecada. totalTaxasFieis
// existe só como informação de transparência (quanto os fiéis pagaram ao todo),
// não afeta o quanto a igreja recebeu.
export interface ResumoFinanceiro {
  totalBruto: number;
  totalTaxasFieis: number;
  totalBrutoMesAtual: number;
  quantidadeContribuicoes: number;
}

export function getResumoFinanceiro(igrejaId: string): ResumoFinanceiro {
  const contribuicoes = getContribuicoesDaIgreja(igrejaId);
  const mesAtual = mesAno(hoje());

  return contribuicoes.reduce<ResumoFinanceiro>(
    (acc, c) => {
      acc.totalBruto += c.valorBruto;
      acc.totalTaxasFieis += c.taxaValor;
      acc.quantidadeContribuicoes += 1;
      if (mesAno(c.criadaEm) === mesAtual) acc.totalBrutoMesAtual += c.valorBruto;
      return acc;
    },
    { totalBruto: 0, totalTaxasFieis: 0, totalBrutoMesAtual: 0, quantidadeContribuicoes: 0 }
  );
}

export function getContribuicoesPorTipo(igrejaId: string): Record<Contribuicao["tipo"], number> {
  const contribuicoes = getContribuicoesDaIgreja(igrejaId);
  const base: Record<Contribuicao["tipo"], number> = {
    dizimo: 0,
    oferta: 0,
    campanha: 0,
    evento: 0,
    livre: 0,
  };
  for (const c of contribuicoes) base[c.tipo] += c.valorBruto;
  return base;
}

// O dízimo/oferta/campanha vai direto via Pix pra chave da própria igreja —
// não existe mais um ciclo de repasse (o Club Igreja nunca custodia esse
// valor). Isso mede quanto os fiéis pagaram de taxa de processamento no mês,
// como informação de transparência pra igreja (não afeta o que ela recebeu).
export function getTaxasFieisMesAtual(igrejaId: string): number {
  const contribuicoes = getContribuicoesDaIgreja(igrejaId);
  const mesAtual = mesAno(hoje());

  return contribuicoes
    .filter((c) => mesAno(c.criadaEm) === mesAtual)
    .reduce((soma, c) => soma + c.taxaValor, 0);
}

export interface TotalMensal {
  mesAno: string;
  rotulo: string;
  total: number;
}

const NOMES_MES_ABREV = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];

export function getTotaisPorMes(igrejaId: string, meses = 6): TotalMensal[] {
  const contribuicoes = getContribuicoesDaIgreja(igrejaId);
  const referencia = hoje();

  const janela: TotalMensal[] = [];
  for (let i = meses - 1; i >= 0; i--) {
    const data = new Date(referencia.getFullYear(), referencia.getMonth() - i, 1);
    janela.push({ mesAno: mesAno(data), rotulo: NOMES_MES_ABREV[data.getMonth()], total: 0 });
  }

  const porMes = new Map(janela.map((m) => [m.mesAno, m]));
  for (const c of contribuicoes) {
    const alvo = porMes.get(mesAno(c.criadaEm));
    if (alvo) alvo.total += c.valorBruto;
  }

  return janela;
}

export interface TotalMensalDetalhado {
  mesAno: string;
  rotulo: string;
  Dízimo: number;
  Campanha: number;
  Outros: number;
}

// Mesma janela de getTotaisPorMes, mas quebrada por finalidade — alimenta o
// gráfico de barras empilhadas do dashboard.
export function getTotaisPorMesDetalhado(igrejaId: string, meses = 6): TotalMensalDetalhado[] {
  const contribuicoes = getContribuicoesDaIgreja(igrejaId);
  const referencia = hoje();

  const janela: TotalMensalDetalhado[] = [];
  for (let i = meses - 1; i >= 0; i--) {
    const data = new Date(referencia.getFullYear(), referencia.getMonth() - i, 1);
    janela.push({ mesAno: mesAno(data), rotulo: NOMES_MES_ABREV[data.getMonth()], Dízimo: 0, Campanha: 0, Outros: 0 });
  }

  const porMes = new Map(janela.map((m) => [m.mesAno, m]));
  for (const c of contribuicoes) {
    const alvo = porMes.get(mesAno(c.criadaEm));
    if (!alvo) continue;
    if (c.tipo === "dizimo" || c.tipo === "oferta") alvo.Dízimo += c.valorBruto;
    else if (c.tipo === "campanha" || c.tipo === "evento") alvo.Campanha += c.valorBruto;
    else alvo.Outros += c.valorBruto;
  }

  return janela;
}

export interface CrescimentoMensal {
  mesAtual: number;
  mesAnterior: number;
  percentual: number | null;
}

// Compara a arrecadação bruta do mês corrente com a do mês anterior — para o
// selo de "crescimento" no dashboard.
export function getCrescimentoMensal(igrejaId: string): CrescimentoMensal {
  const contribuicoes = getContribuicoesDaIgreja(igrejaId);
  const referencia = hoje();
  const mesAtualStr = mesAno(referencia);
  const mesAnteriorStr = mesAno(new Date(referencia.getFullYear(), referencia.getMonth() - 1, 1));

  let mesAtual = 0;
  let mesAnterior = 0;
  for (const c of contribuicoes) {
    const m = mesAno(c.criadaEm);
    if (m === mesAtualStr) mesAtual += c.valorBruto;
    else if (m === mesAnteriorStr) mesAnterior += c.valorBruto;
  }

  const percentual = mesAnterior > 0 ? Math.round(((mesAtual - mesAnterior) / mesAnterior) * 1000) / 10 : null;
  return { mesAtual, mesAnterior, percentual };
}

export interface ContribuicaoRecente {
  id: string;
  fielNome: string;
  tipo: Contribuicao["tipo"];
  meio: Contribuicao["meio"];
  valorBruto: number;
  criadaEm: string;
}

export function getUltimasContribuicoes(igrejaId: string, limite = 5): ContribuicaoRecente[] {
  return getContribuicoesDaIgreja(igrejaId)
    .sort((a, b) => (a.criadaEm < b.criadaEm ? 1 : -1))
    .slice(0, limite)
    .map((c) => ({
      id: c.id,
      fielNome: getFiel(c.fielId)?.nome ?? "Doador",
      tipo: c.tipo,
      meio: c.meio,
      valorBruto: c.valorBruto,
      criadaEm: c.criadaEm,
    }));
}
