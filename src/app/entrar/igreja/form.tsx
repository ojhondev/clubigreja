"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui";
import { entrarIgrejaEmailAction, type EstadoLoginIgreja } from "./actions";

const ESTADO_INICIAL: EstadoLoginIgreja = {};

export function FormLoginIgreja() {
  const [estado, action, pending] = useActionState(
    entrarIgrejaEmailAction,
    ESTADO_INICIAL,
  );

  return (
    <form action={action} className="space-y-4">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-bold text-muted">E-mail</span>
        <input
          name="email"
          type="email"
          required
          placeholder="voce@suaigreja.org.br"
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
