"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, Users } from "lucide-react";
import { Button } from "@/components/ui";
import { LandingNav } from "@/components/landing/nav";
import { LandingFooter } from "@/components/landing/footer";
import { IgrejaFlow } from "./igreja-flow";
import { FielFlow } from "./fiel-flow";

export function SimulacaoPage({ qrDataUrl }: { qrDataUrl: string }) {
  const [lado, setLado] = useState<"igreja" | "fiel">("igreja");

  return (
    <div className="flex min-h-full flex-col">
      <LandingNav />
      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 pb-10 pt-14 text-center sm:px-6 sm:pt-20">
          <span className="inline-block rounded-full border border-black/10 bg-white px-4 py-1.5 text-sm font-bold text-foreground">
            Simulação
          </span>
          <h1 className="font-display mt-5 text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            Veja como o Club Igreja funciona, na prática.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
            Dois lados, um único fluxo: como a igreja lança uma campanha e como o fiel contribui em poucos toques.
          </p>

          <div className="mx-auto mt-8 flex w-fit rounded-full border border-border bg-white p-1">
            <button
              type="button"
              onClick={() => setLado("igreja")}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
                lado === "igreja" ? "bg-primary text-white" : "text-muted hover:text-foreground"
              }`}
            >
              <Building2 size={16} />
              Lado da Igreja
            </button>
            <button
              type="button"
              onClick={() => setLado("fiel")}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
                lado === "fiel" ? "bg-primary text-white" : "text-muted hover:text-foreground"
              }`}
            >
              <Users size={16} />
              Lado do Fiel
            </button>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 sm:pb-28">
          {lado === "igreja" ? <IgrejaFlow qrDataUrl={qrDataUrl} /> : <FielFlow qrDataUrl={qrDataUrl} />}
        </section>

        <section className="bg-primary py-16 text-center sm:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">Pronto para começar?</h2>
            <p className="mt-3 text-white/80">
              Cadastre sua igreja gratuitamente ou fale com nosso time para tirar dúvidas antes de começar.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/cadastrar-igreja">
                <Button variant="accent" className="w-full font-display sm:w-auto">
                  Cadastre-se é grátis
                </Button>
              </Link>
              <a href="mailto:contato@dclubigreja.com">
                <Button variant="dark-outline" className="w-full border-white font-display text-white hover:bg-white/10 sm:w-auto">
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
