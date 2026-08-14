"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopiarTexto({
  texto,
  rotulo = "Copiar código",
}: {
  texto: string;
  rotulo?: string;
}) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    await navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copiar}
      className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary px-4 py-3 text-sm font-bold text-primary transition-colors hover:bg-[#EAF6FF]"
    >
      {copiado ? <Check size={16} /> : <Copy size={16} />}
      {copiado ? "Código copiado!" : rotulo}
    </button>
  );
}
