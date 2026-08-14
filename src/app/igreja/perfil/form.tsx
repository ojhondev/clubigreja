"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui";
import { atualizarPerfilAction, type EstadoPerfilIgreja } from "./actions";
import type { Igreja } from "@/lib/types";

const ESTADO_INICIAL: EstadoPerfilIgreja = {};

export function FormPerfilIgreja({ igreja }: { igreja: Igreja }) {
  const [estado, action, pending] = useActionState(
    atualizarPerfilAction,
    ESTADO_INICIAL,
  );

  return (
    <form action={action} className="space-y-4">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-bold text-muted">Nome da igreja *</span>
        <input
          name="nome"
          required
          defaultValue={igreja.nome}
          className="rounded-xl border border-border px-4 py-3"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-bold text-muted">CNPJ *</span>
        <input
          name="cnpj"
          required
          defaultValue={igreja.cnpj}
          className="rounded-xl border border-border px-4 py-3"
        />
      </label>
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold text-muted">Cidade *</span>
          <input
            name="cidade"
            required
            defaultValue={igreja.cidade}
            className="rounded-xl border border-border px-4 py-3"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold text-muted">UF *</span>
          <input
            name="uf"
            required
            maxLength={2}
            defaultValue={igreja.uf}
            className="rounded-xl border border-border px-4 py-3 uppercase"
          />
        </label>
      </div>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-bold text-muted">
          Nome do responsável *
        </span>
        <input
          name="responsavelNome"
          required
          defaultValue={igreja.responsavelNome}
          className="rounded-xl border border-border px-4 py-3"
        />
      </label>
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold text-muted">
            E-mail do responsável *
          </span>
          <input
            name="responsavelEmail"
            type="email"
            required
            defaultValue={igreja.responsavelEmail}
            className="rounded-xl border border-border px-4 py-3"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold text-muted">
            WhatsApp do responsável *
          </span>
          <input
            name="responsavelWhatsapp"
            required
            defaultValue={igreja.responsavelWhatsapp}
            className="rounded-xl border border-border px-4 py-3"
          />
        </label>
      </div>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-bold text-muted">
          Chave Pix da igreja *
        </span>
        <input
          name="chavePix"
          required
          defaultValue={igreja.chavePix}
          className="rounded-xl border border-border px-4 py-3"
        />
        <span className="text-xs text-muted">
          É pra essa chave que o Pix dos fiéis vai direto.
        </span>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-bold text-muted">
          Foto de perfil (URL)
        </span>
        <input
          name="fotoUrl"
          placeholder="https://…"
          defaultValue={igreja.fotoUrl ?? ""}
          className="rounded-xl border border-border px-4 py-3"
        />
        <span className="text-xs text-muted">
          Aparece na página pública, no lugar do emoji, quando preenchida.
        </span>
      </label>

      {estado.erro && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {estado.erro}
        </p>
      )}
      {estado.sucesso && (
        <p className="rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-success">
          Dados atualizados com sucesso.
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Salvando…" : "Salvar alterações"}
      </Button>
    </form>
  );
}
