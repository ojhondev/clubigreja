"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { PhoneFrame } from "./phone-frame";
import { StepFlow, type Step } from "./step-flow";

function TelaEscanear({ qrDataUrl }: { qrDataUrl: string }) {
  return (
    <PhoneFrame>
      <p className="mb-3 text-sm font-bold text-foreground">Aponte a câmera para o QR Code</p>
      <div className="relative flex flex-1 items-center justify-center rounded-2xl border border-border bg-white p-6">
        {}
        <img src={qrDataUrl} alt="QR Code para escanear" className="h-40 w-40" />
        <motion.div
          initial={{ y: -70 }}
          animate={{ y: 70 }}
          transition={{ duration: 1.6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="pointer-events-none absolute h-0.5 w-32 rounded-full bg-accent shadow-[0_0_12px_2px_rgba(96,205,255,0.8)]"
        />
      </div>
      <p className="mt-4 text-center text-xs text-muted">
        Ou toca no link recebido pelo WhatsApp — sem precisar baixar nenhum app.
      </p>
    </PhoneFrame>
  );
}

function TelaValor() {
  const valores = ["R$ 30", "R$ 50", "R$ 100", "R$ 200"];
  return (
    <PhoneFrame>
      <p className="mb-3 text-sm font-bold text-foreground">Contribuir</p>
      <div className="rounded-xl border border-border bg-white px-3 py-2.5">
        <p className="text-xs text-muted">Finalidade</p>
        <p className="text-sm font-bold text-foreground">Dízimo</p>
      </div>
      <p className="mb-2 mt-4 text-xs font-medium text-muted">Ou digite outro valor</p>
      <div className="grid grid-cols-2 gap-2">
        {valores.map((v, i) => (
          <motion.div
            key={v}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: v === "R$ 100" ? 1.04 : 1 }}
            transition={{ delay: 0.12 * i, duration: 0.3 }}
            className={`rounded-xl border-2 px-3 py-2.5 text-center text-sm font-bold ${
              v === "R$ 100"
                ? "border-primary bg-[#EAF6FF] text-primary"
                : "border-border bg-white text-foreground"
            }`}
          >
            {v}
          </motion.div>
        ))}
      </div>
    </PhoneFrame>
  );
}

function TelaPagamento() {
  return (
    <PhoneFrame>
      <p className="mb-3 text-sm font-bold text-foreground">Como você quer pagar?</p>
      <div className="flex gap-3">
        <div className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-primary bg-[#EAF6FF] px-3 py-3 text-sm font-bold text-primary">
          <span className="h-2.5 w-2.5 rounded-full bg-primary" />
          Pix
        </div>
        <div className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-border px-3 py-3 text-sm font-bold text-muted">
          <span className="h-2.5 w-2.5 rounded-full border border-muted" />
          Cartão
        </div>
      </div>
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: [1, 0.96, 1] }}
        transition={{ duration: 1.4, repeat: Infinity }}
        className="mt-6 rounded-full bg-primary py-3 text-center text-sm font-bold text-white"
      >
        Confirmar contribuição
      </motion.div>
    </PhoneFrame>
  );
}

function TelaComprovante() {
  return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success"
        >
          <Check size={32} strokeWidth={3} />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-lg font-bold text-foreground"
        >
          Contribuição confirmada!
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-1 text-sm text-muted"
        >
          Dízimo · R$ 100,00 · Pix
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 text-xs text-muted"
        >
          Comprovante enviado automaticamente. A igreja recebe direto na conta.
        </motion.p>
      </div>
    </PhoneFrame>
  );
}

export function FielFlow({ qrDataUrl }: { qrDataUrl: string }) {
  const steps: Step[] = [
    {
      titulo: "O fiel escaneia o QR Code ou abre o link",
      descricao: "Nenhum aplicativo para baixar — funciona direto do mural, do panfleto ou do WhatsApp.",
      render: () => <TelaEscanear qrDataUrl={qrDataUrl} />,
    },
    {
      titulo: "Escolhe a finalidade e o valor",
      descricao: "Dízimo, oferta ou uma campanha específica — com valores sugeridos para agilizar em poucos toques.",
      render: () => <TelaValor />,
    },
    {
      titulo: "Escolhe Pix ou cartão e confirma",
      descricao: "Sem cadastro complicado. Poucos toques e a contribuição já está a caminho da conta da igreja.",
      render: () => <TelaPagamento />,
    },
    {
      titulo: "Recebe o comprovante na hora",
      descricao: "O fiel guarda o histórico de tudo o que já contribuiu, sem a igreja precisar fazer nada.",
      render: () => <TelaComprovante />,
    },
  ];

  return <StepFlow steps={steps} />;
}
