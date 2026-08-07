import { HandCoins, LayoutDashboard, Users } from "lucide-react";

const PILARES = [
  {
    icon: HandCoins,
    titulo: "Arrecadar",
    descricao:
      "Dízimo recorrente, ofertas, campanhas e eventos — via Pix, cartão, QR Code ou link direto. O fiel contribui em poucos toques, sem precisar baixar nada.",
  },
  {
    icon: LayoutDashboard,
    titulo: "Organizar",
    descricao:
      "Painel financeiro com extrato pronto para prestação de contas, mural de comunicados e gestão de campanhas — cada contribuição já cai direto na conta da igreja, sem prazo de repasse.",
  },
  {
    icon: Users,
    titulo: "Conectar",
    descricao:
      "O fiel acompanha o mural, as campanhas em andamento e o próprio histórico de contribuição — tudo em um app simples, feito para todas as idades.",
  },
];

export function Pilares() {
  return (
    <section id="pilares" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <span className="text-sm font-bold text-primary">Nossos 3 pilares</span>
        <h2 className="font-display mt-2 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
          Arrecadar. Organizar. Conectar.
        </h2>
        <p className="mt-4 text-lg text-muted">
          Cada parte do Club Igreja existe para resolver um problema real da sua igreja — do
          envelope físico até a prestação de contas.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {PILARES.map((p) => (
          <div key={p.titulo} className="rounded-3xl border border-border bg-white p-8">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF6FF] text-primary">
              <p.icon size={26} />
            </span>
            <p className="font-display mt-6 text-2xl font-bold text-foreground">{p.titulo}</p>
            <p className="mt-3 text-muted">{p.descricao}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
