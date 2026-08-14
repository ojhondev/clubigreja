import { Church, Heart } from "lucide-react";

const CATOLICAS = [
  "Várias campanhas ao mesmo tempo — festa do padroeiro, reforma do templo, obras da pastoral",
  "Cada pastoral pode ter seu próprio link de arrecadação, com relatório separado",
  "Extrato pronto para prestar contas ao conselho paroquial",
  "QR Code para a coleta, a festa e a quermesse — sem trocar dinheiro na mão",
];

const EVANGELICAS = [
  "Dízimo recorrente como carro-chefe, com lembrete automático para quem esquecer",
  "Campanhas de missões e construção com meta e progresso visíveis para a igreja toda",
  "Mural para avisos de células, cultos especiais e escalas de ministério",
  "Oferta alçada e ofertas de gratidão em links separados, fáceis de divulgar",
];

export function Denominacoes() {
  return (
    <section
      id="denominacoes"
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24"
    >
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <span className="text-sm font-bold text-primary">Para cada igreja</span>
        <h2 className="font-display mt-2 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
          Feito para a realidade católica e evangélica.
        </h2>
        <p className="mt-4 text-lg text-muted">
          O jeito de arrecadar muda de igreja para igreja — o Dizipay se adapta
          à sua.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div
          id="catolicas"
          className="scroll-mt-24 rounded-3xl border border-border bg-white p-8"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF6FF] text-primary">
            <Church size={26} />
          </span>
          <p className="font-display mt-6 text-2xl font-bold text-foreground">
            Igrejas Católicas
          </p>
          <p className="mt-2 text-muted">Paróquias, pastorais e comunidades.</p>
          <ul className="mt-6 space-y-3">
            {CATOLICAS.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm text-foreground"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div
          id="evangelicas"
          className="scroll-mt-24 rounded-3xl border border-border bg-white p-8"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF6FF] text-primary">
            <Heart size={26} />
          </span>
          <p className="font-display mt-6 text-2xl font-bold text-foreground">
            Igrejas Evangélicas
          </p>
          <p className="mt-2 text-muted">
            Igrejas locais, células e ministérios.
          </p>
          <ul className="mt-6 space-y-3">
            {EVANGELICAS.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm text-foreground"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
