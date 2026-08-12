import Link from "next/link";
import { Card } from "@/components/ui";
import { Logo } from "@/components/logo";
import { existeWebmaster } from "@/lib/db/repo";
import { FormWebmaster } from "./form";

export default async function WebmasterPage() {
  const jaConfigurado = await existeWebmaster();

  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-6 py-12">
      <div className="mb-6 text-center">
        <div className="mb-3 flex justify-center">
          <Logo height={40} />
        </div>
        <h1 className="text-xl font-bold">{jaConfigurado ? "WebMaster" : "Configurar Master Primário"}</h1>
        <p className="mt-1 text-sm text-muted">
          {jaConfigurado
            ? "Acesso restrito à equipe Dizipay."
            : "Nenhuma conta de equipe existe ainda — crie a conta de Master Primário para começar."}
        </p>
      </div>

      <Card>
        <FormWebmaster modo={jaConfigurado ? "login" : "setup"} />
      </Card>

      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/" className="text-muted">
          ← Voltar ao site
        </Link>
      </p>
    </div>
  );
}
