"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui";
import {
  criarWebmasterPrimarioAction,
  entrarWebmasterAction,
  type EstadoWebmaster,
} from "./actions";

const ESTADO_INICIAL: EstadoWebmaster = {};

export function FormWebmaster({ modo }: { modo: "login" | "setup" }) {
  const action =
    modo === "setup" ? criarWebmasterPrimarioAction : entrarWebmasterAction;
  const [estado, formAction, pending] = useActionState(action, ESTADO_INICIAL);

  return (
    <form action={formAction} className="space-y-4">
      {modo === "setup" && (
        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold text-muted">Seu nome</span>
          <input
            name="nome"
            required
            placeholder="Nome completo"
            className="rounded-xl border border-border px-4 py-3"
          />
        </label>
      )}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-bold text-muted">E-mail</span>
        <input
          name="email"
          type="email"
          required
          placeholder="voce@dizipay.com"
          className="rounded-xl border border-border px-4 py-3"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-bold text-muted">Senha</span>
        <input
          name="senha"
          type="password"
          required
          minLength={modo === "setup" ? 6 : undefined}
          placeholder="••••••••"
          className="rounded-xl border border-border px-4 py-3"
        />
      </label>
      {modo === "setup" && (
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
      )}

      {estado.erro && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {estado.erro}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending
          ? "Enviando…"
          : modo === "setup"
            ? "Criar Master Primário"
            : "Entrar"}
      </Button>
    </form>
  );
}
