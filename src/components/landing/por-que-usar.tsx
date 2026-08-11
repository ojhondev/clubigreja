import { Check, X } from "lucide-react";

const ANTES = [
  "Envelope físico e planilha de Excel para controlar o dízimo",
  "Prestação de contas manual, sujeita a erro",
  "Fiel sem forma simples de contribuir quando não está no culto",
  "Campanhas divulgadas só de boca em boca",
];

const DEPOIS = [
  "Todo o financeiro em um painel, com extrato automático",
  "Relatório pronto para prestação de contas à congregação",
  "Fiel contribui a qualquer hora, de qualquer lugar, em poucos toques",
  "Campanha com link e QR Code prontos para WhatsApp",
];

export function PorQueUsar() {
  return (
    <section id="por-que-usar" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <span className="text-sm font-bold text-primary">Por que usar o Dizipay</span>
        <h2 className="font-display mt-2 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
          Do jeito antigo para o jeito simples.
        </h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-3xl border border-border bg-white p-8">
          <p className="font-display mb-5 text-lg font-bold text-muted">Sem o Dizipay</p>
          <ul className="space-y-4">
            {ANTES.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
                  <X size={14} />
                </span>
                <span className="text-muted">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border-2 border-primary bg-[#EAF6FF] p-8">
          <p className="font-display mb-5 text-lg font-bold text-primary">Com o Dizipay</p>
          <ul className="space-y-4">
            {DEPOIS.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <Check size={14} />
                </span>
                <span className="font-medium text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
