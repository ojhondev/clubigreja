import { PricingSimulator } from "./pricing-simulator";

export function PricingSection() {
  return (
    <section id="precos" className="bg-accent py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="inline-block rounded-full border border-black/10 bg-white px-4 py-1.5 text-sm font-bold text-foreground">
            Preços do Club
          </span>
          <h2 className="font-display mt-4 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            Apenas uma taxa fixa.
          </h2>
          <p className="font-display mt-2 text-2xl font-bold text-foreground sm:text-3xl">
            1,5% de campanhas.
            <br />
            1% em dízimo recorrente.
          </p>
        </div>

        <PricingSimulator />

        <p className="mx-auto mt-16 max-w-2xl text-center text-lg text-foreground/80">
          De forma facilitada, o administrador da Igreja pode criar campanhas de arrecadação e
          publicar o link para a comunidade através do WhatsApp, QR Code ou por e-mail.
        </p>
      </div>
    </section>
  );
}
