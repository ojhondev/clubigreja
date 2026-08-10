import Link from "next/link";
import { Comprovante } from "@/components/comprovante";
import { Button } from "@/components/ui";

export default async function ComprovantePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="py-6">
      <Comprovante contribuicaoId={id} caminhoPagarBase="/fiel/doar/pagar" />
      <div className="mt-6 flex w-full flex-col gap-3">
        <Link href="/fiel/inicio">
          <Button className="w-full">Voltar ao início</Button>
        </Link>
        <Link href="/fiel/historico">
          <Button variant="secondary" className="w-full">
            Ver histórico completo
          </Button>
        </Link>
      </div>
    </div>
  );
}
