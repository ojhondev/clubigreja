import Link from "next/link";
import { Card } from "@/components/ui";
import { Logo } from "@/components/logo";
import { getConviteWebmasterPorToken } from "@/lib/db/repo";
import { FormAceitarConvite } from "./form";

export default async function ConviteWebmasterPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const convite = await getConviteWebmasterPorToken(token);

  if (!convite) {
    return (
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-6 py-12 text-center">
        <div className="mb-3 flex justify-center">
          <Logo height={40} />
        </div>
        <h1 className="text-xl font-bold">Convite inválido ou expirado</h1>
        <p className="mt-2 text-muted">
          Peça um novo convite ao Master Primário.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-6 py-12">
      <div className="mb-6 text-center">
        <div className="mb-3 flex justify-center">
          <Logo height={40} />
        </div>
        <h1 className="text-xl font-bold">Bem-vindo(a), {convite.nome}</h1>
        <p className="mt-1 text-sm text-muted">
          Você foi convidado(a) como Master Secundário. Defina sua senha para
          ativar a conta ({convite.email}).
        </p>
      </div>

      <Card>
        <FormAceitarConvite token={token} />
      </Card>

      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/" className="text-muted">
          ← Voltar ao site
        </Link>
      </p>
    </div>
  );
}
