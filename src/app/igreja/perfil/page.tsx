import { Trash2 } from "lucide-react";
import { getSessao } from "@/lib/auth/session";
import { getIgreja } from "@/lib/db/repo";
import { Button, Card, PageHeader } from "@/components/ui";
import { FormPerfilIgreja } from "./form";
import { adicionarLinkExtraAction, removerLinkExtraAction } from "./actions";

export default async function PerfilIgrejaPage() {
  const sessao = await getSessao();
  const igreja = (await getIgreja(sessao!.igrejaId!))!;

  return (
    <div>
      <PageHeader
        title="Perfil da igreja"
        subtitle="Esses dados aparecem na sua página pública e no cadastro."
      />

      <Card className="mb-6">
        <FormPerfilIgreja igreja={igreja} />
      </Card>

      <Card>
        <h2 className="mb-1 font-bold">Links da página pública</h2>
        <p className="mb-4 text-sm text-muted">
          Instagram, site, uma campanha específica — o que você quiser mostrar
          em dclubigreja.com/{igreja.slug}.
        </p>

        <div className="mb-4 space-y-2">
          {igreja.linksExtras.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3"
            >
              <div className="min-w-0">
                <p className="font-medium">{link.rotulo}</p>
                <p className="truncate text-sm text-muted">{link.url}</p>
              </div>
              <form action={removerLinkExtraAction}>
                <input type="hidden" name="linkExtraId" value={link.id} />
                <button
                  type="submit"
                  aria-label="Remover link"
                  className="shrink-0 text-muted hover:text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </form>
            </div>
          ))}
          {igreja.linksExtras.length === 0 && (
            <p className="text-sm text-muted">
              Nenhum link extra cadastrado ainda.
            </p>
          )}
        </div>

        <form
          action={adicionarLinkExtraAction}
          className="grid gap-3 sm:grid-cols-[1fr_2fr_auto]"
        >
          <input
            name="rotulo"
            required
            placeholder="Ex.: Instagram"
            className="rounded-xl border border-border px-4 py-3"
          />
          <input
            name="url"
            type="url"
            required
            placeholder="https://…"
            className="rounded-xl border border-border px-4 py-3"
          />
          <Button type="submit" variant="secondary">
            Adicionar
          </Button>
        </form>
      </Card>
    </div>
  );
}
