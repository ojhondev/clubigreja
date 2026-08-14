"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui";
import { entrarFielTelefoneAction, type EstadoLoginFiel } from "./actions";

const ESTADO_INICIAL: EstadoLoginFiel = {};

export function FormLoginFiel() {
  const [estado, action, pending] = useActionState(
    entrarFielTelefoneAction,
    ESTADO_INICIAL,
  );

  return (
    <form action={action} className="space-y-4">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-bold text-muted">Seu celular</span>
        <input
          name="telefone"
          required
          placeholder="(11) 99999-9999"
          className="rounded-xl border border-border px-4 py-3"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-bold text-muted">Senha</span>
        <input
          name="senha"
          type="password"
          required
          placeholder="••••••••"
          className="rounded-xl border border-border px-4 py-3"
        />
      </label>

      {estado.erro && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {estado.erro}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Entrando…" : "Entrar"}
      </Button>
    </form>
  );
}
