import { getSessao } from "@/lib/auth/session";
import { getMuralDaIgreja } from "@/lib/mock-db";
import { Button, Card, PageHeader } from "@/components/ui";
import { formatarData } from "@/lib/formato";
import { publicarComunicado } from "./actions";

export default async function MuralIgrejaPage() {
  const sessao = await getSessao();
  const comunicados = getMuralDaIgreja(sessao!.igrejaId!);

  return (
    <div>
      <PageHeader title="Mural da igreja" subtitle="O que você publicar aqui aparece na tela inicial do fiel." />

      <Card className="mb-8">
        <h2 className="mb-4 font-bold">Novo comunicado</h2>
        <form action={publicarComunicado} className="grid gap-4 sm:grid-cols-[80px_1fr]">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted">Emoji</span>
            <input name="emoji" defaultValue="📣" className="rounded-xl border border-border px-4 py-3 text-center text-xl" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted">Título</span>
            <input name="titulo" required className="rounded-xl border border-border px-4 py-3" />
          </label>
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm font-medium text-muted">Mensagem</span>
            <textarea name="corpo" required rows={3} className="rounded-xl border border-border px-4 py-3" />
          </label>
          <div className="sm:col-span-2">
            <Button type="submit">Publicar no mural</Button>
          </div>
        </form>
      </Card>

      <div className="space-y-3">
        {comunicados.map((c) => (
          <Card key={c.id} className="flex gap-3">
            <span className="text-2xl">{c.emoji}</span>
            <div>
              <p className="font-bold">{c.titulo}</p>
              <p className="text-sm text-muted">{c.corpo}</p>
              <p className="mt-1 text-xs text-muted">{formatarData(c.publicadoEm)}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
