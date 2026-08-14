import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessao } from "@/lib/auth/session";
import { getWebmasterPorId } from "@/lib/db/repo";
import { sair } from "@/lib/auth/actions";
import { Logo } from "@/components/logo";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessao = await getSessao();
  if (sessao?.papel !== "webmaster") {
    redirect("/webmaster");
  }

  const webmaster = await getWebmasterPorId(sessao.usuarioId);
  if (!webmaster) {
    redirect("/webmaster");
  }

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Logo />
            <nav className="hidden gap-4 text-sm font-bold text-muted sm:flex">
              <Link href="/admin/igrejas" className="hover:text-primary">
                Igrejas
              </Link>
              <Link href="/admin/fieis" className="hover:text-primary">
                Fiéis
              </Link>
              {webmaster.nivel === "primario" && (
                <Link href="/admin/equipe" className="hover:text-primary">
                  Equipe
                </Link>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-xs text-muted">
              {webmaster.nome} ·{" "}
              {webmaster.nivel === "primario"
                ? "Master Primário"
                : "Master Secundário"}
            </p>
            <form action={sair}>
              <button
                type="submit"
                className="text-sm font-bold text-muted hover:text-primary"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
        <nav className="flex gap-4 border-t border-border px-6 py-2 text-sm font-bold text-muted sm:hidden">
          <Link href="/admin/igrejas" className="hover:text-primary">
            Igrejas
          </Link>
          <Link href="/admin/fieis" className="hover:text-primary">
            Fiéis
          </Link>
          {webmaster.nivel === "primario" && (
            <Link href="/admin/equipe" className="hover:text-primary">
              Equipe
            </Link>
          )}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
        {children}
      </main>
    </div>
  );
}
