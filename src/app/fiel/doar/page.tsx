import { getSessao } from "@/lib/auth/session";
import { getCampanha, getCampanhasDaIgreja, getFiel } from "@/lib/db/repo";
import { Card, PageHeader } from "@/components/ui";
import { SeletorValor } from "@/components/seletor-valor";
import { CampoFinalidadeEValor } from "@/components/campo-finalidade-valor";
import { CartaoTaxa } from "@/components/cartao-taxa";
import { BotaoContinuarPix } from "@/components/botao-continuar-pix";
import { iniciarDoacaoAction } from "./actions";
import type { TipoArrecadacao } from "@/lib/types";

export default async function DoarPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string; campanhaId?: string }>;
}) {
  const { tipo: tipoParam, campanhaId } = await searchParams;
  const sessao = await getSessao();
  const igrejaId = sessao!.igrejaId!;
  const fiel = await getFiel(sessao!.usuarioId);

  // Escopado à própria igreja — sem isso, um campanhaId de outra igreja na
  // query string faria essa tela mostrar (e a action tentar usar) uma
  // campanha alheia.
  const campanha = campanhaId
    ? await getCampanha(campanhaId, igrejaId)
    : undefined;
  const tipo: TipoArrecadacao = campanha
    ? "campanha"
    : (tipoParam as TipoArrecadacao) || "dizimo";
  const campanhas = (await getCampanhasDaIgreja(igrejaId)).filter(
    (c) => !c.encerrada,
  );

  return (
    <div>
      <PageHeader
        title={campanha ? campanha.titulo : "Contribuir"}
        subtitle="Poucos toques, sem burocracia."
      />

      <Card>
        <form action={iniciarDoacaoAction} className="space-y-5">
          {campanha && (
            <>
              <input type="hidden" name="tipo" value={tipo} />
              <input type="hidden" name="campanhaId" value={campanha.id} />
              <SeletorValor tipo={tipo} />
            </>
          )}

          {!campanha && (
            <>
              {campanhas.length > 0 && (
                <p className="text-xs text-muted">
                  Quer contribuir com uma campanha específica? Acesse a campanha
                  em <span className="font-medium">Campanhas</span> e use o
                  botão de contribuir por lá.
                </p>
              )}
              <CampoFinalidadeEValor tipoInicial={tipo} />
            </>
          )}

          <CartaoTaxa cartaoSalvo={fiel?.cartaoSalvo} />

          <BotaoContinuarPix />
        </form>
      </Card>
    </div>
  );
}
