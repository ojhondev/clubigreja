import Image from "next/image";
import { Button } from "@/components/ui";

export function FeatureReceber() {
  return (
    <section id="recursos" className="bg-[#F7FAFF] py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            Receba diretamente na conta da igreja.
          </h2>
          <p className="mt-4 max-w-md text-lg text-muted">
            Receba dízimos, ofertas e campanhas em poucos toques. Pix, cartão, recorrência e
            links.
          </p>
          <a href="mailto:contato@dclubigreja.com" className="mt-6 inline-block">
            <Button variant="dark-outline" className="font-display">
              Fale com nosso time
            </Button>
          </a>
        </div>

        <div className="overflow-hidden rounded-[2rem]">
          <Image
            src="/conta-igreja.png"
            alt="Direto na conta da igreja"
            width={621}
            height={1026}
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
}
