import Link from "next/link";
import { getTodosFieis, getTodosUsuariosIgreja, getTodasIgrejas } from "@/lib/db/repo";
import { Badge, Card } from "@/components/ui";
import { Logo } from "@/components/logo";
import { BotaoVoltarSite } from "@/components/botao-voltar-site";
import { entrarComoFiel, entrarComoIgreja, entrarComoSuperadmin } from "./actions";

const ROTULO_STATUS: Record<string, string> = {
  pendente: "Pendente",
  em_analise: "Em análise",
  aprovado: "Aprovado",
  reprovado: "Reprovado",
};

export default async function LoginPage() {
  const [usuariosIgreja, fieis, igrejas] = await Promise.all([
    getTodosUsuariosIgreja(),
    getTodosFieis(),
    getTodasIgrejas(),
  ]);
  const igrejaPorId = new Map(igrejas.map((i) => [i.id, i]));

  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-6 py-12 pb-24 sm:pb-12">
      <BotaoVoltarSite />

      <div className="mb-8 text-center">
        <div className="mb-3 flex justify-center">
          <Logo height={40} />
        </div>
        <h1 className="text-xl font-bold">Acesso master</h1>
        <p className="mt-1 text-muted">
          Ambiente de testes — entre como qualquer usuário sem passar pelo login real.
          Útil para testar todos os fluxos (inclusive igrejas pendentes/reprovadas).
        </p>
      </div>

      <div className="space-y-5">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold text-muted">Entrar como Igreja</h2>
            <Link href="/cadastrar-igreja" className="text-sm font-bold text-primary">
              Cadastrar igreja
            </Link>
          </div>
          <div className="space-y-2">
            {usuariosIgreja.map((u) => {
              const igreja = igrejaPorId.get(u.igrejaId);
              return (
                <form key={u.id} action={entrarComoIgreja}>
                  <input type="hidden" name="usuarioId" value={u.id} />
                  <button
                    type="submit"
                    className="flex w-full items-center justify-between rounded-xl border border-border px-4 py-3 text-left hover:bg-[#EAF6FF]"
                  >
                    <span>
                      <span className="block font-medium">{u.nome}</span>
                      <span className="block text-sm text-muted">
                        {igreja?.nome} · <span className="capitalize">{u.papel}</span>
                      </span>
                    </span>
                    {igreja && (
                      <Badge tone={igreja.statusOnboarding === "aprovado" ? "success" : "warning"}>
                        {ROTULO_STATUS[igreja.statusOnboarding]}
                      </Badge>
                    )}
                  </button>
                </form>
              );
            })}
            {usuariosIgreja.length === 0 && <p className="text-sm text-muted">Nenhuma igreja cadastrada ainda.</p>}
          </div>
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold text-muted">Entrar como Fiel</h2>
            <Link href="/cadastrar-fiel" className="text-sm font-bold text-primary">
              Sou novo(a) aqui
            </Link>
          </div>
          <div className="max-h-72 space-y-2 overflow-y-auto">
            {fieis.map((f) => (
              <form key={f.id} action={entrarComoFiel}>
                <input type="hidden" name="fielId" value={f.id} />
                <button
                  type="submit"
                  className="flex w-full items-center justify-between rounded-xl border border-border px-4 py-3 text-left hover:bg-[#EAF6FF]"
                >
                  <span>
                    <span className="block font-medium">{f.nome}</span>
                    <span className="block text-xs text-muted">{igrejaPorId.get(f.igrejaId)?.nome}</span>
                  </span>
                  <span className="text-primary">→</span>
                </button>
              </form>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 font-bold text-muted">Painel interno</h2>
          <form action={entrarComoSuperadmin}>
            <button
              type="submit"
              className="flex w-full items-center justify-between rounded-xl border border-border px-4 py-3 text-left hover:bg-[#EAF6FF]"
            >
              <span className="font-medium">Equipe Dizipay (superadmin)</span>
              <span className="text-primary">→</span>
            </button>
          </form>
        </Card>
      </div>

      <p className="mt-8 text-center text-xs text-muted">
        {igrejas.length} igreja(s) · {fieis.length} fiel(éis) cadastrados nesta instância.
        Os dados são mockados em memória — reiniciam se o servidor reciclar.
      </p>
    </div>
  );
}
