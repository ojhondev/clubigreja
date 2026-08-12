import { getSessao } from "@/lib/auth/session";
import { getArrecadadoCampanha, getCampanhasDaIgreja, getIgreja } from "@/lib/db/repo";
import { formatarMoeda } from "@/lib/comissao";
import { urlAbsoluta } from "@/lib/qrcode";
import { Card, PageHeader, ProgressBar } from "@/components/ui";
import { CompartilharCampanha } from "@/components/compartilhar-campanha";

export default async function CompartilharPage() {
  const sessao = await getSessao();
  const igreja = (await getIgreja(sessao!.igrejaId!))!;
  const campanhasAtivas = (await getCampanhasDaIgreja(igreja.id)).filter((c) => !c.encerrada);
  const origem = await urlAbsoluta("");
  const campanhas = await Promise.all(
    campanhasAtivas.map(async (c) => ({ ...c, arrecadado: await getArrecadadoCampanha(c.id) }))
  );

  return (
    <div>
      <PageHeader
        title="Compartilhar campanha"
        subtitle="Ajude a espalhar a palavra — cada compartilhamento aumenta o alcance da campanha."
      />
      <div className="space-y-4">
        {campanhas.map((c) => {
          const arrecadado = c.arrecadado;
          const pct = (arrecadado / c.meta) * 100;
          const url = `${origem}/doar/campanha/${c.id}`;
          return (
            <Card key={c.id}>
              <div className="mb-2 flex items-center gap-2">
                <span className="text-2xl">{c.imagemEmoji}</span>
                <p className="font-bold">{c.titulo}</p>
              </div>
              <ProgressBar percentual={pct} />
              <p className="mt-2 mb-4 text-sm text-muted">
                {formatarMoeda(arrecadado)} de {formatarMoeda(c.meta)} ({pct.toFixed(0)}%)
              </p>
              <CompartilharCampanha titulo={c.titulo} igrejaNome={igreja.nome} url={url} />
            </Card>
          );
        })}
        {campanhas.length === 0 && <p className="text-muted">Nenhuma campanha em captação no momento.</p>}
      </div>
    </div>
  );
}
