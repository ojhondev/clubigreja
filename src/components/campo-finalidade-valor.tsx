"use client";

import { useState } from "react";
import { SeletorValor } from "./seletor-valor";
import type { TipoArrecadacao } from "@/lib/types";

const ROTULO_TIPO: Record<"dizimo" | "oferta" | "livre", string> = {
  dizimo: "Dízimo",
  oferta: "Oferta",
  livre: "Contribuição livre",
};

// Junta o seletor de finalidade com o de valor num único componente porque a
// taxa de processamento exibida no seletor de valor depende da finalidade
// escolhida (dízimo/oferta usam uma taxa, contribuição livre usa outra).
export function CampoFinalidadeEValor({ tipoInicial }: { tipoInicial: TipoArrecadacao }) {
  const [tipo, setTipo] = useState<TipoArrecadacao>(tipoInicial);

  return (
    <>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-muted">Finalidade</span>
        <select
          name="tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value as TipoArrecadacao)}
          className="rounded-xl border border-border px-4 py-3"
        >
          <option value="dizimo">{ROTULO_TIPO.dizimo}</option>
          <option value="oferta">{ROTULO_TIPO.oferta}</option>
          <option value="livre">{ROTULO_TIPO.livre}</option>
        </select>
      </label>
      <SeletorValor tipo={tipo} />
    </>
  );
}
