"use client";

import { useState } from "react";
import {
  DIZIMISTAS_MAX,
  DIZIMISTAS_MIN,
  VALOR_MEDIO_MAX,
  VALOR_MEDIO_MIN,
  calcularProjecaoArrecadacao,
} from "@/lib/calculadora-arrecadacao";

function formatarInteiro(valor: number): string {
  return valor.toLocaleString("pt-BR", { maximumFractionDigits: 0 });
}

function formatarMoedaInteira(valor: number): string {
  return `R$ ${formatarInteiro(valor)}`;
}

export function CalculadoraArrecadacao() {
  const [dizimistas, setDizimistas] = useState(250);
  const [valorMedio, setValorMedio] = useState(80);
  const { arrecadacaoAtual, projecaoComClub, aumentoMensal, aumentoAnual } = calcularProjecaoArrecadacao(
    dizimistas,
    valorMedio
  );

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="rounded-3xl border border-border bg-white p-6 sm:p-8">
        <label className="block">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-bold text-foreground">Dizimistas e doadores ativos</span>
            <span className="rounded-full bg-[#EAF6FF] px-3 py-1 text-sm font-bold text-primary">
              {formatarInteiro(dizimistas)}
            </span>
          </div>
          <input
            type="range"
            min={DIZIMISTAS_MIN}
            max={DIZIMISTAS_MAX}
            step={10}
            value={dizimistas}
            onChange={(e) => setDizimistas(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="mt-1 flex justify-between text-xs text-muted">
            <span>{formatarInteiro(DIZIMISTAS_MIN)}</span>
            <span>{formatarInteiro(DIZIMISTAS_MAX)}</span>
          </div>
        </label>

        <label className="mt-6 block">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-bold text-foreground">Valor médio por contribuição</span>
            <span className="rounded-full bg-[#EAF6FF] px-3 py-1 text-sm font-bold text-primary">
              {formatarMoedaInteira(valorMedio)}
            </span>
          </div>
          <input
            type="range"
            min={VALOR_MEDIO_MIN}
            max={VALOR_MEDIO_MAX}
            step={5}
            value={valorMedio}
            onChange={(e) => setValorMedio(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="mt-1 flex justify-between text-xs text-muted">
            <span>{formatarMoedaInteira(VALOR_MEDIO_MIN)}</span>
            <span>{formatarMoedaInteira(VALOR_MEDIO_MAX)}</span>
          </div>
        </label>

        <p className="mt-6 border-t border-border pt-4 text-xs text-muted">
          Projeção baseada no aumento médio de <strong className="text-foreground">40%</strong> relatado por
          comunidades no primeiro ano após ativar o canal digital de contribuição. Resultados variam
          conforme a divulgação feita na paróquia.
        </p>
      </div>

      <div className="rounded-3xl bg-primary p-6 text-white sm:p-8">
        <div className="flex items-center justify-between border-b border-white/15 pb-4">
          <span className="text-sm text-white/70">Arrecadação mensal hoje</span>
          <span className="text-xl font-bold">{formatarMoedaInteira(arrecadacaoAtual)}</span>
        </div>

        <p className="mt-5 text-xs font-bold uppercase tracking-wide text-accent">
          Projeção com o Club Igreja
        </p>
        <p className="font-display mt-1 text-4xl font-bold sm:text-5xl">
          {formatarMoedaInteira(projecaoComClub)}
        </p>
        <span className="mt-3 inline-block rounded-full bg-white/15 px-3 py-1 text-sm font-bold text-accent">
          + {formatarMoedaInteira(aumentoMensal)} por mês
        </span>

        <p className="mt-6 text-sm text-white/80">
          Em 12 meses, isso é <strong className="text-white">{formatarMoedaInteira(aumentoAnual)}</strong> a
          mais para as obras, a manutenção e as pastorais da sua comunidade.
        </p>
      </div>
    </div>
  );
}
