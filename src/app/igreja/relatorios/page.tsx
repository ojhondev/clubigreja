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
    valorIgreja: c.valorBruto,
    taxaFiel: c.taxaValor,
    totalPagoFiel: c.valorTotalFiel,
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
          <p className="text-sm text-muted">Total recebido pela igreja</p>
          <p className="mt-1 text-xl font-bold text-success">{formatarMoeda(resumo.totalBruto)}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Contribuições recebidas</p>
          <p className="mt-1 text-xl font-bold">{resumo.quantidadeContribuicoes}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Taxa de processamento paga pelos fiéis</p>
          <p className="mt-1 text-xl font-bold text-muted">{formatarMoeda(resumo.totalTaxasFieis)}</p>
        </Card>
      </div>

      <p className="mb-8 text-sm text-muted">
        Sua igreja recebe 100% do valor de cada contribuição — a taxa de processamento é paga à parte, pelo
        próprio fiel, e nunca é descontada do que a igreja arrecada.
      </p>

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
              <th className="py-2 pr-4 text-right">Recebido pela igreja</th>
              <th className="py-2 pr-4 text-right">Taxa do fiel</th>
              <th className="py-2 text-right">Total pago pelo fiel</th>
            </tr>
          </thead>
          <tbody>
            {contribuicoes.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0">
                <td className="py-2 pr-4">{formatarData(c.criadaEm)}</td>
                <td className="py-2 pr-4">{getFiel(c.fielId)?.nome ?? "—"}</td>
                <td className="py-2 pr-4">{ROTULO_TIPO[c.tipo]}</td>
                <td className="py-2 pr-4 text-right font-medium text-success">{formatarMoeda(c.valorBruto)}</td>
                <td className="py-2 pr-4 text-right text-muted">
                  {formatarMoeda(c.taxaValor)} ({(c.taxaPercentual * 100).toFixed(1)}%)
                </td>
                <td className="py-2 text-right font-medium">{formatarMoeda(c.valorTotalFiel)}</td>
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
