import { PageHeader } from "@/components/ui";
import { PagamentoPix } from "@/components/pagamento-pix";
import { confirmarPagamentoAction } from "./actions";

export default async function PagarDoacaoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div>
      <PageHeader title="Falta pouco" subtitle="Pague o Pix e depois confirme aqui." />
      <PagamentoPix
        contribuicaoId={id}
        confirmarAction={confirmarPagamentoAction}
        caminhoComprovanteBase="/fiel/doar/comprovante"
      />
    </div>
  );
}
