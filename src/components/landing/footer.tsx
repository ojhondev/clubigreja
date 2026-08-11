import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/logo";

const COLUNAS = [
  {
    titulo: "Produto",
    links: [
      { label: "Como funciona", href: "#como-funciona" },
      { label: "Recursos", href: "#recursos" },
      { label: "Diferenciais", href: "#diferenciais" },
      { label: "Preços", href: "#precos" },
      { label: "Dúvidas", href: "#duvidas" },
    ],
  },
  {
    titulo: "Igrejas",
    links: [
      { label: "Para Igrejas", href: "#catolicas" },
      { label: "Calculadora", href: "/calculadora" },
    ],
  },
  {
    titulo: "Empresa",
    links: [
      { label: "Cadastrar igreja", href: "/cadastrar-igreja" },
      { label: "Entrar", href: "/entrar" },
      { label: "Fale com nosso time", href: "mailto:contato@dclubigreja.com" },
    ],
  },
  {
    titulo: "Legal",
    links: [
      { label: "Termos de uso", href: "/termos" },
      { label: "Privacidade", href: "/privacidade" },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <Logo height={28} />
            <p className="mt-3 max-w-xs text-sm text-muted">
              Facilitador de arrecadação para igrejas — dízimo, ofertas e campanhas em um só
              lugar.
            </p>
          </div>

          {COLUNAS.map((col) => (
            <div key={col.titulo}>
              <p className="mb-3 text-sm font-bold text-foreground">{col.titulo}</p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-muted hover:text-primary">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <Image src="/icon.png" alt="" width={20} height={20} />
            <p className="text-xs text-muted">
              © {new Date().getFullYear()} Club Igreja. Todos os direitos reservados.
            </p>
          </div>
          <p className="text-xs text-muted">dclubigreja.com</p>
        </div>
      </div>
    </footer>
  );
}
