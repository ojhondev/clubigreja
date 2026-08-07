import Link from "next/link";
import { Card } from "@/components/ui";
import { Logo } from "@/components/logo";
import { FormCadastroIgreja } from "./form";

export default function CadastrarIgrejaPage() {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-6 py-12">
      <div className="mb-6 text-center">
        <div className="mb-3 flex justify-center">
          <Logo height={40} />
        </div>
        <h1 className="text-xl font-bold">Cadastre sua igreja</h1>
        <p className="mt-1 text-muted">
          Comece a receber dízimos, ofertas e campanhas em poucos minutos.
        </p>
      </div>

      <Card>
        <FormCadastroIgreja />
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
