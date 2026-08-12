import Link from "next/link";
import { notFound } from "next/navigation";
import { getIgrejaPorSlug } from "@/lib/db/repo";
import { Card } from "@/components/ui";
import { Logo } from "@/components/logo";
import { FormCadastroFiel } from "@/app/cadastrar-fiel/form";

export default async function CadastroFielEscopadoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const igreja = await getIgrejaPorSlug(slug);
  if (!igreja || igreja.statusOnboarding !== "aprovado") notFound();

  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-6 py-12">
      <div className="mb-6 text-center">
        <div className="mb-3 flex justify-center">
          <Logo height={40} />
        </div>
        <h1 className="text-xl font-bold">Crie sua conta de fiel</h1>
        <p className="mt-1 text-muted">Acompanhe o mural e contribua com sua igreja em segundos.</p>
      </div>

      <Card className="overflow-visible">
        <FormCadastroFiel
          igrejaFixa={{
            id: igreja.id,
            nome: igreja.nome,
            cidade: igreja.cidade,
            uf: igreja.uf,
            logoEmoji: igreja.logoEmoji,
          }}
        />
      </Card>

      <p className="mt-6 text-center text-sm text-muted">
        Já tem conta?{" "}
        <Link href="/entrar/fiel" className="font-bold text-primary">
          Entrar
        </Link>
      </p>
    </div>
  );
}
