"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui";
import {
  aceitarConviteWebmasterAction,
  type EstadoConviteWebmaster,
} from "./actions";

const ESTADO_INICIAL: EstadoConviteWebmaster = {};

export function FormAceitarConvite({ token }: { token: string }) {
  const [estado, formAction, pending] = useActionState(
    aceitarConviteWebmasterAction,
    ESTADO_INICIAL,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <label className="flex flex-col gap-1">
        <span className="text-sm font-bold text-muted">Crie sua senha</span>
        <input
          name="senha"
          type="password"
          required
          minLength={6}
          placeholder="Mínimo 6 caracteres"
          className="rounded-xl border border-border px-4 py-3"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-bold text-muted">Confirmar senha</span>
        <input
          name="confirmarSenha"
          type="password"
          required
          minLength={6}
          className="rounded-xl border border-border px-4 py-3"
        />
      </label>

      {estado.erro && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {estado.erro}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Enviando…" : "Ativar conta"}
      </Button>
    </form>
  );
}
