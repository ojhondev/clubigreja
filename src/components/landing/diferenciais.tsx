import { Zap, ShieldCheck, Wallet, QrCode, FileText, Smartphone } from "lucide-react";

const ITENS = [
  {
    icon: Wallet,
    titulo: "Sem mensalidade",
    descricao: "Sua igreja nunca paga nada pra usar o Dizipay. Nenhum custo fixo, nenhuma surpresa.",
  },
  {
    icon: Zap,
    titulo: "Você recebe 100%",
    descricao: "Cada contribuição vai direto pro Pix da igreja, na hora — nenhum valor é retido ou repassado depois.",
  },
  {
    icon: ShieldCheck,
    titulo: "Feito para todas as idades",
    descricao: "Fluxo simples o suficiente para o fiel mais jovem e o mais experiente com tecnologia.",
  },
  {
    icon: QrCode,
    titulo: "QR Code pronto para imprimir",
    descricao: "Cada campanha e cada link de dízimo gera um QR Code pronto para o mural, panfleto ou adesivo.",
  },
  {
    icon: FileText,
    titulo: "Comprovante automático",
    descricao: "Todo fiel recebe o comprovante da própria contribuição, sem a igreja precisar fazer nada.",
  },
  {
    icon: Smartphone,
    titulo: "Sem app para baixar",
    descricao: "O fiel contribui direto pelo link ou QR Code — o cadastro leva menos de um minuto.",
  },
];

export function Diferenciais() {
  return (
    <section id="diferenciais" className="bg-[#F7FAFF] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-sm font-bold text-primary">Diferenciais</span>
          <h2 className="font-display mt-2 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            Pensado para a realidade da sua igreja.
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ITENS.map((item) => (
            <div key={item.titulo} className="rounded-2xl bg-white p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF6FF] text-primary">
                <item.icon size={20} />
              </span>
              <p className="mt-4 font-bold text-foreground">{item.titulo}</p>
              <p className="mt-1 text-sm text-muted">{item.descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
