import { Button } from "@/components/ui";

export function PricingSection() {
  return (
    <section id="precos" className="bg-accent py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full border border-black/10 bg-white px-4 py-1.5 text-sm font-bold text-foreground">
            Preços do Club
          </span>
          <h2 className="font-display mt-4 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            Sua igreja recebe 100%.
          </h2>
          <p className="font-display mt-2 text-2xl font-bold text-foreground sm:text-3xl">
            Nada de mensalidade. Nenhum custo para a sua igreja.
          </p>
          <p className="mx-auto mt-6 max-w-xl text-lg text-foreground/80">
            Sua igreja nunca paga nada pra usar o Club — cadastro, painel, campanhas e dízimo
            recorrente, tudo incluso, sempre. Fale com nosso time pra entender como o Club se sustenta.
          </p>
          <a href="mailto:contato@dclubigreja.com" className="mt-6 inline-block">
            <Button variant="dark" className="font-display">
              Fale com nosso time
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
