"use client";

import { useState } from "react";

export function InputMoeda({
  name,
  defaultValue,
  required,
  placeholder,
  className,
}: {
  name: string;
  defaultValue?: number;
  required?: boolean;
  placeholder?: string;
  className?: string;
}) {
  const [digitos, setDigitos] = useState(
    defaultValue ? String(defaultValue) : "",
  );
  const numero = digitos ? Number(digitos) : 0;

  return (
    <>
      <input
        type="text"
        inputMode="numeric"
        required={required}
        value={digitos ? numero.toLocaleString("pt-BR") : ""}
        onChange={(e) => setDigitos(e.target.value.replace(/\D/g, ""))}
        placeholder={placeholder}
        className={className}
      />
      <input type="hidden" name={name} value={numero} />
    </>
  );
}
