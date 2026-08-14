import Link from "next/link";
import { getSessao } from "@/lib/auth/session";
import { getArrecadadoCampanha, getCampanhasDaIgreja } from "@/lib/db/repo";
import { formatarMoeda } from "@/lib/comissao";
import { Badge, Button, Card, PageHeader, ProgressBar } from "@/components/ui";

export default async function CampanhasFielPage() {
  const sessao = await getSessao();
  const campanhasAtivas = (
    await getCampanhasDaIgreja(sessao!.igrejaId!)
  ).filter((c) => !c.encerrada);
  const campanhas = await Promise.all(
    campanhasAtivas.map(async (c) => ({
      ...c,
      arrecadado: await getArrecadadoCampanha(c.id),
    })),
  );

  return (
    <div>
      <PageHeader title="Campanhas em captação" />
      <div className="space-y-4">
        {campanhas.map((c, i) => {
          const arrecadado = c.arrecadado;
          const pct = (arrecadado / c.meta) * 100;
          return (
            <Card key={c.id}>
              <div className="mb-2 flex items-center gap-2">
                <span className="text-2xl">{c.imagemEmoji}</span>
                <p className="font-bold">{c.titulo}</p>
                {i === 0 && <Badge tone="accent">Destaque</Badge>}
              </div>
              <p className="mb-3 text-sm text-muted">{c.descricao}</p>
              <ProgressBar percentual={pct} />
              <p className="mt-2 mb-4 text-sm text-muted">
                {formatarMoeda(arrecadado)} de {formatarMoeda(c.meta)} (
                {pct.toFixed(0)}%)
              </p>
              <Link href={`/fiel/doar?campanhaId=${c.id}`}>
                <Button className="w-full">Contribuir com esta campanha</Button>
              </Link>
            </Card>
          );
        })}
        {campanhas.length === 0 && (
          <p className="text-muted">Nenhuma campanha em captação no momento.</p>
        )}
      </div>
    </div>
  );
}
