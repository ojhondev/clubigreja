import { igrejas } from "@/lib/mock-db";
import { getResumoFinanceiro } from "@/lib/relatorios";
import { formatarMoeda } from "@/lib/comissao";
import { Badge, Button, Card, PageHeader, SectionLabel } from "@/components/ui";
import { aprovarIgrejaAction, reprovarIgrejaAction } from "./actions";

const ROTULO_STATUS: Record<string, string> = {
  pendente: "Pendente",
  em_analise: "Em análise",
  aprovado: "Aprovado",
  reprovado: "Reprovado",
};

export default function IgrejasAdminPage() {
  const gmvTotal = igrejas.reduce((soma, i) => soma + getResumoFinanceiro(i.id).totalBruto, 0);
  const comissaoTotal = igrejas.reduce((soma, i) => soma + getResumoFinanceiro(i.id).totalComissao, 0);
  const pendentes = igrejas.filter((i) => i.statusOnboarding === "em_analise" || i.statusOnboarding === "pendente");
  const demais = igrejas.filter((i) => i.statusOnboarding === "aprovado" || i.statusOnboarding === "reprovado");

  return (
    <div>
      <PageHeader title="Igrejas na plataforma" subtitle="Visão consolidada de GMV e comissão retida." />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-muted">Igrejas cadastradas</p>
          <p className="mt-1 text-2xl font-bold">{igrejas.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">GMV total processado</p>
          <p className="mt-1 text-2xl font-bold">{formatarMoeda(gmvTotal)}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Receita do Club Igreja</p>
          <p className="mt-1 text-2xl font-bold text-success">{formatarMoeda(comissaoTotal)}</p>
        </Card>
      </div>

      {pendentes.length > 0 && (
        <div className="mb-8">
          <SectionLabel>Pendentes de aprovação ({pendentes.length})</SectionLabel>
          <div className="space-y-3">
            {pendentes.map((igreja) => (
              <Card key={igreja.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{igreja.logoEmoji}</span>
                  <div>
                    <p className="font-bold">{igreja.nome}</p>
                    <p className="text-sm text-muted">
                      {igreja.cidade}/{igreja.uf} · CNPJ {igreja.cnpj} · Responsável: {igreja.responsavelNome} (
                      {igreja.responsavelEmail})
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <form action={reprovarIgrejaAction} className="flex-1 sm:flex-none">
                    <input type="hidden" name="igrejaId" value={igreja.id} />
                    <Button type="submit" variant="secondary" className="w-full">
                      Reprovar
                    </Button>
                  </form>
                  <form action={aprovarIgrejaAction} className="flex-1 sm:flex-none">
                    <input type="hidden" name="igrejaId" value={igreja.id} />
                    <Button type="submit" className="w-full">
                      Aprovar
                    </Button>
                  </form>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <SectionLabel>Todas as igrejas</SectionLabel>
      <div className="space-y-3">
        {demais.map((igreja) => {
          const resumo = getResumoFinanceiro(igreja.id);
          return (
            <Card key={igreja.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{igreja.logoEmoji}</span>
                <div>
                  <p className="font-bold">{igreja.nome}</p>
                  <p className="text-sm text-muted">
                    {igreja.cidade}/{igreja.uf} · CNPJ {igreja.cnpj}
                  </p>
                </div>
              </div>
              <div className="sm:text-right">
                <Badge tone={igreja.statusOnboarding === "aprovado" ? "success" : "warning"}>
                  {ROTULO_STATUS[igreja.statusOnboarding]}
                </Badge>
                <p className="mt-1 text-sm font-medium">{formatarMoeda(resumo.totalBruto)} arrecadados</p>
              </div>
            </Card>
          );
        })}
        {demais.length === 0 && <p className="text-muted">Nenhuma igreja aprovada ou reprovada ainda.</p>}
      </div>
    </div>
  );
}
