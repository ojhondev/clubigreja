"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Link2,
  Target,
  Calendar,
  Megaphone,
  BarChart3,
  Settings,
  Grid3x3,
  LogOut,
  type LucideIcon,
} from "lucide-react";

export const NAV_ITEMS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/igreja/dashboard", label: "Painel", icon: LayoutDashboard },
  { href: "/igreja/links", label: "Links", icon: Link2 },
  { href: "/igreja/campanhas", label: "Campanhas", icon: Target },
  { href: "/igreja/eventos", label: "Eventos", icon: Calendar },
  { href: "/igreja/mural", label: "Mural", icon: Megaphone },
  { href: "/igreja/relatorios", label: "Relatórios", icon: BarChart3 },
  { href: "/igreja/perfil", label: "Perfil", icon: Settings },
];

export function PillNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 overflow-x-auto">
      {NAV_ITEMS.map((item, i) => {
        const ativo = pathname.startsWith(item.href);
        return (
          <div key={item.href} className="flex shrink-0 items-center gap-1">
            {i > 0 && <span className="hidden text-border sm:inline">•</span>}
            <Link
              href={item.href}
              className={
                ativo
                  ? "whitespace-nowrap rounded-full bg-primary px-4 py-2 text-sm font-bold text-white sm:px-5"
                  : "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-muted hover:text-primary sm:px-5"
              }
            >
              {item.label}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}

export function IconSidebar({ sairAction }: { sairAction: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-20 shrink-0 flex-col items-center self-start border-r border-border bg-sidebar py-4 md:flex print:hidden">
      <button
        type="button"
        className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl text-muted hover:bg-black/5"
        aria-label="Aplicativos"
      >
        <Grid3x3 size={20} />
      </button>
      <div className="flex flex-1 flex-col items-center gap-3">
        {NAV_ITEMS.map((item) => {
          const ativo = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={
                ativo
                  ? "flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-[0_4px_10px_rgba(0,41,145,0.35)]"
                  : "flex h-11 w-11 items-center justify-center rounded-full text-primary/50 hover:bg-black/5 hover:text-primary"
              }
            >
              <Icon size={20} />
            </Link>
          );
        })}
      </div>
      <form action={sairAction}>
        <button
          type="submit"
          title="Sair"
          className="flex h-11 w-11 items-center justify-center rounded-full text-muted hover:bg-black/5 hover:text-primary"
        >
          <LogOut size={20} />
        </button>
      </form>
    </aside>
  );
}
