import { notFound } from "next/navigation";
import { getIgreja, linksPagamento } from "@/lib/mock-db";
import { Button, Card } from "@/components/ui";
import { SeletorValor } from "@/components/seletor-valor";
import { doarPublicoAction } from "./actions";

const ROTULO_TIPO: Record<string, string> = {
  dizimo: "Dízimo",
  oferta: "Oferta",
  campanha: "Campanha",
  evento: "Evento",
  livre: "Contribuição livre",
};

export default async function LinkPublicoPage({ params }: { params: Promise<{ linkId: string }> }) {
  const { linkId } = await params;
  const link = linksPagamento.find((l) => l.id === linkId && l.ativo);
  if (!link) notFound();

  const igreja = getIgreja(link.igrejaId)!;

  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-6 py-10">
      <div className="mb-6 text-center">
        <div className="mb-2 text-4xl">{igreja.logoEmoji}</div>
        <p className="text-sm text-muted">{igreja.nome}</p>
        <h1 className="mt-1 text-xl font-bold">{link.titulo}</h1>
        <p className="text-sm text-muted">{ROTULO_TIPO[link.tipo]}</p>
      </div>

      <Card>
        <form action={doarPublicoAction} className="space-y-5">
          <input type="hidden" name="linkId" value={link.id} />

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted">Seu nome</span>
            <input
              name="nome"
              required
              placeholder="Como podemos te chamar?"
              className="rounded-xl border border-border px-4 py-3"
            />
          </label>

          <SeletorValor valorInicial={link.valorSugerido ?? undefined} />

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
