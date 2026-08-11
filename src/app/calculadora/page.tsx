import Link from "next/link";
import { LandingNav } from "@/components/landing/nav";
import { LandingFooter } from "@/components/landing/footer";
import { CalculadoraArrecadacao } from "@/components/landing/calculadora-arrecadacao";
import { Button } from "@/components/ui";

export const metadata = {
  title: "Calculadora de arrecadação — Club Igreja",
  description:
    "Veja quanto a sua comunidade pode arrecadar a mais por mês ao ativar o canal digital de dízimos, ofertas e campanhas.",
};

export default function CalculadoraPage() {
  return (
    <div className="flex min-h-full flex-col">
      <LandingNav />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 pb-10 pt-14 sm:px-6 sm:pt-20">
          <span className="inline-block rounded-full border border-black/10 bg-white px-4 py-1.5 text-sm font-bold text-foreground">
            Calculadora
          </span>
          <h1 className="font-display mt-5 max-w-2xl text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            Quanto a sua comunidade deixa de arrecadar por mês?
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted">
            Ajuste os números da sua realidade e veja a projeção com o canal digital de contribuição
            ativo.
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
          <CalculadoraArrecadacao />
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="rounded-3xl bg-[#F7FAFF] px-6 py-12 text-center sm:px-12 sm:py-16">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Pronto para colocar isso em prática?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-lg text-muted">
              Cadastre sua igreja gratuitamente e comece a receber dízimos, ofertas e campanhas pelo
              Club Igreja.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/cadastrar-igreja">
                <Button variant="dark" className="w-full font-display sm:w-auto">
                  Cadastre-se é grátis
                </Button>
              </Link>
              <a href="mailto:contato@dclubigreja.com">
                <Button variant="dark-outline" className="w-full font-display sm:w-auto">
                  Fale com nosso time
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
