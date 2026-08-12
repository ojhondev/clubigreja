import { getTodosFieis, getTodasIgrejas } from "@/lib/db/repo";
import { Button, Card, PageHeader } from "@/components/ui";
import { acessarComoFielAction } from "./actions";

export default async function FieisAdminPage() {
  const [fieis, igrejas] = await Promise.all([getTodosFieis(), getTodasIgrejas()]);
  const igrejaPorId = new Map(igrejas.map((i) => [i.id, i]));

  return (
    <div>
      <PageHeader title="Fiéis na plataforma" subtitle="Acesse a conta de qualquer fiel para conferir telas e testar fluxos." />

      <div className="space-y-3">
        {fieis.map((fiel) => (
          <Card key={fiel.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-bold">{fiel.nome}</p>
              <p className="text-sm text-muted">
                {fiel.telefone} · {igrejaPorId.get(fiel.igrejaId)?.nome ?? "Igreja não encontrada"}
              </p>
            </div>
            <form action={acessarComoFielAction}>
              <input type="hidden" name="fielId" value={fiel.id} />
              <Button type="submit" variant="secondary">
                Acessar como fiel
              </Button>
            </form>
          </Card>
        ))}
        {fieis.length === 0 && <p className="text-muted">Nenhum fiel cadastrado ainda.</p>}
      </div>
    </div>
  );
}
