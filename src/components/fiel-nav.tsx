"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Target, HandCoins, Receipt } from "lucide-react";

const NAV = [
  { href: "/fiel/inicio", label: "Início", icon: Home },
  { href: "/fiel/campanhas", label: "Campanhas", icon: Target },
  { href: "/fiel/doar", label: "Doar", icon: HandCoins },
  { href: "/fiel/historico", label: "Histórico", icon: Receipt },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 border-t border-border bg-card">
      <div className="mx-auto flex max-w-md items-center justify-around py-2">
        {NAV.map((item) => {
          const ativo = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 rounded-2xl px-4 py-1.5 text-xs font-bold transition-colors ${
                ativo ? "text-primary" : "text-muted hover:text-primary"
              }`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full ${
                  ativo ? "bg-primary text-white" : "text-muted"
                }`}
              >
                <Icon size={18} />
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
