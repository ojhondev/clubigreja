import Link from "next/link";
import { Comprovante } from "@/components/comprovante";
import { Button } from "@/components/ui";

export default async function ComprovantePublicoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-6 py-10">
      <Comprovante contribuicaoId={id} />
      <div className="mt-6 flex w-full flex-col gap-3">
        <Link href="/entrar">
          <Button variant="secondary" className="w-full">
            Acompanhar sua igreja no Club Igreja
          </Button>
        </Link>
      </div>
    </div>
  );
}
