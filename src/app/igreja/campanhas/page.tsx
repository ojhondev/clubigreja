import { getSessao } from "@/lib/auth/session";
import { getArrecadadoCampanha, getCampanhasDaIgreja } from "@/lib/db/repo";
import { Button, Card, PageHeader } from "@/components/ui";
import { InputMoeda } from "@/components/input-moeda";
import { CampanhaCardIgreja } from "@/components/campanha-card-igreja";
import { criarCampanhaAction } from "./actions";

export default async function CampanhasPage() {
  const sessao = await getSessao();
  const campanhasBrutas = await getCampanhasDaIgreja(sessao!.igrejaId!);
  const campanhas = await Promise.all(
    campanhasBrutas.map(async (c) => ({
      ...c,
      arrecadado: await getArrecadadoCampanha(c.id),
    })),
  );

  return (
    <div>
      <PageHeader
        title="Campanhas de captação"
        subtitle="Defina uma meta e um prazo — o progresso aparece automaticamente para os fiéis."
      />

      <Card className="mb-8">
        <h2 className="mb-4 font-bold">Criar nova campanha</h2>
        <form
          action={criarCampanhaAction}
          className="grid gap-4 sm:grid-cols-2"
        >
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm font-medium text-muted">Título</span>
            <input
              name="titulo"
              required
              placeholder="Ex.: Reforma do templo"
              className="rounded-xl border border-border px-4 py-3"
            />
          </label>
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm font-medium text-muted">Descrição</span>
            <textarea
              name="descricao"
              rows={2}
              className="rounded-xl border border-border px-4 py-3"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted">Meta (R$)</span>
            <InputMoeda
              name="meta"
              required
              placeholder="10.000"
              className="rounded-xl border border-border px-4 py-3"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted">Prazo</span>
            <input
              name="prazo"
              type="date"
              required
              className="rounded-xl border border-border px-4 py-3"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted">
              Emoji de destaque
            </span>
            <input
              name="imagemEmoji"
              defaultValue="🙏"
              className="rounded-xl border border-border px-4 py-3"
            />
          </label>
          <div className="sm:col-span-2">
            <Button type="submit">Criar campanha</Button>
          </div>
        </form>
      </Card>

      <div className="space-y-4">
        {campanhas.map((c) => (
          <CampanhaCardIgreja
            key={c.id}
            campanha={c}
            arrecadado={c.arrecadado}
          />
        ))}
        {campanhas.length === 0 && (
          <p className="text-muted">Nenhuma campanha criada ainda.</p>
        )}
      </div>
    </div>
  );
}
