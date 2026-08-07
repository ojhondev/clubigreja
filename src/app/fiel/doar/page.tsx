import { getSessao } from "@/lib/auth/session";
import { getCampanha, getCampanhasDaIgreja } from "@/lib/mock-db";
import { Button, Card, PageHeader } from "@/components/ui";
import { SeletorValor } from "@/components/seletor-valor";
import { doarAction } from "./actions";
import type { TipoArrecadacao } from "@/lib/types";

const ROTULO_TIPO: Record<TipoArrecadacao, string> = {
  dizimo: "Dízimo",
  oferta: "Oferta",
  campanha: "Campanha",
  evento: "Evento",
  livre: "Contribuição livre",
};

export default async function DoarPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string; campanhaId?: string }>;
}) {
  const { tipo: tipoParam, campanhaId } = await searchParams;
  const sessao = await getSessao();
  const igrejaId = sessao!.igrejaId!;

  const campanha = campanhaId ? getCampanha(campanhaId) : undefined;
  const tipo: TipoArrecadacao = campanha ? "campanha" : (tipoParam as TipoArrecadacao) || "dizimo";
  const campanhas = getCampanhasDaIgreja(igrejaId).filter((c) => !c.encerrada);

  return (
    <div>
      <PageHeader title={campanha ? campanha.titulo : "Contribuir"} subtitle="Poucos toques, sem burocracia." />

      <Card>
        <form action={doarAction} className="space-y-5">
          {campanha && (
            <>
              <input type="hidden" name="tipo" value={tipo} />
              <input type="hidden" name="campanhaId" value={campanha.id} />
            </>
          )}

          {!campanha && (
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted">Finalidade</span>
              <select
                name="tipo"
                defaultValue={tipo}
                className="rounded-xl border border-border px-4 py-3"
              >
                <option value="dizimo">{ROTULO_TIPO.dizimo}</option>
                <option value="oferta">{ROTULO_TIPO.oferta}</option>
                <option value="livre">{ROTULO_TIPO.livre}</option>
              </select>
            </label>
          )}
          {!campanha && campanhas.length > 0 && (
            <p className="text-xs text-muted">
              Quer contribuir com uma campanha específica? Acesse a campanha em{" "}
              <span className="font-medium">Campanhas</span> e use o botão de contribuir por lá.
            </p>
          )}

          <SeletorValor />

          <fieldset>
            <legend className="mb-2 text-sm font-medium text-muted">Como você quer pagar?</legend>
            <div className="flex gap-3">
              <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-primary bg-[#EAF6FF] px-4 py-3 font-bold text-primary has-[:checked]:bg-[#D6EFFF]">
                <input type="radio" name="meio" value="pix" defaultChecked className="accent-primary" />
                Pix
              </label>
              <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-border px-4 py-3 font-bold text-muted has-[:checked]:border-primary has-[:checked]:text-primary">
                <input type="radio" name="meio" value="cartao" className="accent-primary" />
                Cartão
              </label>
            </div>
          </fieldset>

          <Button type="submit" className="w-full">
            Confirmar contribuição
          </Button>
        </form>
      </Card>
    </div>
  );
}
