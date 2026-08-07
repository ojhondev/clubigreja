"use client";

import { useState } from "react";
import { TAXA_CAMPANHA, TAXA_DIZIMO, formatarMoeda } from "@/lib/comissao";

function calcular(valorTexto: string, taxaPercentual: number) {
  const valor = Math.max(0, Number(valorTexto.replace(/\D/g, "")) || 0);
  const taxa = Math.round(valor * taxaPercentual * 100) / 100;
  return { valor, taxa };
}

function ColunaSimulador({
  titulo,
  taxaPercentual,
  valorInicial,
}: {
  titulo: string;
  taxaPercentual: number;
  valorInicial: number;
}) {
  const [valorTexto, setValorTexto] = useState(String(valorInicial));
  const { valor, taxa } = calcular(valorTexto, taxaPercentual);

  return (
    <div className="flex-1">
      <span className="inline-block rounded-full border border-black/10 px-4 py-1.5 text-sm font-bold text-foreground">
        {titulo}
      </span>

      <label className="mt-4 flex flex-col gap-1">
        <span className="text-sm text-muted">Sua igreja arrecadou</span>
        <div className="flex items-center gap-1 rounded-xl bg-[#EEF1FC] px-4 py-3">
          <span className="text-lg font-bold text-foreground sm:text-2xl">R$</span>
          <input
            value={valor.toLocaleString("pt-BR")}
            onChange={(e) => setValorTexto(e.target.value)}
            inputMode="numeric"
            className="w-full bg-transparent text-lg font-bold text-foreground outline-none sm:text-2xl"
          />
        </div>
      </label>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-sm text-muted">Sua igreja recebe</p>
          <div className="mt-1 rounded-xl bg-[#EAF6FF] px-3 py-3">
            <p className="text-xl font-bold text-primary sm:text-2xl">
              {valor.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted">Taxa dos fiéis</p>
          <div className="mt-1 rounded-xl bg-[#F7FAFF] px-3 py-3">
            <p className="text-xl font-bold text-foreground sm:text-2xl">
              {formatarMoeda(taxa)}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm text-muted">
        {(Math.round(taxaPercentual * 1000) / 10).toString().replace(".", ",")}% por pagamento, cobrado do
        fiel — nunca descontado da igreja.
      </p>
    </div>
  );
}

export function PricingSimulator() {
  return (
    <div className="relative mx-auto max-w-3xl">
      <div className="absolute inset-x-4 -bottom-3 top-3 rounded-[2rem] bg-primary sm:inset-x-8" />
      <div className="relative grid gap-8 rounded-[2rem] bg-white p-6 shadow-xl sm:grid-cols-2 sm:p-10">
        <ColunaSimulador titulo="Campanhas" taxaPercentual={TAXA_CAMPANHA} valorInicial={100000} />
        <ColunaSimulador titulo="Dízimo Recorrente" taxaPercentual={TAXA_DIZIMO} valorInicial={25000} />
      </div>
    </div>
  );
}
