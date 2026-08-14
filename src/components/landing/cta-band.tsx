import Link from "next/link";
import { Button } from "@/components/ui";

export function CtaBand() {
  return (
    <section
      id="contato"
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24"
    >
      <div className="rounded-3xl bg-[#F7FAFF] px-6 py-12 text-center sm:px-12 sm:py-16">
        <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
          Pronto para começar?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-lg text-muted">
          Cadastre sua igreja gratuitamente ou fale com nosso time para tirar
          dúvidas antes de começar.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/cadastrar-igreja">
            <Button className="w-full sm:w-auto">Cadastre-se é grátis</Button>
          </Link>
          <a href="mailto:contato@dclubigreja.com">
            <Button variant="secondary" className="w-full sm:w-auto">
              Fale com nosso time
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
