import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSessao } from "@/lib/auth/session";
import { getWebmasterPorId, getTodosMembrosWebmaster } from "@/lib/db/repo";
import { Badge, Card, PageHeader, SectionLabel } from "@/components/ui";
import { atualizarPermissoesWebmasterAction } from "./actions";
import { FormConvidarWebmaster } from "./form";

export default async function EquipeWebmasterPage() {
  const sessao = await getSessao();
  const webmaster =
    sessao?.papel === "webmaster"
      ? await getWebmasterPorId(sessao.usuarioId)
      : undefined;
  if (!webmaster || webmaster.nivel !== "primario") {
    redirect("/admin/igrejas");
  }

  const membros = await getTodosMembrosWebmaster();
  const cabecalhos = await headers();
  const origem = `${cabecalhos.get("x-forwarded-proto") ?? "https"}://${cabecalhos.get("host")}`;

  return (
    <div>
      <PageHeader
        title="Equipe Dizipay"
        subtitle="Convide masters secundários e controle o que cada um pode fazer no painel interno."
      />

      <div className="mb-8">
        <SectionLabel>Convidar novo membro</SectionLabel>
        <Card>
          <FormConvidarWebmaster />
        </Card>
      </div>

      <SectionLabel>Membros ({membros.length})</SectionLabel>
      <div className="space-y-3">
        {membros.map((membro) => (
          <Card key={membro.id} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold">
                  {membro.nome}
                  {membro.id === webmaster.id && (
                    <span className="ml-2 text-xs font-normal text-muted">
                      (você)
                    </span>
                  )}
                </p>
                <p className="text-sm text-muted">{membro.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  tone={membro.nivel === "primario" ? "accent" : "neutral"}
                >
                  {membro.nivel === "primario"
                    ? "Master Primário"
                    : "Master Secundário"}
                </Badge>
                {membro.pendente && (
                  <Badge tone="warning">Convite pendente</Badge>
                )}
              </div>
            </div>

            {membro.nivel === "primario" ? (
              <p className="text-sm text-muted">
                Acesso total — não é possível restringir o Master Primário.
              </p>
            ) : (
              <form
                action={atualizarPermissoesWebmasterAction}
                className="flex flex-col gap-3 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <input type="hidden" name="id" value={membro.id} />
                <div className="flex flex-wrap gap-4 text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="podeGerenciarPagamentos"
                      defaultChecked={membro.podeGerenciarPagamentos}
                      className="h-4 w-4"
                    />
                    Gerenciar pagamentos (sacar, editar chave Pix)
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="podeAprovarIgrejas"
                      defaultChecked={membro.podeAprovarIgrejas}
                      className="h-4 w-4"
                    />
                    Aprovar/reprovar igrejas
                  </label>
                </div>
                <button
                  type="submit"
                  className="text-sm font-bold text-primary hover:underline"
                >
                  Salvar
                </button>
              </form>
            )}

            {membro.pendente && membro.conviteToken && (
              <div className="rounded-xl bg-[#EAF6FF] px-3 py-2 text-xs text-muted">
                Link de convite:{" "}
                <span className="break-all font-mono">
                  {origem}/webmaster/convite/{membro.conviteToken}
                </span>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
