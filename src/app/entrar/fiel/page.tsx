import Link from "next/link";
import { Card } from "@/components/ui";
import { Logo } from "@/components/logo";
import { FormLoginFiel } from "./form";

export default function LoginFielPage() {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-6 py-12">
      <div className="mb-6 text-center">
        <div className="mb-3 flex justify-center">
          <Logo height={40} />
        </div>
        <h1 className="text-xl font-bold">Entrar como fiel</h1>
      </div>

      <Card>
        <FormLoginFiel />
      </Card>

      <p className="mt-6 text-center text-sm text-muted">
        Ainda não tem conta?{" "}
        <Link href="/cadastrar-fiel" className="font-bold text-primary">
          Cadastre-se
        </Link>
      </p>
      <p className="mt-2 text-center text-sm text-muted">
        <Link href="/entrar" className="text-muted">
          ← Voltar
        </Link>
      </p>
    </div>
  );
}
