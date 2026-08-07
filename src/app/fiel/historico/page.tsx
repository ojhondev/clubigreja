import { getSessao } from "@/lib/auth/session";
import { getCampanha, getContribuicoesDoFiel } from "@/lib/mock-db";
import { formatarMoeda } from "@/lib/comissao";
import { formatarData } from "@/lib/formato";
import { Card, PageHeader } from "@/components/ui";

const ROTULO_TIPO: Record<string, string> = {
  dizimo: "Dízimo",
  oferta: "Oferta",
  campanha: "Campanha",
  evento: "Evento",
  livre: "Contribuição livre",
};

const ROTULO_MEIO: Record<string, string> = { pix: "Pix", cartao: "Cartão", boleto: "Boleto" };

export default async function HistoricoPage() {
  const sessao = await getSessao();
  const contribuicoes = getContribuicoesDoFiel(sessao!.usuarioId);
  const total = contribuicoes.reduce((s, c) => s + c.valorBruto, 0);

  return (
    <div>
      <PageHeader title="Seu histórico" subtitle={`Total contribuído: ${formatarMoeda(total)}`} />
      <div className="space-y-3">
        {contribuicoes.map((c) => {
          const campanha = c.campanhaId ? getCampanha(c.campanhaId) : undefined;
          return (
            <Card key={c.id} className="flex items-center justify-between">
              <div>
                <p className="font-bold">{campanha ? campanha.titulo : ROTULO_TIPO[c.tipo]}</p>
                <p className="text-sm text-muted">
                  {formatarData(c.criadaEm)} · {ROTULO_MEIO[c.meio]}
                </p>
              </div>
              <p className="font-bold">{formatarMoeda(c.valorBruto)}</p>
            </Card>
          );
        })}
        {contribuicoes.length === 0 && <p className="text-muted">Você ainda não fez nenhuma contribuição.</p>}
      </div>
    </div>
  );
}
