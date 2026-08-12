import Link from "next/link";
import { QrCode } from "lucide-react";
import { getSessao } from "@/lib/auth/session";
import { getIgreja, getLinksDaIgreja } from "@/lib/db/repo";
import { Badge, Button, Card, PageHeader } from "@/components/ui";
import { criarLink } from "./actions";

const ROTULO_TIPO: Record<string, string> = {
  dizimo: "Dízimo",
  oferta: "Oferta",
  campanha: "Campanha",
  evento: "Evento",
  livre: "Valor livre",
};

export default async function LinksPagamentoPage() {
  const sessao = await getSessao();
  const links = await getLinksDaIgreja(sessao!.igrejaId!);
  const igreja = (await getIgreja(sessao!.igrejaId!))!;

  return (
    <div>
      <PageHeader
        title="Links de pagamento"
        subtitle="Crie um link e compartilhe por WhatsApp — o fiel contribui sem precisar de cadastro."
      />

      <Card className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold">Página pública da sua igreja</p>
          <code className="break-all text-sm text-muted">dclubigreja.com/{igreja.slug}</code>
        </div>
        <Link href={`/${igreja.slug}`} target="_blank">
          <Button variant="secondary" className="w-full sm:w-auto">
            Ver página
          </Button>
        </Link>
      </Card>

      <Card className="mb-8">
        <h2 className="mb-4 font-bold">Criar novo link</h2>
        <form action={criarLink} className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm font-medium text-muted">Título do link</span>
            <input
              name="titulo"
              required
              placeholder="Ex.: Dízimo de agosto"
              className="rounded-xl border border-border px-4 py-3"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted">Finalidade</span>
            <select name="tipo" className="rounded-xl border border-border px-4 py-3">
              <option value="dizimo">Dízimo</option>
              <option value="oferta">Oferta</option>
              <option value="livre">Valor livre / outra finalidade</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted">Valor sugerido (opcional)</span>
            <input
              name="valorSugerido"
              type="number"
              min="0"
              step="0.01"
              placeholder="R$"
              className="rounded-xl border border-border px-4 py-3"
            />
          </label>
          <div className="sm:col-span-2">
            <Button type="submit">Criar link</Button>
          </div>
        </form>
      </Card>

      <h2 className="mb-4 text-lg font-bold">Seus links</h2>
      <div className="space-y-3">
        {links.map((l) => (
          <Card key={l.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <p className="font-bold">{l.titulo}</p>
                <Badge>{ROTULO_TIPO[l.tipo]}</Badge>
                {!l.ativo && <Badge tone="warning">Inativo</Badge>}
              </div>
              <code className="break-all text-sm text-muted">dclubigreja.com/doar/link/{l.id}</code>
            </div>
            <Link href={`/igreja/links/${l.id}/qrcode`}>
              <Button variant="secondary" className="w-full sm:w-auto">
                <QrCode size={18} />
                QR Code
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
