import { getCampanha, getContribuicao, getFiel, getIgreja } from "@/lib/db/repo";
import { formatarMoeda } from "@/lib/comissao";
import { formatarData } from "@/lib/formato";
import { Card } from "@/components/ui";
import { notFound, redirect } from "next/navigation";

const ROTULO_TIPO: Record<string, string> = {
  dizimo: "Dízimo",
  oferta: "Oferta",
  campanha: "Campanha",
  evento: "Evento",
  livre: "Contribuição livre",
};

export async function Comprovante({
  contribuicaoId,
  caminhoPagarBase = "/doar/pagar",
}: {
  contribuicaoId: string;
  caminhoPagarBase?: string;
}) {
  const contribuicao = await getContribuicao(contribuicaoId);
  if (!contribuicao) notFound();
  // Só existe comprovante pra Pix já confirmado — se o fiel chegou aqui sem
  // confirmar (ex: voltou no navegador), manda de volta pra tela de pagamento.
  if (contribuicao.status !== "confirmado") redirect(`${caminhoPagarBase}/${contribuicaoId}`);

  const igreja = await getIgreja(contribuicao.igrejaId);
  const campanha = contribuicao.campanhaId ? await getCampanha(contribuicao.campanhaId) : undefined;
  const fiel = await getFiel(contribuicao.fielId);

  const taxaRotulo =
    contribuicao.taxaCobradaVia === "cartao_salvo" && fiel?.cartaoSalvo
      ? `Cartão ${fiel.cartaoSalvo.bandeira} final ${fiel.cartaoSalvo.ultimosDigitos}`
      : "Pix separado";

  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
        ✅
      </div>
      <h1 className="text-xl font-bold">Contribuição confirmada</h1>
      <p className="mt-1 text-muted">Obrigado por apoiar {igreja?.nome}.</p>

      <Card className="mt-6 w-full text-left">
        <p className="mb-1 text-sm text-muted">Valor recebido pela igreja</p>
        <p className="mb-4 text-3xl font-bold text-success">{formatarMoeda(contribuicao.valorBruto)}</p>

        <dl className="space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Finalidade</dt>
            <dd className="font-medium">{campanha ? campanha.titulo : ROTULO_TIPO[contribuicao.tipo]}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Doação via Pix</dt>
            <dd className="font-medium">{formatarMoeda(contribuicao.valorBruto)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Taxa de processamento</dt>
            <dd className="font-medium">{formatarMoeda(contribuicao.taxaValor)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Cobrada em</dt>
            <dd className="font-medium">{taxaRotulo}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-2">
            <dt className="font-medium">Total pago por você</dt>
            <dd className="font-bold">{formatarMoeda(contribuicao.valorTotalFiel)}</dd>
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

      <p className="mt-4 text-xs text-muted">
        A igreja recebeu o valor integral da sua contribuição — a taxa de processamento é paga por você, à parte.
      </p>
    </div>
  );
}
