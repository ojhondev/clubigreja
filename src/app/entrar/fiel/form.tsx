"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui";
import { entrarFielTelefoneAction, type EstadoLoginFiel } from "./actions";

const ESTADO_INICIAL: EstadoLoginFiel = {};

export function FormLoginFiel() {
  const [etapa, setEtapa] = useState<"telefone" | "codigo">("telefone");
  const [telefone, setTelefone] = useState("");
  const [estado, action, pending] = useActionState(entrarFielTelefoneAction, ESTADO_INICIAL);

  if (etapa === "telefone") {
    return (
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (telefone.trim()) setEtapa("codigo");
        }}
      >
        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold text-muted">Seu celular</span>
          <input
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required
            placeholder="(11) 99999-9999"
            className="rounded-xl border border-border px-4 py-3"
          />
        </label>
        <Button type="submit" className="w-full">
          Enviar código
        </Button>
      </form>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="telefone" value={telefone} />
      <p className="text-sm text-muted">
        Enviamos um código para <span className="font-bold text-foreground">{telefone}</span>.
      </p>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-bold text-muted">Código de verificação</span>
        <input
          name="codigo"
          required
          maxLength={6}
          placeholder="000000"
          defaultValue="000000"
          className="rounded-xl border border-border px-4 py-3 text-center text-2xl font-bold tracking-[0.3em]"
        />
      </label>

      {estado.erro && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{estado.erro}</p>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Entrando…" : "Confirmar e entrar"}
      </Button>
      <button
        type="button"
        onClick={() => setEtapa("telefone")}
        className="w-full text-center text-sm font-bold text-muted"
      >
        Trocar número
      </button>
    </form>
  );
}
