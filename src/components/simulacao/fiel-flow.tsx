"use client";

import { motion } from "framer-motion";
import { Check, CreditCard } from "lucide-react";
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
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-4 rounded-xl bg-[#F7FAFF] px-3 py-2.5"
      >
        <p className="text-xs text-muted">Você vai pagar</p>
        <p className="text-lg font-bold text-foreground">R$ 103,50</p>
        <p className="mt-1 text-[11px] text-muted">Já inclui a taxa de processamento — a igreja recebe R$ 100,00.</p>
      </motion.div>
    </PhoneFrame>
  );
}

function TelaPagamento() {
  return (
    <PhoneFrame>
      <p className="mb-3 text-sm font-bold text-foreground">Confirmar contribuição</p>
      <div className="rounded-xl border border-border bg-white px-3 py-2.5">
        <p className="text-xs text-muted">Pix da doação</p>
        <p className="text-sm font-bold text-foreground">R$ 100,00 direto pra igreja</p>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2.5">
        <CreditCard size={16} className="shrink-0 text-primary" />
        <p className="text-xs text-muted">Taxa cobrada automaticamente no cartão final 4242</p>
      </div>
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: [1, 0.96, 1] }}
        transition={{ duration: 1.4, repeat: Infinity }}
        className="mt-6 rounded-full bg-primary py-3 text-center text-sm font-bold text-white"
      >
        Confirmar contribuição
      </motion.div>
      <p className="mt-3 text-center text-[11px] text-muted">Uma confirmação só — o Pix e a taxa acontecem juntos.</p>
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
          Dízimo · R$ 100,00 pra igreja + R$ 3,50 de taxa
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 text-xs text-muted"
        >
          A igreja recebe os 100% na hora. A taxa é paga por você, à parte.
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
      descricao: "O total já aparece com a taxa incluída, antes de confirmar — sem cálculo escondido.",
      render: () => <TelaValor />,
    },
    {
      titulo: "Uma confirmação só",
      descricao:
        "O Pix vai direto pra igreja e a taxa é cobrada ao mesmo tempo no cartão salvo — sem pedir uma segunda aprovação.",
      render: () => <TelaPagamento />,
    },
    {
      titulo: "Recebe o comprovante na hora",
      descricao: "Com o valor que foi pra igreja e a taxa que o fiel pagou, bem separados.",
      render: () => <TelaComprovante />,
    },
  ];

  return <StepFlow steps={steps} />;
}
