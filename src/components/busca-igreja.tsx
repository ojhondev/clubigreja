"use client";

import { useEffect, useRef, useState } from "react";

interface ResultadoIgreja {
  id: string;
  nome: string;
  cidade: string;
  uf: string;
  logoEmoji: string;
}

export function BuscaIgreja({ nomeCampo = "igrejaId" }: { nomeCampo?: string }) {
  const [texto, setTexto] = useState("");
  const [selecionada, setSelecionada] = useState<ResultadoIgreja | null>(null);
  const [resultados, setResultados] = useState<ResultadoIgreja[]>([]);
  const [aberto, setAberto] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (selecionada || texto.trim().length < 2) {
      setResultados([]);
      return;
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      const resposta = await fetch(`/api/igrejas/buscar?q=${encodeURIComponent(texto)}`);
      const dados = await resposta.json();
      setResultados(dados.resultados);
      setAberto(true);
    }, 250);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [texto, selecionada]);

  return (
    <div className="relative flex flex-col gap-1">
      <span className="text-sm font-bold text-muted">Sua igreja</span>
      <input
        value={selecionada ? `${selecionada.nome} — ${selecionada.cidade}/${selecionada.uf}` : texto}
        onChange={(e) => {
          setSelecionada(null);
          setTexto(e.target.value);
        }}
        onFocus={() => resultados.length > 0 && setAberto(true)}
        placeholder="Digite o nome da sua igreja ou cidade"
        autoComplete="off"
        required
        className="rounded-xl border border-border px-4 py-3"
      />
      <input type="hidden" name={nomeCampo} value={selecionada?.id ?? ""} required />

      {aberto && resultados.length > 0 && (
        <div className="absolute top-full z-10 mt-1 w-full overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          {resultados.map((igreja) => (
            <button
              key={igreja.id}
              type="button"
              onClick={() => {
                setSelecionada(igreja);
                setAberto(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#EAF6FF]"
            >
              <span className="text-xl">{igreja.logoEmoji}</span>
              <span>
                <span className="block font-medium">{igreja.nome}</span>
                <span className="block text-xs text-muted">
                  {igreja.cidade}/{igreja.uf}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
      {aberto && texto.trim().length >= 2 && resultados.length === 0 && (
        <p className="absolute top-full z-10 mt-1 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted shadow-lg">
          Nenhuma igreja encontrada com esse nome.
        </p>
      )}
    </div>
  );
}
