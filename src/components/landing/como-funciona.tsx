"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, Users } from "lucide-react";
import { IgrejaFlow } from "@/components/simulacao/igreja-flow";
import { FielFlow } from "@/components/simulacao/fiel-flow";

export function ComoFunciona({ qrDataUrl }: { qrDataUrl: string }) {
  const [lado, setLado] = useState<"igreja" | "fiel">("igreja");

  return (
    <section id="como-funciona" className="bg-[#F7FAFF] py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <span className="text-sm font-bold text-primary">Como funciona</span>
          <h2 className="font-display mt-2 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            Veja o Club Igreja funcionando, na prática.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
            Dois lados, um único fluxo: como a igreja lança uma campanha e como o fiel contribui em
            poucos toques.
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
        </div>

        {lado === "igreja" ? <IgrejaFlow qrDataUrl={qrDataUrl} /> : <FielFlow qrDataUrl={qrDataUrl} />}

        <div className="mt-14 text-center">
          <Link href="/simulacao" className="text-sm font-bold text-primary hover:underline">
            Veja a plataforma por dentro →
          </Link>
        </div>
      </div>
    </section>
  );
}
