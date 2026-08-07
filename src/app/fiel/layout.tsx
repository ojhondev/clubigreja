import Link from "next/link";
import { Bell } from "lucide-react";
import { getSessao } from "@/lib/auth/session";
import { getIgreja, getNotificacoesDoFiel } from "@/lib/mock-db";
import { sair } from "@/lib/auth/actions";
import { Logo } from "@/components/logo";
import { BottomNav } from "@/components/fiel-nav";

export default async function FielLayout({ children }: { children: React.ReactNode }) {
  const sessao = await getSessao();
  const igreja = sessao?.igrejaId ? getIgreja(sessao.igrejaId) : undefined;
  const naoLidas = sessao ? getNotificacoesDoFiel(sessao.usuarioId).filter((n) => !n.lida).length : 0;

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-md items-center justify-between px-5 py-4">
          <div>
            <Logo className="text-lg" />
            <p className="text-xs text-muted">{igreja?.nome ?? "Sua igreja"}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/fiel/notificacoes" className="relative text-muted hover:text-primary">
              <Bell size={20} />
              {naoLidas > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                  {naoLidas}
                </span>
              )}
            </Link>
            <form action={sair}>
              <button type="submit" className="text-sm font-bold text-muted hover:text-primary">
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 px-5 py-6 pb-24">{children}</main>

      <BottomNav />
    </div>
  );
}
