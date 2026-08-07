"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlayCircle, X } from "lucide-react";
import { Button } from "@/components/ui";

export function SimulacaoBar() {
  const [fechada, setFechada] = useState(false);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisivel(window.scrollY > 400);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (fechada || !visivel) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center gap-3 sm:gap-4">
        <PlayCircle className="hidden shrink-0 text-primary sm:block" size={28} />
        <p className="flex-1 text-sm font-bold text-foreground sm:text-base">
          Veja uma simulação de como funciona
        </p>
        <Link href="/simulacao" className="shrink-0">
          <Button variant="dark" className="font-display">
            Ver simulação
          </Button>
        </Link>
        <button
          type="button"
          onClick={() => setFechada(true)}
          aria-label="Fechar"
          className="shrink-0 rounded-full p-1.5 text-muted hover:bg-black/5 hover:text-foreground"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
