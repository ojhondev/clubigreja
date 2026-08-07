"use client";

import { useState } from "react";
import { calcularTaxaProcessamento, formatarMoeda } from "@/lib/comissao";
import type { TipoArrecadacao } from "@/lib/types";

const SUGESTOES = [30, 50, 100, 200];

export function SeletorValor({
  valorInicial,
  tipo = "dizimo",
}: {
  valorInicial?: number;
  tipo?: TipoArrecadacao;
}) {
  const [valor, setValor] = useState<string>(valorInicial ? String(valorInicial) : "");
  const numero = Number(valor);
  const taxa = numero > 0 ? calcularTaxaProcessamento(tipo, numero) : null;

  return (
    <div>
      <div className="mb-3 flex gap-2">
        {SUGESTOES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setValor(String(s))}
            className={`flex-1 rounded-xl border py-3 text-sm font-bold transition-colors ${
              valor === String(s)
                ? "border-primary bg-[#EAF6FF] text-primary"
                : "border-border text-muted hover:border-primary"
            }`}
          >
            R$ {s}
          </button>
        ))}
      </div>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-muted">Ou digite outro valor</span>
        <input
          name="valor"
          type="number"
          min="1"
          step="0.01"
          required
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="R$ 0,00"
          className="rounded-xl border border-border px-4 py-4 text-2xl font-bold"
        />
      </label>

      {taxa && (
        <div className="mt-3 rounded-xl bg-[#F7FAFF] px-4 py-3">
          <p className="text-sm text-muted">Você vai pagar</p>
          <p className="text-xl font-bold text-foreground">{formatarMoeda(taxa.valorTotalFiel)}</p>
          <p className="mt-1 text-xs text-muted">
            Já inclui a taxa de processamento — a igreja recebe o valor integral escolhido.
          </p>
        </div>
      )}
    </div>
  );
}
