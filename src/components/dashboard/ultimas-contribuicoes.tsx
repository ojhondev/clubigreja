import { formatarMoeda } from "@/lib/comissao";
import { formatarData } from "@/lib/formato";
import type { ContribuicaoRecente } from "@/lib/relatorios";

const ROTULO_TIPO: Record<string, string> = {
  dizimo: "Dízimo",
  oferta: "Oferta",
  campanha: "Campanha",
  evento: "Evento",
  livre: "Valor livre",
};

const ROTULO_MEIO: Record<string, string> = {
  pix: "Pix",
  cartao: "Cartão",
  boleto: "Boleto",
};

export function UltimasContribuicoes({
  itens,
}: {
  itens: ContribuicaoRecente[];
}) {
  if (itens.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted">
        Nenhuma contribuição ainda.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {itens.map((c) => (
        <li
          key={c.id}
          className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
        >
          <div>
            <p className="text-sm font-bold text-foreground">{c.fielNome}</p>
            <p className="text-xs text-muted">
              {ROTULO_TIPO[c.tipo]} · {ROTULO_MEIO[c.meio]} ·{" "}
              {formatarData(c.criadaEm)}
            </p>
          </div>
          <p className="text-sm font-bold text-foreground">
            {formatarMoeda(c.valorBruto)}
          </p>
        </li>
      ))}
    </ul>
  );
}
