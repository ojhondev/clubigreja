import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui";

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-block rounded-full border border-black/10 bg-white px-4 py-1.5 text-sm font-bold text-foreground">
          Inovação para a Igreja
        </span>
        <h1 className="font-display mt-5 text-4xl font-bold leading-[1.1] text-foreground sm:text-5xl lg:text-6xl">
          Aplicativo de Campanhas e Dízimo Recorrente para Igrejas
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-lg text-muted">
          Por meio do Dizipay, sua igreja recebe dízimos, ofertas e campanhas em um único lugar,
          enquanto o fiel contribui e acompanha tudo em poucos toques, de qualquer lugar.
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

      <div className="mt-14 overflow-hidden rounded-[2rem]">
        <Image
          src="/hero-01.png"
          alt="Simples para doar"
          width={1522}
          height={844}
          className="w-full"
          priority
        />
      </div>
    </section>
  );
}
