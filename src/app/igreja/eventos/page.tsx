import { getSessao } from "@/lib/auth/session";
import { getEventosDaIgreja } from "@/lib/db/repo";
import { Badge, Button, Card, PageHeader } from "@/components/ui";
import { formatarData } from "@/lib/formato";
import { criarEventoAction } from "./actions";

export default async function EventosPage() {
  const sessao = await getSessao();
  const eventos = await getEventosDaIgreja(sessao!.igrejaId!);

  return (
    <div>
      <PageHeader
        title="Eventos"
        subtitle="Eventos da igreja, com ou sem arrecadação vinculada."
      />

      <Card className="mb-8">
        <h2 className="mb-4 font-bold">Novo evento</h2>
        <form action={criarEventoAction} className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm font-bold text-muted">Título</span>
            <input
              name="titulo"
              required
              placeholder="Ex.: Culto de Ação de Graças"
              className="rounded-xl border border-border px-4 py-3"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-bold text-muted">Data</span>
            <input
              name="data"
              type="date"
              required
              className="rounded-xl border border-border px-4 py-3"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-bold text-muted">Local</span>
            <input
              name="local"
              required
              placeholder="Templo sede"
              className="rounded-xl border border-border px-4 py-3"
            />
          </label>
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm font-bold text-muted">Descrição</span>
            <textarea
              name="descricao"
              rows={2}
              className="rounded-xl border border-border px-4 py-3"
            />
          </label>
          <label className="flex items-center gap-2 sm:col-span-2">
            <input
              type="checkbox"
              name="arrecadacaoVinculada"
              className="h-4 w-4 accent-primary"
            />
            <span className="text-sm font-medium text-muted">
              Vincular arrecadação a este evento
            </span>
          </label>
          <div className="sm:col-span-2">
            <Button type="submit">Criar evento</Button>
          </div>
        </form>
      </Card>

      <div className="space-y-3">
        {eventos.map((e) => (
          <Card key={e.id}>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <p className="font-bold">{e.titulo}</p>
              {e.arrecadacaoVinculada && (
                <Badge tone="success">Arrecadação ativa</Badge>
              )}
            </div>
            <p className="text-sm text-muted">
              {formatarData(e.data, {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}{" "}
              · {e.local}
            </p>
            <p className="mt-2 text-sm">{e.descricao}</p>
          </Card>
        ))}
        {eventos.length === 0 && (
          <p className="text-muted">Nenhum evento cadastrado ainda.</p>
        )}
      </div>
    </div>
  );
}
