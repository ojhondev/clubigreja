import { notFound } from "next/navigation";
import { getArrecadadoCampanha, getCampanha, getIgreja } from "@/lib/mock-db";
import { formatarMoeda } from "@/lib/comissao";
import { Button, Card, ProgressBar } from "@/components/ui";
import { SeletorValor } from "@/components/seletor-valor";
import { doarCampanhaPublicoAction } from "./actions";

export default async function CampanhaPublicaPage({ params }: { params: Promise<{ campanhaId: string }> }) {
  const { campanhaId } = await params;
  const campanha = getCampanha(campanhaId);
  if (!campanha || campanha.encerrada) notFound();

  const igreja = getIgreja(campanha.igrejaId)!;
  const arrecadado = getArrecadadoCampanha(campanha.id);
  const pct = (arrecadado / campanha.meta) * 100;

  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-6 py-10">
      <div className="mb-6 text-center">
        <div className="mb-2 text-4xl">{igreja.logoEmoji}</div>
        <p className="text-sm text-muted">{igreja.nome}</p>
        <h1 className="mt-1 text-xl font-bold">
          {campanha.imagemEmoji} {campanha.titulo}
        </h1>
        <p className="mt-1 text-sm text-muted">{campanha.descricao}</p>
      </div>

      <Card className="mb-4">
        <ProgressBar percentual={pct} />
        <p className="mt-2 text-sm font-medium">
          {formatarMoeda(arrecadado)} de {formatarMoeda(campanha.meta)} ({pct.toFixed(0)}%)
        </p>
      </Card>

      <Card className="overflow-visible">
        <form action={doarCampanhaPublicoAction} className="space-y-5">
          <input type="hidden" name="campanhaId" value={campanha.id} />

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted">Seu nome</span>
            <input
              name="nome"
              required
              placeholder="Como podemos te chamar?"
              className="rounded-xl border border-border px-4 py-3"
            />
          </label>

          <SeletorValor />

          <fieldset>
            <legend className="mb-2 text-sm font-medium text-muted">Como você quer pagar?</legend>
            <div className="flex gap-3">
              <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-primary bg-[#EAF6FF] px-4 py-3 font-bold text-primary">
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
            Contribuir agora
          </Button>
        </form>
      </Card>

      <p className="mt-4 text-center text-xs text-muted">
        Processado com segurança pelo Club Igreja — dclubigreja.com
      </p>
    </div>
  );
}
