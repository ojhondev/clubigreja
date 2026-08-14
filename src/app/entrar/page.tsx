import Link from "next/link";
import { Card } from "@/components/ui";
import { Logo } from "@/components/logo";
import { BotaoVoltarSite } from "@/components/botao-voltar-site";
import { Building2, User } from "lucide-react";

export default function EntrarPage() {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-6 py-12 pb-24 sm:pb-12">
      <BotaoVoltarSite />

      <div className="mb-10 text-center">
        <div className="mb-3 flex justify-center">
          <Logo height={40} />
        </div>
        <p className="mt-1 text-muted">Como você quer entrar?</p>
      </div>

      <div className="space-y-4">
        <Link href="/entrar/igreja">
          <Card className="flex items-center gap-4 hover:border-primary">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF6FF] text-primary">
              <Building2 size={22} />
            </span>
            <div className="flex-1">
              <p className="font-bold">Sou uma igreja</p>
              <p className="text-sm text-muted">
                Gerenciar arrecadação, campanhas e mural
              </p>
            </div>
            <span className="text-primary">→</span>
          </Card>
        </Link>

        <Link href="/entrar/fiel">
          <Card className="flex items-center gap-4 hover:border-primary">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF6FF] text-primary">
              <User size={22} />
            </span>
            <div className="flex-1">
              <p className="font-bold">Sou fiel</p>
              <p className="text-sm text-muted">
                Acompanhar minha igreja e contribuir
              </p>
            </div>
            <span className="text-primary">→</span>
          </Card>
        </Link>
      </div>
    </div>
  );
}
