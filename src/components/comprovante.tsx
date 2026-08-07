import { getCampanha, getContribuicao, getIgreja } from "@/lib/mock-db";
import { formatarMoeda } from "@/lib/comissao";
import { formatarData } from "@/lib/formato";
import { Card } from "@/components/ui";
import { notFound } from "next/navigation";

const ROTULO_TIPO: Record<string, string> = {
  dizimo: "Dízimo",
  oferta: "Oferta",
  campanha: "Campanha",
  evento: "Evento",
  livre: "Contribuição livre",
};

const ROTULO_MEIO: Record<string, string> = { pix: "Pix", cartao: "Cartão", boleto: "Boleto" };

export function Comprovante({ contribuicaoId }: { contribuicaoId: string }) {
  const contribuicao = getContribuicao(contribuicaoId);
  if (!contribuicao) notFound();

  const igreja = getIgreja(contribuicao.igrejaId);
  const campanha = contribuicao.campanhaId ? getCampanha(contribuicao.campanhaId) : undefined;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
        ✅
      </div>
      <h1 className="text-xl font-bold">Contribuição confirmada</h1>
      <p className="mt-1 text-muted">Obrigado por apoiar {igreja?.nome}.</p>

      <Card className="mt-6 w-full text-left">
        <p className="mb-4 text-3xl font-bold">{formatarMoeda(contribuicao.valorBruto)}</p>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Finalidade</dt>
            <dd className="font-medium">{campanha ? campanha.titulo : ROTULO_TIPO[contribuicao.tipo]}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Meio de pagamento</dt>
            <dd className="font-medium">{ROTULO_MEIO[contribuicao.meio]}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Data</dt>
            <dd className="font-medium">{formatarData(contribuicao.criadaEm)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Comprovante</dt>
            <dd className="font-mono text-xs">{contribuicao.id}</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
