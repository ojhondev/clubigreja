import { PagamentoPix } from "@/components/pagamento-pix";
import { confirmarPagamentoPublicoAction } from "./actions";

export default async function PagarDoacaoPublicoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-6 py-10">
      <div className="mb-5 text-center">
        <h1 className="text-xl font-bold">Falta pouco</h1>
        <p className="mt-1 text-sm text-muted">Pague o Pix e depois confirme aqui.</p>
      </div>
      <PagamentoPix
        contribuicaoId={id}
        confirmarAction={confirmarPagamentoPublicoAction}
        caminhoComprovanteBase="/doar/comprovante"
      />
      <p className="mt-4 text-center text-xs text-muted">Processado com segurança pelo Dizipay — dclubigreja.com</p>
    </div>
  );
}
