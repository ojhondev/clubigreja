import { Card } from "@/components/ui";
import { Logo } from "@/components/logo";
import { BotaoVoltarSite } from "@/components/botao-voltar-site";
import { FormLoginSuperadmin } from "./form";

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-6 py-12 pb-24 sm:pb-12">
      <BotaoVoltarSite />

      <div className="mb-8 text-center">
        <div className="mb-3 flex justify-center">
          <Logo height={40} />
        </div>
        <h1 className="text-xl font-bold">Painel interno</h1>
        <p className="mt-1 text-muted">Acesso restrito à equipe Dizipay.</p>
      </div>

      <Card>
        <FormLoginSuperadmin />
      </Card>
    </div>
  );
}
