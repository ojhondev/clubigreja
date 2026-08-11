"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui";
import { Logo } from "@/components/logo";

const LINKS = [
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/#recursos", label: "Recursos" },
  { href: "/#diferenciais", label: "Diferenciais" },
  { href: "/#precos", label: "Preços" },
  { href: "/#catolicas", label: "Para Igrejas" },
  { href: "/#duvidas", label: "Dúvidas" },
  { href: "/calculadora", label: "Calculadora" },
];

export function LandingNav() {
  const [aberto, setAberto] = useState(false);
  const [rolado, setRolado] = useState(false);

  useEffect(() => {
    function onScroll() {
      setRolado(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-[#F5F5F5]/90 backdrop-blur">
      <div className="flex w-full items-center justify-between px-4 py-3 sm:px-8 lg:px-12">
        <Link href="/" className="flex shrink-0 items-center">
          {rolado ? (
            <Image src="/dizipay-icon.png" alt="Dizipay" width={34} height={34} priority />
          ) : (
            <Logo height={30} />
          )}
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-5 overflow-x-auto px-4 md:flex xl:gap-7">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="whitespace-nowrap text-sm font-medium text-muted hover:text-primary"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 md:flex">
          <Link href="/entrar" className="text-sm font-bold text-foreground hover:text-primary">
            Entrar
          </Link>
          <Link href="/cadastrar-igreja">
            <Button variant="dark" className="font-display">
              Cadastre-se é grátis
            </Button>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-foreground md:hidden"
          aria-label="Abrir menu"
        >
          {aberto ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {aberto && (
        <div className="border-t border-border px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setAberto(false)}
                className="text-sm font-medium text-foreground"
              >
                {l.label}
              </a>
            ))}
            <Link href="/entrar" onClick={() => setAberto(false)} className="text-sm font-bold text-foreground">
              Entrar
            </Link>
            <Link href="/cadastrar-igreja" onClick={() => setAberto(false)}>
              <Button variant="dark" className="w-full font-display">
                Cadastre-se é grátis
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
