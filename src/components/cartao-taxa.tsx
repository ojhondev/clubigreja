import { CreditCard } from "lucide-react";
import type { CartaoSalvo } from "@/lib/types";

export function CartaoTaxa({ cartaoSalvo }: { cartaoSalvo?: CartaoSalvo }) {
  if (cartaoSalvo) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-border bg-[#F7FAFF] px-4 py-3">
        <CreditCard size={18} className="shrink-0 text-primary" />
        <p className="text-sm text-muted">Incluindo taxa de processamento do pagamento.</p>
      </div>
    );
  }

  return (
    <fieldset className="space-y-3 rounded-xl border border-border p-4">
      <legend className="px-1 text-sm font-medium text-muted">
        Cadastre um cartão para a taxa de processamento (só precisa fazer isso uma vez)
      </legend>
      <label className="flex flex-col gap-1">
        <span className="text-xs text-muted">Número do cartão</span>
        <input
          name="cartaoNumero"
          required
          inputMode="numeric"
          placeholder="0000 0000 0000 0000"
          className="rounded-xl border border-border px-4 py-3"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs text-muted">Nome no cartão</span>
        <input name="cartaoNome" required placeholder="Como está impresso no cartão" className="rounded-xl border border-border px-4 py-3" />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-muted">Validade</span>
          <input name="cartaoValidade" required placeholder="MM/AA" className="rounded-xl border border-border px-4 py-3" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-muted">CVV</span>
          <input name="cartaoCvv" required inputMode="numeric" placeholder="123" className="rounded-xl border border-border px-4 py-3" />
        </label>
      </div>
    </fieldset>
  );
}
