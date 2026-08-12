import { getContribuicoesDaIgreja as getTodasContribuicoesDaIgreja, getFiel } from "./db/repo";
import { mesAno, hoje } from "./hoje";
import type { Contribuicao } from "./types";

// Todo cálculo financeiro deste arquivo considera só Pix já confirmado pelo
// fiel — enquanto ele não volta pra confirmar, esse dinheiro ainda não foi
// de fato recebido pela igreja.
async function getContribuicoesDaIgreja(igrejaId: string): Promise<Contribuicao[]> {
  const todas = await getTodasContribuicoesDaIgreja(igrejaId);
  return todas.filter((c) => c.status === "confirmado");
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

export async function getResumoFinanceiro(igrejaId: string): Promise<ResumoFinanceiro> {
  const contribuicoes = await getContribuicoesDaIgreja(igrejaId);
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

export async function getContribuicoesPorTipo(igrejaId: string): Promise<Record<Contribuicao["tipo"], number>> {
  const contribuicoes = await getContribuicoesDaIgreja(igrejaId);
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
// não existe mais um ciclo de repasse (o Dizipay nunca custodia esse
// valor). Isso mede quanto os fiéis pagaram de taxa de processamento no mês,
// como informação de transparência pra igreja (não afeta o que ela recebeu).
export async function getTaxasFieisMesAtual(igrejaId: string): Promise<number> {
  const contribuicoes = await getContribuicoesDaIgreja(igrejaId);
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

export async function getTotaisPorMes(igrejaId: string, meses = 6): Promise<TotalMensal[]> {
  const contribuicoes = await getContribuicoesDaIgreja(igrejaId);
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
export async function getTotaisPorMesDetalhado(igrejaId: string, meses = 6): Promise<TotalMensalDetalhado[]> {
  const contribuicoes = await getContribuicoesDaIgreja(igrejaId);
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
export async function getCrescimentoMensal(igrejaId: string): Promise<CrescimentoMensal> {
  const contribuicoes = await getContribuicoesDaIgreja(igrejaId);
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

export async function getUltimasContribuicoes(igrejaId: string, limite = 5): Promise<ContribuicaoRecente[]> {
  const recentes = (await getContribuicoesDaIgreja(igrejaId))
    .sort((a, b) => (a.criadaEm < b.criadaEm ? 1 : -1))
    .slice(0, limite);

  return Promise.all(
    recentes.map(async (c) => ({
      id: c.id,
      fielNome: (await getFiel(c.fielId))?.nome ?? "Doador",
      tipo: c.tipo,
      meio: c.meio,
      valorBruto: c.valorBruto,
      criadaEm: c.criadaEm,
    }))
  );
}
