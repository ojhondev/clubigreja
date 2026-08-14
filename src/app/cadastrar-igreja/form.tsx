"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui";
import { cadastrarIgrejaAction, type EstadoCadastroIgreja } from "./actions";

const ESTADO_INICIAL: EstadoCadastroIgreja = {};

export function FormCadastroIgreja() {
  const [estado, action, pending] = useActionState(
    cadastrarIgrejaAction,
    ESTADO_INICIAL,
  );

  return (
    <form action={action} className="space-y-4">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-bold text-muted">Nome da igreja *</span>
        <input
          name="nome"
          required
          placeholder="Ex.: Igreja Batista Nova Vida"
          className="rounded-xl border border-border px-4 py-3"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-bold text-muted">CNPJ *</span>
        <input
          name="cnpj"
          required
          placeholder="00.000.000/0001-00"
          className="rounded-xl border border-border px-4 py-3"
        />
      </label>
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold text-muted">Cidade *</span>
          <input
            name="cidade"
            required
            className="rounded-xl border border-border px-4 py-3"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold text-muted">UF *</span>
          <input
            name="uf"
            required
            maxLength={2}
            placeholder="SP"
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
          placeholder="Nome de quem administra a conta"
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
            placeholder="(11) 99999-9999"
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
          placeholder="CNPJ, e-mail, telefone ou chave aleatória"
          className="rounded-xl border border-border px-4 py-3"
        />
        <span className="text-xs text-muted">
          É pra essa chave que o Pix dos fiéis vai direto — o Dizipay nunca
          recebe esse valor.
        </span>
      </label>
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold text-muted">Senha *</span>
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
          <span className="text-sm font-bold text-muted">
            Confirmar senha *
          </span>
          <input
            name="confirmarSenha"
            type="password"
            required
            minLength={6}
            className="rounded-xl border border-border px-4 py-3"
          />
        </label>
      </div>

      {estado.erro && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {estado.erro}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Enviando…" : "Cadastrar igreja"}
      </Button>
      <p className="text-center text-xs text-muted">
        Sua conta entra em análise antes de habilitar o recebimento —
        normalmente aprovamos em poucas horas.
      </p>
    </form>
  );
}
