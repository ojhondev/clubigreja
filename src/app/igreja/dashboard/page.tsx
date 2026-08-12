import Link from "next/link";
import { getSessao } from "@/lib/auth/session";
import { getArrecadadoCampanha, getCampanhasDaIgreja, getIgreja } from "@/lib/db/repo";
import {
  getContribuicoesPorTipo,
  getCrescimentoMensal,
  getResumoFinanceiro,
  getTaxasFieisMesAtual,
  getTotaisPorMesDetalhado,
  getUltimasContribuicoes,
} from "@/lib/relatorios";
import { formatarMoeda } from "@/lib/comissao";
import { Badge, Button, Card, ProgressBar, SectionLabel, StatCard } from "@/components/ui";
import { MonthlyBarChart } from "@/components/dashboard/monthly-bar-chart";
import { FinalidadePieChart } from "@/components/dashboard/finalidade-pie-chart";
import { UltimasContribuicoes } from "@/components/dashboard/ultimas-contribuicoes";
import { Sparkles, TrendingDown, TrendingUp } from "lucide-react";

export default async function DashboardIgrejaPage() {
  const sessao = await getSessao();
  const igrejaId = sessao!.igrejaId!;
  const igreja = (await getIgreja(igrejaId))!;
  const resumo = await getResumoFinanceiro(igrejaId);
  const taxasFieisMes = await getTaxasFieisMesAtual(igrejaId);
  const porTipo = await getContribuicoesPorTipo(igrejaId);
  const totaisMensais = await getTotaisPorMesDetalhado(igrejaId);
  const crescimento = await getCrescimentoMensal(igrejaId);
  const ultimas = await getUltimasContribuicoes(igrejaId, 5);
  const campanhasAtivas = (await getCampanhasDaIgreja(igrejaId)).filter((c) => !c.encerrada);
  const campanhas = await Promise.all(
    campanhasAtivas.map(async (c) => ({ ...c, arrecadado: await getArrecadadoCampanha(c.id) }))
  );

  const dadosPizza = [
    { nome: "Dízimo", valor: porTipo.dizimo },
    { nome: "Oferta", valor: porTipo.oferta },
    { nome: "Campanha", valor: porTipo.campanha },
    { nome: "Evento", valor: porTipo.evento },
    { nome: "Livre", valor: porTipo.livre },
  ];

  return (
    <div>
      <p className="mb-1 text-sm text-muted">Bem-vindo(a) de volta,</p>
      <h1 className="mb-6 text-2xl font-bold text-foreground">{igreja.nome}</h1>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <label className="flex flex-col justify-center gap-1 rounded-2xl border border-border bg-card px-4 py-3 sm:rounded-3xl sm:px-5 sm:py-4">
          <span className="text-xs font-bold text-muted">Filtros</span>
          <select className="bg-transparent text-sm font-medium text-foreground outline-none" defaultValue="mes">
            <option value="mes">Este mês</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="tudo">Desde o início</option>
          </select>
        </label>
        <label className="flex flex-col justify-center gap-1 rounded-2xl border border-border bg-card px-4 py-3 sm:rounded-3xl sm:px-5 sm:py-4">
          <span className="text-xs font-bold text-muted">Por campanha</span>
          <select className="bg-transparent text-sm font-medium text-foreground outline-none" defaultValue="todas">
            <option value="todas">Todas as campanhas</option>
          </select>
        </label>
        <div className="relative col-span-2 flex items-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-[#0047c9] px-5 py-4 text-white sm:rounded-3xl sm:px-6">
          <Sparkles className="absolute -right-2 -top-2 text-white/20" size={96} />
          <p className="relative text-lg font-bold">Banner de anúncio</p>
        </div>
      </div>

      <div className="mt-4">
        <Card>
          <SectionLabel>Geral</SectionLabel>
          <MonthlyBarChart dados={totaisMensais} />
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Card>
          <p className="text-sm text-muted">Arrecadado este mês</p>
          <p className="mt-2 text-xl font-bold text-foreground sm:text-2xl">
            {formatarMoeda(resumo.totalBrutoMesAtual)}
          </p>
          {crescimento.percentual !== null && (
            <Badge tone={crescimento.percentual >= 0 ? "success" : "warning"}>
              <span className="flex items-center gap-1">
                {crescimento.percentual >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {crescimento.percentual >= 0 ? "+" : ""}
                {crescimento.percentual}% vs. mês anterior
              </span>
            </Badge>
          )}
        </Card>
        <StatCard label="Taxa paga pelos fiéis este mês" value={formatarMoeda(taxasFieisMes)} />
        <StatCard label="Sua captação de campanhas" value={formatarMoeda(porTipo.campanha)} />
        <StatCard label="Sua captação de dízimo" value={formatarMoeda(porTipo.dizimo)} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionLabel>Captação por finalidade</SectionLabel>
          <FinalidadePieChart dados={dadosPizza} />
        </Card>
        <Card>
          <SectionLabel>Últimas contribuições</SectionLabel>
          <UltimasContribuicoes itens={ultimas} />
        </Card>
      </div>

      <p className="mt-4 text-xs text-muted">
        Sua igreja recebe 100% do que for arrecadado — a taxa de processamento é paga pelos fiéis, à parte.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/igreja/links">
          <Button>+ Novo link de pagamento</Button>
        </Link>
        <Link href="/igreja/campanhas">
          <Button variant="secondary">+ Nova campanha</Button>
        </Link>
        <Link href="/igreja/mural">
          <Button variant="secondary">+ Comunicado no mural</Button>
        </Link>
      </div>

      <div className="mt-10">
        <SectionLabel>Campanhas em captação</SectionLabel>
        {campanhas.length === 0 && <p className="text-muted">Nenhuma campanha ativa no momento.</p>}
        <div className="grid gap-4 sm:grid-cols-2">
          {campanhas.map((c) => {
            const arrecadado = c.arrecadado;
            const pct = (arrecadado / c.meta) * 100;
            return (
              <Card key={c.id}>
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-2xl">{c.imagemEmoji}</span>
                  <p className="font-bold">{c.titulo}</p>
                </div>
                <ProgressBar percentual={pct} />
                <p className="mt-2 text-sm text-muted">
                  {formatarMoeda(arrecadado)} de {formatarMoeda(c.meta)} ({pct.toFixed(0)}%)
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
