import { RefreshCw, TrendingUp } from "lucide-react";

export function SobreOClub() {
  return (
    <section id="sobre" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <span className="text-sm font-bold text-primary">O que é o Club Igreja</span>
        <h2 className="font-display mt-2 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
          Mais recursos em campanha. Dízimo recorrente sem esforço.
        </h2>
        <p className="mt-4 text-lg text-muted">
          O Club Igreja resolve as duas dores que mais travam a arrecadação: campanhas que não
          alcançam gente suficiente e dízimo que depende do fiel lembrar todo mês.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-3xl border border-border bg-white p-8">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF6FF] text-primary">
            <TrendingUp size={26} />
          </span>
          <p className="font-display mt-6 text-2xl font-bold text-foreground">Campanhas que arrecadam mais</p>
          <p className="mt-3 text-muted">
            Link e QR Code prontos em segundos para divulgar no WhatsApp, no mural e em material
            impresso — sua igreja alcança muito mais gente do que só de boca em boca, e acompanha o
            progresso em tempo real.
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-white p-8">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF6FF] text-primary">
            <RefreshCw size={26} />
          </span>
          <p className="font-display mt-6 text-2xl font-bold text-foreground">Dízimo recorrente sem fricção</p>
          <p className="mt-3 text-muted">
            O fiel contribui em poucos toques, todo mês, sem precisar lembrar — e recebe um lembrete
            automático quando esquece. Simples para quem dá, simples para quem recebe.
          </p>
        </div>
      </div>
    </section>
  );
}
