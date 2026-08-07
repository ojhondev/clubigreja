"use client";

import { useState } from "react";
import { TAXA_CAMPANHA, TAXA_DIZIMO, formatarMoeda } from "@/lib/comissao";

function calcular(valorTexto: string, taxa: number) {
  const valor = Math.max(0, Number(valorTexto.replace(/\D/g, "")) || 0);
  const comissao = Math.round(valor * taxa * 100) / 100;
  const liquido = Math.round((valor - comissao) * 100) / 100;
  return { valor, comissao, liquido };
}

function ColunaSimulador({
  titulo,
  taxa,
  explicacao,
  valorInicial,
}: {
  titulo: string;
  taxa: number;
  explicacao: string;
  valorInicial: number;
}) {
  const [valorTexto, setValorTexto] = useState(String(valorInicial));
  const { valor, comissao, liquido } = calcular(valorTexto, taxa);

  return (
    <div className="flex-1">
      <span className="inline-block rounded-full border border-black/10 px-4 py-1.5 text-sm font-bold text-foreground">
        {titulo}
      </span>

      <label className="mt-4 flex flex-col gap-1">
        <span className="text-sm text-muted">Sua captação foi de</span>
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

      <p className="mt-4 text-sm text-muted">Igreja recebe na conta</p>
      <div className="mt-1 rounded-xl bg-[#EEF1FC] px-4 py-3">
        <p className="text-2xl font-bold text-foreground sm:text-3xl">
          {liquido.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
        </p>
      </div>

      <p className="mt-3 text-sm text-muted">
        {explicacao} Comissão do Club: {formatarMoeda(comissao)}.
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
          taxa={TAXA_CAMPANHA}
          explicacao="Taxa de 1,5% fixa por campanha."
          valorInicial={100000}
        />
        <ColunaSimulador
          titulo="Dízimo Recorrente"
          taxa={TAXA_DIZIMO}
          explicacao="Taxa de 1% ao mês sobre o dízimo arrecadado no app."
          valorInicial={25000}
        />
      </div>
    </div>
  );
}
