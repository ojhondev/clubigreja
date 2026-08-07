"use client";

import { useState } from "react";
import { TAXA_CAMPANHA, TAXA_DIZIMO, formatarMoeda } from "@/lib/comissao";

function calcular(valorTexto: string, taxaPercentual: number) {
  const valor = Math.max(0, Number(valorTexto.replace(/\D/g, "")) || 0);
  const taxa = Math.round(valor * taxaPercentual * 100) / 100;
  const totalFieis = Math.round((valor + taxa) * 100) / 100;
  return { valor, taxa, totalFieis };
}

function ColunaSimulador({
  titulo,
  taxaPercentual,
  explicacao,
  valorInicial,
}: {
  titulo: string;
  taxaPercentual: number;
  explicacao: string;
  valorInicial: number;
}) {
  const [valorTexto, setValorTexto] = useState(String(valorInicial));
  const { valor, taxa, totalFieis } = calcular(valorTexto, taxaPercentual);

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

      <p className="mt-4 text-sm text-muted">Sua igreja recebe</p>
      <div className="mt-1 rounded-xl bg-[#EAF6FF] px-4 py-3">
        <p className="text-2xl font-bold text-primary sm:text-3xl">
          {valor.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
        </p>
      </div>

      <p className="mt-3 text-sm text-muted">
        {explicacao} Seus fiéis pagaram {formatarMoeda(taxa)} de taxa, somada ao valor — total de{" "}
        {formatarMoeda(totalFieis)} entre todos, sem descontar nada da igreja.
      </p>
    </div>
  );
}

export function PricingSimulator() {
  return (
    <div className="relative mx-auto max-w-3xl">
      <div className="absolute inset-x-4 -bottom-3 top-3 rounded-[2rem] bg-primary sm:inset-x-8" />
      <div className="relative grid gap-8 rounded-[2rem] bg-white p-6 shadow-xl sm:grid-cols-2 sm:p-10">
        <ColunaSimulador
          titulo="Campanhas"
          taxaPercentual={TAXA_CAMPANHA}
          explicacao="Taxa de 2,5% por pagamento, paga pelo fiel."
          valorInicial={100000}
        />
        <ColunaSimulador
          titulo="Dízimo Recorrente"
          taxaPercentual={TAXA_DIZIMO}
          explicacao="Taxa de 3,5% por pagamento, paga pelo fiel."
          valorInicial={25000}
        />
      </div>
    </div>
  );
}
