"use client";

import { motion } from "framer-motion";
import { MessageCircle, Printer, QrCode as QrCodeIcon } from "lucide-react";
import { PhoneFrame } from "./phone-frame";
import { StepFlow, type Step } from "./step-flow";

const CAMPOS_FORM = [
  { rotulo: "Título", valor: "Reforma do telhado" },
  { rotulo: "Meta", valor: "R$ 15.000" },
  { rotulo: "Prazo", valor: "20/12/2026" },
  { rotulo: "Emoji de destaque", valor: "🔨" },
];

function TelaFormulario() {
  return (
    <PhoneFrame>
      <p className="mb-3 text-sm font-bold text-foreground">
        Criar nova campanha
      </p>
      <div className="space-y-3">
        {CAMPOS_FORM.map((campo, i) => (
          <motion.div
            key={campo.rotulo}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 * i, duration: 0.3 }}
            className="rounded-xl border border-border bg-white px-3 py-2.5"
          >
            <p className="text-xs text-muted">{campo.rotulo}</p>
            <p className="text-sm font-bold text-foreground">{campo.valor}</p>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-4 rounded-full bg-primary py-3 text-center text-sm font-bold text-white"
      >
        Criar campanha
      </motion.div>
    </PhoneFrame>
  );
}

function TelaQrCode({ qrDataUrl }: { qrDataUrl: string }) {
  return (
    <PhoneFrame>
      <p className="mb-3 text-sm font-bold text-foreground">
        Link gerado automaticamente
      </p>
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center rounded-2xl border border-border bg-white p-4"
      >
        {}
        <img src={qrDataUrl} alt="QR Code da campanha" className="h-36 w-36" />
        <p className="mt-3 break-all text-center text-xs font-medium text-muted">
          dclubigreja.com/novavida/campanha/reforma-do-telhado
        </p>
      </motion.div>
      <p className="mt-4 text-center text-xs text-muted">
        Pronto para o mural, panfleto ou adesivo — sem precisar de designer.
      </p>
    </PhoneFrame>
  );
}

function TelaCompartilhar() {
  const canais = [
    { icon: MessageCircle, nome: "WhatsApp" },
    { icon: QrCodeIcon, nome: "Mural da igreja" },
    { icon: Printer, nome: "Impresso" },
  ];
  return (
    <PhoneFrame>
      <p className="mb-3 text-sm font-bold text-foreground">
        Divulgar a campanha
      </p>
      <div className="space-y-3">
        {canais.map((c, i) => (
          <motion.div
            key={c.nome}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 * i, duration: 0.3 }}
            className="flex items-center gap-3 rounded-xl border border-border bg-white px-3 py-3"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <c.icon size={18} />
            </span>
            <p className="text-sm font-bold text-foreground">{c.nome}</p>
          </motion.div>
        ))}
      </div>
    </PhoneFrame>
  );
}

function TelaProgresso() {
  return (
    <PhoneFrame>
      <p className="mb-1 text-2xl">🔨</p>
      <p className="text-sm font-bold text-foreground">
        Reforma do telhado do templo
      </p>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{ transformOrigin: "left" }}
        className="mt-3 h-3 w-full overflow-hidden rounded-full bg-border"
      >
        <div className="h-full w-[62%] rounded-full bg-primary" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-2 text-sm font-medium text-muted"
      >
        R$ 9.300 de R$ 15.000 (62%)
      </motion.p>
      <div className="mt-5 space-y-2">
        {["Ana Beatriz Souza — R$ 100", "Carlos Eduardo Lima — R$ 250"].map(
          (linha, i) => (
            <motion.div
              key={linha}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + i * 0.3 }}
              className="rounded-xl border border-border bg-white px-3 py-2 text-xs font-medium text-foreground"
            >
              {linha}
            </motion.div>
          ),
        )}
      </div>
    </PhoneFrame>
  );
}

export function IgrejaFlow({ qrDataUrl }: { qrDataUrl: string }) {
  const steps: Step[] = [
    {
      titulo: "A igreja cria a campanha",
      descricao:
        "Em menos de um minuto, o administrador define título, meta e prazo — sem precisar de conhecimento técnico.",
      render: () => <TelaFormulario />,
    },
    {
      titulo: "O Dizipay gera o link e o QR Code na hora",
      descricao:
        "Cada campanha ganha um link próprio e um QR Code pronto para imprimir, sem custo e sem esperar ninguém configurar nada.",
      render: () => <TelaQrCode qrDataUrl={qrDataUrl} />,
    },
    {
      titulo: "A igreja divulga do jeito que já usa",
      descricao:
        "WhatsApp, mural físico ou material impresso — o link e o QR Code funcionam em qualquer canal.",
      render: () => <TelaCompartilhar />,
    },
    {
      titulo: "O progresso atualiza sozinho",
      descricao:
        "Cada contribuição cai direto na conta da igreja e o painel financeiro se atualiza em tempo real, sem planilha manual.",
      render: () => <TelaProgresso />,
    },
  ];

  return <StepFlow steps={steps} />;
}
