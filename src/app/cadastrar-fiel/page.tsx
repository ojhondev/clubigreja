import Link from "next/link";
import { Card } from "@/components/ui";
import { Logo } from "@/components/logo";
import { FormCadastroFiel } from "./form";

export default function CadastrarFielPage() {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-6 py-12">
      <div className="mb-6 text-center">
        <div className="mb-3 flex justify-center">
          <Logo height={40} />
        </div>
        <h1 className="text-xl font-bold">Crie sua conta de fiel</h1>
        <p className="mt-1 text-muted">
          Acompanhe o mural e contribua com sua igreja em segundos.
        </p>
      </div>

      <Card className="overflow-visible">
        <FormCadastroFiel />
      </Card>

      <p className="mt-6 text-center text-sm text-muted">
        Já tem conta?{" "}
        <Link href="/entrar" className="font-bold text-primary">
          Entrar
        </Link>
      </p>
    </div>
  );
}
