import { LogOut } from "lucide-react";
import { getSessao } from "@/lib/auth/session";
import { getIgreja } from "@/lib/db/repo";
import { sair } from "@/lib/auth/actions";
import { Logo } from "@/components/logo";
import { PillNav, IconSidebar } from "@/components/igreja-nav";
import { Card } from "@/components/ui";
import { BannerAcessoWebmaster } from "@/components/banner-acesso-webmaster";

function iniciais(nome: string): string {
  return nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export default async function IgrejaLayout({ children }: { children: React.ReactNode }) {
  const sessao = await getSessao();
  const igreja = sessao?.igrejaId ? await getIgreja(sessao.igrejaId) : undefined;

  if (igreja && igreja.statusOnboarding !== "aprovado") {
    const reprovada = igreja.statusOnboarding === "reprovado";
    return (
      <div className="flex min-h-full flex-col">
        <BannerAcessoWebmaster />
        <header className="border-b border-border bg-card">
          <div className="flex items-center justify-between px-6 py-4">
            <Logo />
            <form action={sair}>
              <button type="submit" className="text-sm font-bold text-muted hover:text-primary">
                Sair
              </button>
            </form>
          </div>
        </header>
        <main className="flex flex-1 items-center justify-center bg-background px-6 py-12">
          <Card className="max-w-md text-center">
            <div className="mb-3 text-4xl">{reprovada ? "⚠️" : "⏳"}</div>
            <h1 className="mb-2 text-xl font-bold">
              {reprovada ? "Cadastro não aprovado" : "Sua conta está em análise"}
            </h1>
            <p className="text-muted">
              {reprovada
                ? "Não foi possível aprovar o cadastro da sua igreja. Entre em contato com o suporte do Dizipay para entender o motivo."
                : "Estamos validando os dados enviados. Assim que aprovarmos, seu painel de arrecadação é liberado automaticamente — normalmente isso leva poucas horas."}
            </p>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col">
      <BannerAcessoWebmaster />
      <header className="border-b border-border bg-card print:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:gap-6 sm:px-6 sm:py-4">
          <Logo height={26} />
          <div className="hidden md:block">
            <PillNav />
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold leading-tight">{igreja?.nome ?? "Sua igreja"}</p>
              <p className="text-xs text-muted leading-tight">{sessao?.nome}</p>
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white sm:h-10 sm:w-10">
              {sessao ? iniciais(sessao.nome) : "?"}
            </div>
            <form action={sair} className="md:hidden">
              <button
                type="submit"
                title="Sair"
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-black/5 hover:text-primary"
              >
                <LogOut size={18} />
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-border px-3 py-2 md:hidden">
          <PillNav />
        </div>
      </header>
      <div className="flex flex-1">
        <IconSidebar sairAction={sair} />
        <main className="min-w-0 flex-1 bg-background px-4 py-6 sm:px-6 sm:py-8 md:px-10 print:p-0">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
