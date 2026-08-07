"use client";

import { useState } from "react";
import { calcularBeneficio } from "@/lib/acao-social";
import { formatarMoeda } from "@/lib/comissao";

export function AcaoSocialSimulador() {
  const [valorTexto, setValorTexto] = useState("200");
  const valor = Math.max(0, Number(valorTexto.replace(/\D/g, "")) || 0);
  const { beneficioFiel, paraProjetoSocial, liquidoParaFiel } = calcularBeneficio(valor);

  return (
    <div className="relative mx-auto max-w-md">
      <div className="absolute inset-x-4 -bottom-3 top-3 rounded-[2rem] bg-primary sm:inset-x-8" />
      <div className="relative rounded-[2rem] bg-white p-6 shadow-xl sm:p-8">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold text-muted">Valor da compra na empresa parceira</span>
          <div className="flex items-center gap-1 rounded-xl bg-[#EEF1FC] px-4 py-3">
            <span className="text-xl font-bold text-foreground">R$</span>
            <input
              value={valor.toLocaleString("pt-BR")}
              onChange={(e) => setValorTexto(e.target.value)}
              inputMode="numeric"
              className="w-full bg-transparent text-xl font-bold text-foreground outline-none"
            />
          </div>
        </label>

        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between rounded-xl bg-[#EAF6FF] px-4 py-3">
            <span className="text-sm font-medium text-foreground">Benefício total (10%)</span>
            <span className="text-lg font-bold text-primary">{formatarMoeda(beneficioFiel)}</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-[#EEF1FC] px-4 py-3">
            <span className="text-sm font-medium text-foreground">Fica com o fiel</span>
            <span className="text-lg font-bold text-foreground">{formatarMoeda(liquidoParaFiel)}</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-green-50 px-4 py-3">
            <span className="text-sm font-medium text-foreground">Vai para o projeto social</span>
            <span className="text-lg font-bold text-success">{formatarMoeda(paraProjetoSocial)}</span>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted">
          25% do benefício vai automaticamente para o projeto social da igreja do fiel — sem custo
          extra para ninguém.
        </p>
      </div>
    </div>
  );
}
