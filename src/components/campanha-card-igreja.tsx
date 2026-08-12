"use client";

import { useState } from "react";
import Link from "next/link";
import { QrCode, Pencil, Trash2 } from "lucide-react";
import { Badge, Button, Card, ProgressBar } from "@/components/ui";
import { InputMoeda } from "@/components/input-moeda";
import { formatarMoeda } from "@/lib/comissao";
import { formatarData } from "@/lib/formato";
import type { Campanha } from "@/lib/types";
import { atualizarCampanhaAction, alternarEncerramentoCampanhaAction, removerCampanhaAction } from "@/app/igreja/campanhas/actions";

export function CampanhaCardIgreja({ campanha, arrecadado }: { campanha: Campanha; arrecadado: number }) {
  const [editando, setEditando] = useState(false);
  const pct = (arrecadado / campanha.meta) * 100;

  if (editando) {
    return (
      <Card>
        <form action={atualizarCampanhaAction} className="grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="campanhaId" value={campanha.id} />
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm font-medium text-muted">Título</span>
            <input name="titulo" defaultValue={campanha.titulo} required className="rounded-xl border border-border px-4 py-3" />
          </label>
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm font-medium text-muted">Descrição</span>
            <textarea name="descricao" defaultValue={campanha.descricao} rows={2} className="rounded-xl border border-border px-4 py-3" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted">Meta (R$)</span>
            <InputMoeda name="meta" defaultValue={campanha.meta} required className="rounded-xl border border-border px-4 py-3" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted">Prazo</span>
            <input name="prazo" type="date" defaultValue={campanha.prazo} required className="rounded-xl border border-border px-4 py-3" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted">Emoji de destaque</span>
            <input name="imagemEmoji" defaultValue={campanha.imagemEmoji} className="rounded-xl border border-border px-4 py-3" />
          </label>
          <div className="flex gap-2 sm:col-span-2">
            <Button type="submit" onClick={() => setEditando(false)}>
              Salvar alterações
            </Button>
            <Button type="button" variant="secondary" onClick={() => setEditando(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{campanha.imagemEmoji}</span>
          <div>
            <p className="font-bold">{campanha.titulo}</p>
            <p className="text-sm text-muted">Prazo: {formatarData(campanha.prazo)}</p>
          </div>
        </div>
        {campanha.encerrada ? <Badge>Encerrada</Badge> : <Badge tone="success">Em captação</Badge>}
      </div>
      <p className="mb-3 text-sm text-muted">{campanha.descricao}</p>
      <ProgressBar percentual={pct} />
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium">
          {formatarMoeda(arrecadado)} de {formatarMoeda(campanha.meta)} ({pct.toFixed(0)}%)
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href={`/igreja/campanhas/${campanha.id}/qrcode`}>
            <Button variant="secondary">
              <QrCode size={18} />
              QR Code
            </Button>
          </Link>
          <Button type="button" variant="secondary" onClick={() => setEditando(true)}>
            <Pencil size={18} />
            Editar
          </Button>
          <form action={alternarEncerramentoCampanhaAction}>
            <input type="hidden" name="campanhaId" value={campanha.id} />
            <input type="hidden" name="encerrada" value={(!campanha.encerrada).toString()} />
            <Button type="submit" variant="secondary">
              {campanha.encerrada ? "Reabrir" : "Encerrar"}
            </Button>
          </form>
          <form
            action={removerCampanhaAction}
            onSubmit={(e) => {
              if (
                !window.confirm(
                  "Apagar esta campanha? As doações já feitas continuam no histórico, mas deixam de aparecer vinculadas a ela."
                )
              ) {
                e.preventDefault();
              }
            }}
          >
            <input type="hidden" name="campanhaId" value={campanha.id} />
            <Button type="submit" variant="secondary">
              <Trash2 size={18} />
              Apagar
            </Button>
          </form>
        </div>
      </div>
    </Card>
  );
}
