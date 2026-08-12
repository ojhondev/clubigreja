"use client";

import { useActionState, useRef } from "react";
import { Button } from "@/components/ui";
import { convidarWebmasterAction, type EstadoConvidarWebmaster } from "./actions";

const ESTADO_INICIAL: EstadoConvidarWebmaster = {};

export function FormConvidarWebmaster() {
  const [estado, formAction, pending] = useActionState(convidarWebmasterAction, ESTADO_INICIAL);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={(formData) => {
        formAction(formData);
        formRef.current?.reset();
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold text-muted">Nome</span>
          <input name="nome" required placeholder="Nome completo" className="rounded-xl border border-border px-4 py-3" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold text-muted">E-mail</span>
          <input name="email" type="email" required placeholder="pessoa@dizipay.com" className="rounded-xl border border-border px-4 py-3" />
        </label>
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="podeGerenciarPagamentos" className="h-4 w-4" />
          Gerenciar pagamentos (sacar, editar chave Pix)
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="podeAprovarIgrejas" className="h-4 w-4" />
          Aprovar/reprovar igrejas
        </label>
      </div>

      {estado.erro && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{estado.erro}</p>}
      {estado.sucesso && (
        <p className="rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          Convite gerado — copie o link na lista de membros abaixo.
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Enviando…" : "Convidar"}
      </Button>
    </form>
  );
}
