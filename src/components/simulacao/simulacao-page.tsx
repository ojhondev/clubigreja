import Link from "next/link";
import { Button } from "@/components/ui";
import { LandingNav } from "@/components/landing/nav";
import { LandingFooter } from "@/components/landing/footer";
import { DashboardTour } from "./dashboard-tour";

export function SimulacaoPage() {
  return (
    <div className="flex min-h-full flex-col">
      <LandingNav />
      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 pb-10 pt-14 text-center sm:px-6 sm:pt-20">
          <span className="inline-block rounded-full border border-black/10 bg-white px-4 py-1.5 text-sm font-bold text-foreground">
            Explore a Plataforma
          </span>
          <h1 className="font-display mt-5 text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            O painel que sua igreja vai usar todo dia.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
            Um tour pelo dashboard, do jeito que a igreja vê: arrecadação,
            contribuições e campanhas em um único lugar.
          </p>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 sm:pb-28">
          <DashboardTour />
        </section>

        <section className="bg-primary py-16 text-center sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              Pronto para começar?
            </h2>
            <p className="mt-3 text-white/80">
              Cadastre sua igreja gratuitamente ou fale com nosso time para
              tirar dúvidas antes de começar.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/cadastrar-igreja">
                <Button
                  variant="accent"
                  className="w-full font-display sm:w-auto"
                >
                  Cadastre-se é grátis
                </Button>
              </Link>
              <a href="mailto:contato@dclubigreja.com">
                <Button
                  variant="dark-outline"
                  className="w-full border-white font-display text-white hover:bg-white/10 sm:w-auto"
                >
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
