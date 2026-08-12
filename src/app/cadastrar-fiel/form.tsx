"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui";
import { BuscaIgreja } from "@/components/busca-igreja";
import { cadastrarFielAction, type EstadoCadastroFiel } from "./actions";

const ESTADO_INICIAL: EstadoCadastroFiel = {};

interface IgrejaResumo {
  id: string;
  nome: string;
  cidade: string;
  uf: string;
  logoEmoji: string;
}

export function FormCadastroFiel({ igrejaFixa }: { igrejaFixa?: IgrejaResumo }) {
  const [estado, action, pending] = useActionState(cadastrarFielAction, ESTADO_INICIAL);

  return (
    <form action={action} className="space-y-4">
      {igrejaFixa ? (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-[#EAF6FF] px-4 py-3">
          <span className="text-xl">{igrejaFixa.logoEmoji}</span>
          <div>
            <p className="font-bold">{igrejaFixa.nome}</p>
            <p className="text-xs text-muted">
              {igrejaFixa.cidade}/{igrejaFixa.uf}
            </p>
          </div>
          <input type="hidden" name="igrejaId" value={igrejaFixa.id} />
        </div>
      ) : (
        <BuscaIgreja />
      )}

      <label className="flex flex-col gap-1">
        <span className="text-sm font-bold text-muted">Seu nome</span>
        <input name="nome" required placeholder="Nome completo" className="rounded-xl border border-border px-4 py-3" />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-bold text-muted">Seu celular</span>
        <input name="telefone" required placeholder="(11) 99999-9999" className="rounded-xl border border-border px-4 py-3" />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-bold text-muted">Crie uma senha</span>
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
        <span className="text-sm font-bold text-muted">Confirme a senha</span>
        <input name="confirmarSenha" type="password" required minLength={6} className="rounded-xl border border-border px-4 py-3" />
      </label>

      {estado.erro && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{estado.erro}</p>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Entrando…" : "Criar minha conta"}
      </Button>
    </form>
  );
}
