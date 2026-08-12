import { getOrigemWebmaster } from "@/lib/auth/session";
import { voltarAoPainelWebmaster } from "@/lib/auth/actions";

export async function BannerAcessoWebmaster() {
  const origem = await getOrigemWebmaster();
  if (!origem) return null;

  return (
    <div className="flex items-center justify-between gap-3 bg-foreground px-4 py-2 text-xs text-white sm:px-6">
      <p>
        Acessando como esta conta em nome de <span className="font-bold">{origem.webmasterNome}</span> (WebMaster).
      </p>
      <form action={voltarAoPainelWebmaster}>
        <button type="submit" className="shrink-0 rounded-full bg-white/15 px-3 py-1 font-bold hover:bg-white/25">
          ← Voltar ao painel
        </button>
      </form>
    </div>
  );
}
