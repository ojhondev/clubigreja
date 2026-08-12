import { getSessao } from "@/lib/auth/session";
import { getNotificacoesDoFiel } from "@/lib/db/repo";
import { formatarData } from "@/lib/formato";
import { Badge, Card, PageHeader } from "@/components/ui";
import { Megaphone, Target, HandCoins, Bell } from "lucide-react";
import { marcarLidaAction } from "./actions";

const ICONE_TIPO: Record<string, typeof Bell> = {
  comunicado: Megaphone,
  campanha: Target,
  lembrete_dizimo: HandCoins,
};

export default async function NotificacoesPage() {
  const sessao = await getSessao();
  const notificacoes = await getNotificacoesDoFiel(sessao!.usuarioId);

  return (
    <div>
      <PageHeader title="Notificações" />
      <div className="space-y-3">
        {notificacoes.map((n) => {
          const Icone = ICONE_TIPO[n.tipo] ?? Bell;
          return (
            <Card key={n.id} className={`flex gap-3 ${n.lida ? "opacity-60" : ""}`}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF6FF] text-primary">
                <Icone size={18} />
              </span>
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <p className="font-bold">{n.titulo}</p>
                  {!n.lida && <Badge tone="success">Nova</Badge>}
                </div>
                <p className="text-sm text-muted">{n.corpo}</p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-muted">{formatarData(n.criadaEm)}</p>
                  {!n.lida && (
                    <form action={marcarLidaAction}>
                      <input type="hidden" name="notificacaoId" value={n.id} />
                      <button type="submit" className="text-xs font-bold text-primary">
                        Marcar como lida
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
        {notificacoes.length === 0 && <p className="text-muted">Nenhuma notificação por enquanto.</p>}
      </div>
    </div>
  );
}
