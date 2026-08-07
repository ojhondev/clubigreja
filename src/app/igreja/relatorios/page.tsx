import { getSessao } from "@/lib/auth/session";
import { getIgreja, getContribuicoesDaIgreja, getFiel } from "@/lib/mock-db";
import { getContribuicoesPorTipo, getResumoFinanceiro } from "@/lib/relatorios";
import { formatarMoeda } from "@/lib/comissao";
import { formatarData } from "@/lib/formato";
import { Card, PageHeader } from "@/components/ui";
import { ExportarCsvButton, type LinhaExportavel } from "@/components/dashboard/exportar-csv-button";
import { IntegracaoErpCard } from "@/components/dashboard/integracao-erp-card";

const ROTULO_TIPO: Record<string, string> = {
  dizimo: "Dízimo",
  oferta: "Oferta",
  campanha: "Campanha",
  evento: "Evento",
  livre: "Valor livre",
};

const ROTULO_MEIO: Record<string, string> = {
  pix: "Pix",
  cartao: "Cartão",
  boleto: "Boleto",
};

export default async function RelatoriosPage() {
  const sessao = await getSessao();
  const igrejaId = sessao!.igrejaId!;
  const igreja = getIgreja(igrejaId)!;
  const resumo = getResumoFinanceiro(igrejaId);
  const porTipo = getContribuicoesPorTipo(igrejaId);
  const contribuicoes = getContribuicoesDaIgreja(igrejaId).sort((a, b) =>
    a.criadaEm < b.criadaEm ? 1 : -1
  );

  const linhasCsv: LinhaExportavel[] = contribuicoes.map((c) => ({
    data: formatarData(c.criadaEm),
    fiel: getFiel(c.fielId)?.nome ?? "—",
    finalidade: ROTULO_TIPO[c.tipo],
    meio: ROTULO_MEIO[c.meio],
    bruto: c.valorBruto,
    comissao: c.comissaoValor,
    liquido: c.valorLiquido,
  }));
  const nomeArquivoCsv = `extrato-${igreja.slug}-${new Date().toISOString().slice(0, 10)}.csv`;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader title="Relatórios financeiros" subtitle="Extrato pronto para prestação de contas à congregação." />
        <ExportarCsvButton linhas={linhasCsv} nomeArquivo={nomeArquivoCsv} />
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-muted">Total arrecadado (bruto)</p>
          <p className="mt-1 text-xl font-bold">{formatarMoeda(resumo.totalBruto)}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Comissão retida (Club Igreja)</p>
          <p className="mt-1 text-xl font-bold text-muted">{formatarMoeda(resumo.totalComissao)}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Total repassado à igreja</p>
          <p className="mt-1 text-xl font-bold text-success">{formatarMoeda(resumo.totalLiquido)}</p>
        </Card>
      </div>

      <Card className="mb-8">
        <h2 className="mb-4 font-bold">Por finalidade</h2>
        <div className="grid gap-3 sm:grid-cols-5">
          {Object.entries(porTipo).map(([tipo, valor]) => (
            <div key={tipo}>
              <p className="text-sm text-muted">{ROTULO_TIPO[tipo]}</p>
              <p className="font-bold">{formatarMoeda(valor)}</p>
            </div>
          ))}
        </div>
      </Card>

      <h2 className="mb-4 text-lg font-bold">Extrato detalhado</h2>
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted">
              <th className="py-2 pr-4">Data</th>
              <th className="py-2 pr-4">Fiel</th>
              <th className="py-2 pr-4">Finalidade</th>
              <th className="py-2 pr-4">Meio</th>
              <th className="py-2 pr-4 text-right">Bruto</th>
              <th className="py-2 pr-4 text-right">Comissão</th>
              <th className="py-2 text-right">Líquido</th>
            </tr>
          </thead>
          <tbody>
            {contribuicoes.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0">
                <td className="py-2 pr-4">{formatarData(c.criadaEm)}</td>
                <td className="py-2 pr-4">{getFiel(c.fielId)?.nome ?? "—"}</td>
                <td className="py-2 pr-4">{ROTULO_TIPO[c.tipo]}</td>
                <td className="py-2 pr-4">{ROTULO_MEIO[c.meio]}</td>
                <td className="py-2 pr-4 text-right">{formatarMoeda(c.valorBruto)}</td>
                <td className="py-2 pr-4 text-right text-muted">
                  {formatarMoeda(c.comissaoValor)} ({(c.comissaoPercentual * 100).toFixed(1)}%)
                </td>
                <td className="py-2 text-right font-medium text-success">{formatarMoeda(c.valorLiquido)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="mt-8">
        <IntegracaoErpCard />
      </div>
    </div>
  );
}
