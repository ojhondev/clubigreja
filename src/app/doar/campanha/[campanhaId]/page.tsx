import { notFound } from "next/navigation";
import { getArrecadadoCampanha, getCampanha, getFiel, getIgreja } from "@/lib/mock-db";
import { getSessao } from "@/lib/auth/session";
import { formatarMoeda } from "@/lib/comissao";
import { Card, ProgressBar } from "@/components/ui";
import { SeletorValor } from "@/components/seletor-valor";
import { CartaoTaxa } from "@/components/cartao-taxa";
import { BotaoContinuarPix } from "@/components/botao-continuar-pix";
import { doarCampanhaPublicoAction } from "./actions";

export default async function CampanhaPublicaPage({ params }: { params: Promise<{ campanhaId: string }> }) {
  const { campanhaId } = await params;
  const campanha = getCampanha(campanhaId);
  if (!campanha || campanha.encerrada) notFound();

  const igreja = getIgreja(campanha.igrejaId)!;
  const arrecadado = getArrecadadoCampanha(campanha.id);
  const pct = (arrecadado / campanha.meta) * 100;

  // Se o fiel já está logado, ele não precisa dizer quem é nem recadastrar
  // cartão — já sabemos e já temos o cartão salvo dele.
  const sessao = await getSessao();
  const fielLogado = sessao?.papel === "fiel" ? getFiel(sessao.usuarioId) : undefined;

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

          <SeletorValor tipo="campanha" />

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
