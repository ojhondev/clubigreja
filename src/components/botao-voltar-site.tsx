import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function BotaoVoltarSite() {
  return (
    <>
      <Link
        href="/"
        className="fixed left-6 top-6 z-40 hidden items-center gap-2 rounded-full border-2 border-primary bg-white px-5 py-3 text-sm font-bold text-primary shadow-md hover:bg-[#EAF6FF] sm:flex"
      >
        <ArrowLeft size={18} />
        Voltar ao site
      </Link>
      <Link
        href="/"
        className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-center gap-2 border-t border-border bg-white px-4 py-5 text-base font-bold text-primary shadow-[0_-4px_16px_rgba(0,0,0,0.08)] sm:hidden"
      >
        <ArrowLeft size={16} />
        Voltar ao site
      </Link>
    </>
  );
}
