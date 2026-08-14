"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Step {
  titulo: string;
  descricao: string;
  render: () => ReactNode;
}

const DURACAO_MS = 4200;

export function StepFlow({ steps }: { steps: Step[] }) {
  const [indice, setIndice] = useState(0);
  const [pausado, setPausado] = useState(false);

  // Reagenda a cada troca de passo (autoplay ou manual) em vez de usar um
  // setInterval solto — evita que um tick de autoplay atrasado colida com um
  // clique manual e deixe o AnimatePresence com dois updates concorrentes.
  useEffect(() => {
    if (pausado) return;
    const t = setTimeout(
      () => setIndice((i) => (i + 1) % steps.length),
      DURACAO_MS,
    );
    return () => clearTimeout(t);
  }, [pausado, indice, steps.length]);

  const step = steps[indice];

  return (
    <div
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      className="grid gap-10 lg:grid-cols-2 lg:items-center"
    >
      <div>
        <motion.div
          key={indice}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <span className="text-sm font-bold text-primary">
            Passo {indice + 1} de {steps.length}
          </span>
          <h3 className="font-display mt-2 text-2xl font-bold text-foreground sm:text-3xl">
            {step.titulo}
          </h3>
          <p className="mt-3 max-w-md text-lg text-muted">{step.descricao}</p>
        </motion.div>

        <div className="mt-8 flex items-center gap-4">
          <button
            type="button"
            aria-label="Passo anterior"
            onClick={() =>
              setIndice((indice - 1 + steps.length) % steps.length)
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-foreground hover:bg-black/5"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex gap-2">
            {steps.map((s, i) => (
              <button
                key={s.titulo}
                type="button"
                aria-label={`Ir para o passo ${i + 1}`}
                onClick={() => setIndice(i)}
                className={`h-2.5 rounded-full transition-all ${
                  i === indice
                    ? "w-7 bg-primary"
                    : "w-2.5 bg-black/15 hover:bg-black/25"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Próximo passo"
            onClick={() => setIndice((indice + 1) % steps.length)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-foreground hover:bg-black/5"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        <motion.div
          key={indice}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
        >
          {step.render()}
        </motion.div>
      </div>
    </div>
  );
}
