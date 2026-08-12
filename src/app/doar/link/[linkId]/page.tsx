import { notFound } from "next/navigation";
import { getFiel, getIgreja, getLinkPagamento } from "@/lib/db/repo";
import { getFielConvidadoId, getSessao } from "@/lib/auth/session";
import { Card } from "@/components/ui";
import { SeletorValor } from "@/components/seletor-valor";
import { CartaoTaxa } from "@/components/cartao-taxa";
import { BotaoContinuarPix } from "@/components/botao-continuar-pix";
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
  const link = await getLinkPagamento(linkId);
  if (!link || !link.ativo) notFound();

  const igreja = (await getIgreja(link.igrejaId))!;

  const sessao = await getSessao();
  let fielLogado = sessao?.papel === "fiel" ? await getFiel(sessao.usuarioId) : undefined;
  if (!fielLogado) {
    const convidadoId = await getFielConvidadoId();
    const convidado = convidadoId ? await getFiel(convidadoId) : undefined;
    if (convidado?.igrejaId === link.igrejaId) fielLogado = convidado;
  }

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

          {!fielLogado && (
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted">Seu nome</span>
              <input
                name="nome"
                required
                placeholder="Como podemos te chamar?"
                className="rounded-xl border border-border px-4 py-3"
              />
            </label>
          )}

          <SeletorValor valorInicial={link.valorSugerido ?? undefined} tipo={link.tipo} />

          <CartaoTaxa cartaoSalvo={fielLogado?.cartaoSalvo} />

          <BotaoContinuarPix />
        </form>
      </Card>

      <p className="mt-4 text-center text-xs text-muted">
        Processado com segurança pelo Dizipay — dclubigreja.com
      </p>
    </div>
  );
}
