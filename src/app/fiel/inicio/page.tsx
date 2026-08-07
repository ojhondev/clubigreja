import Link from "next/link";
import { getSessao } from "@/lib/auth/session";
import { getMuralDaIgreja } from "@/lib/mock-db";
import { getStatusDizimo, nomeMesAtual } from "@/lib/dizimo";
import { Button, Card } from "@/components/ui";
import { AtivarNotificacoes } from "@/components/ativar-notificacoes";
import { formatarData } from "@/lib/formato";

export default async function InicioFielPage() {
  const sessao = await getSessao();
  const igrejaId = sessao!.igrejaId!;
  const fielId = sessao!.usuarioId;
  const mural = getMuralDaIgreja(igrejaId);
  const statusDizimo = getStatusDizimo(fielId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Olá, {sessao!.nome.split(" ")[0]} 👋</h1>
      </div>

      {!statusDizimo.contribuiuEsteMes && (
        <Card className="border-primary/30 bg-[#EAF6FF]">
          <p className="mb-1 font-bold text-primary">
            Seu dízimo de {nomeMesAtual()} ainda não foi registrado
          </p>
          <p className="mb-4 text-sm text-muted">
            {statusDizimo.ultimaContribuicaoEm
              ? `Sua última contribuição foi em ${formatarData(statusDizimo.ultimaContribuicaoEm)}.`
              : "Leva menos de um minuto para contribuir."}
          </p>
          <Link href="/fiel/doar?tipo=dizimo">
            <Button className="w-full">Contribuir agora</Button>
          </Link>
          <div className="mt-3">
            <AtivarNotificacoes />
          </div>
        </Card>
      )}

      <div>
        <h2 className="mb-3 text-lg font-bold">Mural da igreja</h2>
        <div className="space-y-3">
          {mural.map((c) => (
            <Card key={c.id} className="flex gap-3">
              <span className="text-2xl">{c.emoji}</span>
              <div>
                <p className="font-bold">{c.titulo}</p>
                <p className="text-sm text-muted">{c.corpo}</p>
                <p className="mt-1 text-xs text-muted">{formatarData(c.publicadoEm)}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
