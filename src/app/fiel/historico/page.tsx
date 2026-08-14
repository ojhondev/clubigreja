import Link from "next/link";
import { getSessao } from "@/lib/auth/session";
import { getCampanha, getContribuicoesDoFiel } from "@/lib/db/repo";
import { formatarMoeda } from "@/lib/comissao";
import { formatarData } from "@/lib/formato";
import { Badge, Button, Card, PageHeader } from "@/components/ui";

const ROTULO_TIPO: Record<string, string> = {
  dizimo: "Dízimo",
  oferta: "Oferta",
  campanha: "Campanha",
  evento: "Evento",
  livre: "Contribuição livre",
};

const ROTULO_MEIO: Record<string, string> = {
  pix: "Pix",
  cartao: "Cartão",
  boleto: "Boleto",
};

export default async function HistoricoPage() {
  const sessao = await getSessao();
  const contribuicoesBrutas = await getContribuicoesDoFiel(sessao!.usuarioId);
  const total = contribuicoesBrutas
    .filter((c) => c.status === "confirmado")
    .reduce((s, c) => s + c.valorBruto, 0);
  const contribuicoes = await Promise.all(
    contribuicoesBrutas.map(async (c) => ({
      ...c,
      campanha: c.campanhaId ? await getCampanha(c.campanhaId) : undefined,
    })),
  );

  return (
    <div>
      <PageHeader
        title="Seu histórico"
        subtitle={`Total contribuído: ${formatarMoeda(total)}`}
      />
      <div className="space-y-3">
        {contribuicoes.map((c) => {
          const campanha = c.campanha;
          const pendente = c.status === "aguardando_pix";
          return (
            <Card
              key={c.id}
              className={pendente ? "border-amber-300" : undefined}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">
                    {campanha ? campanha.titulo : ROTULO_TIPO[c.tipo]}
                  </p>
                  <p className="text-sm text-muted">
                    {formatarData(c.criadaEm)} · {ROTULO_MEIO[c.meio]}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatarMoeda(c.valorBruto)}</p>
                  {pendente && <Badge tone="warning">Aguardando Pix</Badge>}
                </div>
              </div>
              {pendente && (
                <Link href={`/fiel/doar/pagar/${c.id}`} className="mt-3 block">
                  <Button variant="secondary" className="w-full">
                    Pagar / confirmar agora
                  </Button>
                </Link>
              )}
            </Card>
          );
        })}
        {contribuicoes.length === 0 && (
          <p className="text-muted">Você ainda não fez nenhuma contribuição.</p>
        )}
      </div>
    </div>
  );
}
