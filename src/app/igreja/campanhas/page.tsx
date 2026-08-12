import Link from "next/link";
import { QrCode } from "lucide-react";
import { getSessao } from "@/lib/auth/session";
import { getArrecadadoCampanha, getCampanhasDaIgreja } from "@/lib/db/repo";
import { formatarMoeda } from "@/lib/comissao";
import { Badge, Button, Card, PageHeader, ProgressBar } from "@/components/ui";
import { formatarData } from "@/lib/formato";
import { criarCampanhaAction } from "./actions";

export default async function CampanhasPage() {
  const sessao = await getSessao();
  const campanhasBrutas = await getCampanhasDaIgreja(sessao!.igrejaId!);
  const campanhas = await Promise.all(
    campanhasBrutas.map(async (c) => ({ ...c, arrecadado: await getArrecadadoCampanha(c.id) }))
  );

  return (
    <div>
      <PageHeader
        title="Campanhas de captação"
        subtitle="Defina uma meta e um prazo — o progresso aparece automaticamente para os fiéis."
      />

      <Card className="mb-8">
        <h2 className="mb-4 font-bold">Criar nova campanha</h2>
        <form action={criarCampanhaAction} className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm font-medium text-muted">Título</span>
            <input name="titulo" required placeholder="Ex.: Reforma do templo" className="rounded-xl border border-border px-4 py-3" />
          </label>
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm font-medium text-muted">Descrição</span>
            <textarea name="descricao" rows={2} className="rounded-xl border border-border px-4 py-3" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted">Meta (R$)</span>
            <input name="meta" type="number" min="1" step="0.01" required className="rounded-xl border border-border px-4 py-3" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted">Prazo</span>
            <input name="prazo" type="date" required className="rounded-xl border border-border px-4 py-3" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted">Emoji de destaque</span>
            <input name="imagemEmoji" defaultValue="🙏" className="rounded-xl border border-border px-4 py-3" />
          </label>
          <div className="sm:col-span-2">
            <Button type="submit">Criar campanha</Button>
          </div>
        </form>
      </Card>

      <div className="space-y-4">
        {campanhas.map((c) => {
          const arrecadado = c.arrecadado;
          const pct = (arrecadado / c.meta) * 100;
          return (
            <Card key={c.id}>
              <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{c.imagemEmoji}</span>
                  <div>
                    <p className="font-bold">{c.titulo}</p>
                    <p className="text-sm text-muted">Prazo: {formatarData(c.prazo)}</p>
                  </div>
                </div>
                {c.encerrada ? <Badge>Encerrada</Badge> : <Badge tone="success">Em captação</Badge>}
              </div>
              <p className="mb-3 text-sm text-muted">{c.descricao}</p>
              <ProgressBar percentual={pct} />
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium">
                  {formatarMoeda(arrecadado)} de {formatarMoeda(c.meta)} ({pct.toFixed(0)}%)
                </p>
                <Link href={`/igreja/campanhas/${c.id}/qrcode`}>
                  <Button variant="secondary" className="w-full sm:w-auto">
                    <QrCode size={18} />
                    QR Code
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
