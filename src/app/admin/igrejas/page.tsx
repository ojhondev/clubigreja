import { getSessao } from "@/lib/auth/session";
import { getTodasIgrejas, getWebmasterPorId } from "@/lib/db/repo";
import { getResumoFinanceiro } from "@/lib/relatorios";
import { formatarMoeda } from "@/lib/comissao";
import { Badge, Button, Card, PageHeader, SectionLabel } from "@/components/ui";
import {
  acessarComoIgrejaAction,
  aprovarIgrejaAction,
  editarChavePixAction,
  reprovarIgrejaAction,
} from "./actions";

const ROTULO_STATUS: Record<string, string> = {
  pendente: "Pendente",
  em_analise: "Em análise",
  aprovado: "Aprovado",
  reprovado: "Reprovado",
};

export default async function IgrejasAdminPage() {
  const sessao = await getSessao();
  const webmaster =
    sessao?.papel === "webmaster"
      ? await getWebmasterPorId(sessao.usuarioId)
      : undefined;
  const podeAprovar = webmaster
    ? webmaster.nivel === "primario" || webmaster.podeAprovarIgrejas
    : false;
  const podeGerenciarPagamentos = webmaster
    ? webmaster.nivel === "primario" || webmaster.podeGerenciarPagamentos
    : false;

  const igrejas = await getTodasIgrejas();
  const resumoPorIgreja = new Map(
    await Promise.all(
      igrejas.map(
        async (i) => [i.id, await getResumoFinanceiro(i.id)] as const,
      ),
    ),
  );
  const gmvTotal = [...resumoPorIgreja.values()].reduce(
    (soma, r) => soma + r.totalBruto,
    0,
  );
  const receitaTotal = [...resumoPorIgreja.values()].reduce(
    (soma, r) => soma + r.totalTaxasFieis,
    0,
  );
  const pendentes = igrejas.filter(
    (i) =>
      i.statusOnboarding === "em_analise" || i.statusOnboarding === "pendente",
  );
  const demais = igrejas
    .filter(
      (i) =>
        i.statusOnboarding === "aprovado" || i.statusOnboarding === "reprovado",
    )
    .map((igreja) => ({ igreja, resumo: resumoPorIgreja.get(igreja.id)! }));

  return (
    <div>
      <PageHeader
        title="Igrejas na plataforma"
        subtitle="Visão consolidada de GMV e taxa de processamento paga pelos fiéis."
      />

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
          <p className="text-sm text-muted">Receita do Dizipay</p>
          <p className="mt-1 text-2xl font-bold text-success">
            {formatarMoeda(receitaTotal)}
          </p>
        </Card>
      </div>

      {pendentes.length > 0 && (
        <div className="mb-8">
          <SectionLabel>
            Pendentes de aprovação ({pendentes.length})
          </SectionLabel>
          <div className="space-y-3">
            {pendentes.map((igreja) => (
              <Card key={igreja.id} className="flex flex-col gap-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{igreja.logoEmoji}</span>
                    <div>
                      <p className="font-bold">{igreja.nome}</p>
                      <p className="text-sm text-muted">
                        {igreja.cidade}/{igreja.uf} · CNPJ {igreja.cnpj} ·
                        Responsável: {igreja.responsavelNome} (
                        {igreja.responsavelEmail})
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <form
                      action={acessarComoIgrejaAction}
                      className="flex-1 sm:flex-none"
                    >
                      <input type="hidden" name="igrejaId" value={igreja.id} />
                      <Button
                        type="submit"
                        variant="secondary"
                        className="w-full"
                      >
                        Acessar como igreja
                      </Button>
                    </form>
                    {podeAprovar && (
                      <>
                        <form
                          action={reprovarIgrejaAction}
                          className="flex-1 sm:flex-none"
                        >
                          <input
                            type="hidden"
                            name="igrejaId"
                            value={igreja.id}
                          />
                          <Button
                            type="submit"
                            variant="secondary"
                            className="w-full"
                          >
                            Reprovar
                          </Button>
                        </form>
                        <form
                          action={aprovarIgrejaAction}
                          className="flex-1 sm:flex-none"
                        >
                          <input
                            type="hidden"
                            name="igrejaId"
                            value={igreja.id}
                          />
                          <Button type="submit" className="w-full">
                            Aprovar
                          </Button>
                        </form>
                      </>
                    )}
                  </div>
                </div>
                {podeGerenciarPagamentos && (
                  <FormChavePix
                    igrejaId={igreja.id}
                    chavePix={igreja.chavePix}
                  />
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      <SectionLabel>Todas as igrejas</SectionLabel>
      <div className="space-y-3">
        {demais.map(({ igreja, resumo }) => {
          return (
            <Card key={igreja.id} className="flex flex-col gap-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{igreja.logoEmoji}</span>
                  <div>
                    <p className="font-bold">{igreja.nome}</p>
                    <p className="text-sm text-muted">
                      {igreja.cidade}/{igreja.uf} · CNPJ {igreja.cnpj}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2 sm:items-end">
                  <div className="sm:text-right">
                    <Badge
                      tone={
                        igreja.statusOnboarding === "aprovado"
                          ? "success"
                          : "warning"
                      }
                    >
                      {ROTULO_STATUS[igreja.statusOnboarding]}
                    </Badge>
                    <p className="mt-1 text-sm font-medium">
                      {formatarMoeda(resumo.totalBruto)} arrecadados
                    </p>
                  </div>
                  <form action={acessarComoIgrejaAction}>
                    <input type="hidden" name="igrejaId" value={igreja.id} />
                    <Button type="submit" variant="secondary">
                      Acessar como igreja
                    </Button>
                  </form>
                </div>
              </div>
              {podeGerenciarPagamentos && (
                <FormChavePix igrejaId={igreja.id} chavePix={igreja.chavePix} />
              )}
            </Card>
          );
        })}
        {demais.length === 0 && (
          <p className="text-muted">
            Nenhuma igreja aprovada ou reprovada ainda.
          </p>
        )}
      </div>
    </div>
  );
}

function FormChavePix({
  igrejaId,
  chavePix,
}: {
  igrejaId: string;
  chavePix: string;
}) {
  return (
    <form
      action={editarChavePixAction}
      className="flex flex-col gap-2 border-t border-border pt-3 sm:flex-row sm:items-center"
    >
      <input type="hidden" name="igrejaId" value={igrejaId} />
      <label className="flex flex-1 flex-col gap-1">
        <span className="text-xs font-bold text-muted">
          Chave Pix da igreja
        </span>
        <input
          name="chavePix"
          defaultValue={chavePix}
          className="rounded-xl border border-border px-3 py-2 text-sm"
        />
      </label>
      <Button type="submit" variant="secondary" className="sm:mt-5">
        Salvar chave Pix
      </Button>
    </form>
  );
}
