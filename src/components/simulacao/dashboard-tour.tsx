"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { BrowserFrame } from "./browser-frame";
import { StepFlow, type Step } from "./step-flow";

function CartaoStat({
  label,
  valor,
  delay,
}: {
  label: string;
  valor: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="rounded-xl border border-border bg-white px-3 py-2.5"
    >
      <p className="text-[11px] text-muted">{label}</p>
      <p className="text-sm font-bold text-foreground">{valor}</p>
    </motion.div>
  );
}

function TelaVisaoGeral() {
  return (
    <BrowserFrame>
      <p className="mb-1 text-xs text-muted">Bem-vindo(a) de volta,</p>
      <p className="mb-3 text-sm font-bold text-foreground">
        Igreja Batista Nova Vida
      </p>
      <div className="grid grid-cols-2 gap-2">
        <CartaoStat
          label="Arrecadado este mês"
          valor="R$ 4.230,00"
          delay={0.1}
        />
        <CartaoStat label="Contribuições" valor="38 este mês" delay={0.2} />
        <CartaoStat
          label="Campanhas ativas"
          valor="2 em captação"
          delay={0.3}
        />
        <CartaoStat label="Dízimo recorrente" valor="R$ 2.850,00" delay={0.4} />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-3 flex items-center gap-1.5 rounded-full bg-[#EAF6FF] px-3 py-1.5 text-xs font-bold text-primary"
      >
        <TrendingUp size={13} />
        +18% vs. mês anterior
      </motion.div>
    </BrowserFrame>
  );
}

function TelaGraficos() {
  const barras = [40, 65, 50, 80, 60, 95];
  return (
    <BrowserFrame>
      <p className="mb-3 text-sm font-bold text-foreground">Geral</p>
      <div className="flex h-32 items-end gap-2">
        {barras.map((altura, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${altura}%` }}
            transition={{ delay: 0.1 * i, duration: 0.5, ease: "easeOut" }}
            className="flex-1 rounded-t-md bg-primary"
          />
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-4 flex items-center gap-4 text-[11px] text-muted"
      >
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-primary" /> Dízimo
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-accent" /> Campanha
        </span>
      </motion.div>
    </BrowserFrame>
  );
}

function TelaContribuicoes() {
  const linhas = [
    { nome: "Ana Beatriz Souza", tipo: "Dízimo · Pix", valor: "R$ 100,00" },
    { nome: "Carlos Eduardo Lima", tipo: "Dízimo · Pix", valor: "R$ 100,00" },
    { nome: "Roberto Nascimento", tipo: "Campanha · Pix", valor: "R$ 150,00" },
  ];
  return (
    <BrowserFrame>
      <p className="mb-3 text-sm font-bold text-foreground">
        Últimas contribuições
      </p>
      <div className="space-y-2">
        {linhas.map((linha, i) => (
          <motion.div
            key={linha.nome}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 * i, duration: 0.3 }}
            className="flex items-center justify-between rounded-xl border border-border bg-white px-3 py-2.5"
          >
            <div>
              <p className="text-xs font-bold text-foreground">{linha.nome}</p>
              <p className="text-[11px] text-muted">{linha.tipo}</p>
            </div>
            <p className="text-xs font-bold text-foreground">{linha.valor}</p>
          </motion.div>
        ))}
      </div>
    </BrowserFrame>
  );
}

function TelaCampanhas() {
  const campanhas = [
    { emoji: "🔨", titulo: "Reforma do telhado", pct: 62 },
    { emoji: "✈️", titulo: "Missão Moçambique 2026", pct: 34 },
  ];
  return (
    <BrowserFrame>
      <p className="mb-3 text-sm font-bold text-foreground">
        Campanhas em captação
      </p>
      <div className="space-y-4">
        {campanhas.map((c, i) => (
          <motion.div
            key={c.titulo}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * i, duration: 0.3 }}
            className="rounded-xl border border-border bg-white p-3"
          >
            <p className="mb-2 text-xs font-bold text-foreground">
              {c.emoji} {c.titulo}
            </p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-border">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${c.pct}%` }}
                transition={{
                  delay: 0.3 + 0.2 * i,
                  duration: 0.6,
                  ease: "easeOut",
                }}
                className="h-full rounded-full bg-primary"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-muted">{c.pct}% da meta</p>
          </motion.div>
        ))}
      </div>
    </BrowserFrame>
  );
}

export function DashboardTour() {
  const steps: Step[] = [
    {
      titulo: "Tudo em um painel só",
      descricao:
        "Arrecadação, contribuições e campanhas — a igreja vê tudo de relance, sem planilha.",
      render: () => <TelaVisaoGeral />,
    },
    {
      titulo: "Gráficos que contam a história",
      descricao:
        "Evolução mês a mês, separada por dízimo e campanha, pra igreja acompanhar o crescimento.",
      render: () => <TelaGraficos />,
    },
    {
      titulo: "Contribuições em tempo real",
      descricao:
        "Cada contribuição aparece assim que é confirmada — sem esperar fechamento de caixa.",
      render: () => <TelaContribuicoes />,
    },
    {
      titulo: "Campanhas com progresso visível",
      descricao:
        "A igreja acompanha cada campanha em andamento, com a meta e o quanto já foi arrecadado.",
      render: () => <TelaCampanhas />,
    },
  ];

  return <StepFlow steps={steps} />;
}
