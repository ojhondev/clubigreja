"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

// Abre um aviso no momento em que o fiel decide seguir pro Pix, pra ele não
// esquecer de voltar e confirmar depois — sem esse toque, a taxa nunca é
// cobrada. O botão de dentro do aviso é o type="submit" de verdade: como o
// aviso continua dentro do mesmo <form>, confirmar aqui já envia a etapa 1.
export function BotaoContinuarPix({
  label = "Continuar para o Pix",
}: {
  label?: string;
}) {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <Button type="button" className="w-full" onClick={() => setAberto(true)}>
        {label}
      </Button>

      {aberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
            <p className="text-base font-medium text-foreground">
              Ao efetuar o pagamento, toque em{" "}
              <strong>&quot;Já fiz o Pix&quot;</strong> para que façamos o
              processamento do seu pagamento.
            </p>
            <Button type="submit" className="mt-5 w-full">
              Entendi, continuar
            </Button>
            <button
              type="button"
              onClick={() => setAberto(false)}
              className="mt-3 w-full text-center text-sm font-bold text-muted"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
