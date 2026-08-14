"use client";

import { useState } from "react";

export function InputValidadeCartao() {
  const [valor, setValor] = useState("");

  return (
    <input
      name="cartaoValidade"
      required
      autoComplete="cc-exp"
      inputMode="numeric"
      placeholder="MM/AA"
      value={valor}
      onChange={(e) => {
        const digitos = e.target.value.replace(/\D/g, "").slice(0, 4);
        setValor(
          digitos.length > 2
            ? `${digitos.slice(0, 2)}/${digitos.slice(2)}`
            : digitos,
        );
      }}
      className="rounded-xl border border-border px-4 py-3"
    />
  );
}
