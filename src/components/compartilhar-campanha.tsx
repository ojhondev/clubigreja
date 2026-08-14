"use client";

import { useState } from "react";
import { Copy, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui";

export function CompartilharCampanha({
  titulo,
  igrejaNome,
  url,
}: {
  titulo: string;
  igrejaNome: string;
  url: string;
}) {
  const [copiado, setCopiado] = useState(false);
  const texto = `Ajude a igreja ${igrejaNome} na campanha "${titulo}" — contribua por aqui: ${url}`;

  async function compartilhar() {
    if (navigator.share) {
      try {
        await navigator.share({ title: titulo, text: texto, url });
        return;
      } catch {
        // usuário cancelou o compartilhamento — sem problema, não faz nada
        return;
      }
    }
    window.open(
      `https://wa.me/?text=${encodeURIComponent(texto)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  async function copiarLink() {
    await navigator.clipboard.writeText(url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <div className="flex gap-2">
      <Button onClick={compartilhar} className="flex-1">
        <span className="flex items-center justify-center gap-2">
          <Share2 size={16} />
          Compartilhar
        </span>
      </Button>
      <Button onClick={copiarLink} variant="secondary" aria-label="Copiar link">
        {copiado ? <Check size={16} /> : <Copy size={16} />}
      </Button>
    </div>
  );
}
