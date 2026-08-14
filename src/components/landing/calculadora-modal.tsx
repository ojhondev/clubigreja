"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui";
import { CalculadoraArrecadacao } from "./calculadora-arrecadacao";

const CHAVE_SESSAO = "club-igreja-calculadora-vista";

// Aparece uma vez por sessão de navegador, 3s depois da primeira visita —
// mesmo comportamento de aparição que o antigo popup de vídeo, só que sem
// nenhuma trava de fechamento: uma calculadora não precisa prender ninguém.
export function CalculadoraModal() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || sessionStorage.getItem(CHAVE_SESSAO))
      return;

    const timer = setTimeout(() => {
      sessionStorage.setItem(CHAVE_SESSAO, "1");
      setVisivel(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!visivel) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4">
      <div className="relative max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-y-auto rounded-3xl bg-[#F7FAFF] p-5 sm:p-8">
        <button
          type="button"
          onClick={() => setVisivel(false)}
          aria-label="Fechar"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-foreground hover:bg-black/10"
        >
          <X size={18} />
        </button>

        <span className="inline-block rounded-full border border-black/10 bg-white px-4 py-1.5 text-sm font-bold text-foreground">
          Calculadora
        </span>
        <h2 className="font-display mt-4 max-w-md text-2xl font-bold leading-tight text-foreground sm:text-3xl">
          Quanto a sua comunidade deixa de arrecadar por mês?
        </h2>
        <p className="mt-2 max-w-lg text-muted">
          Ajuste os números da sua realidade e veja a projeção com o canal
          digital ativo.
        </p>

        <div className="mt-6">
          <CalculadoraArrecadacao />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/cadastrar-igreja"
            className="sm:flex-1"
            onClick={() => setVisivel(false)}
          >
            <Button className="w-full font-display">
              Cadastre-se é grátis
            </Button>
          </Link>
          <Link
            href="/calculadora"
            className="sm:flex-1"
            onClick={() => setVisivel(false)}
          >
            <Button variant="secondary" className="w-full font-display">
              Ver calculadora completa
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
