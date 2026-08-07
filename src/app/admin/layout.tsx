import { getSessao } from "@/lib/auth/session";
import { sair } from "@/lib/auth/actions";
import { Logo } from "@/components/logo";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const sessao = await getSessao();

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <Logo />
            <p className="text-xs text-muted">Painel interno · {sessao?.nome}</p>
          </div>
          <form action={sair}>
            <button type="submit" className="text-sm font-bold text-muted hover:text-primary">
              Sair
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
