// Data de referência do ambiente mockado — troque por `new Date()` quando os
// dados deixarem de ser simulados e refletirem contribuições reais.
export function hoje(): Date {
  return new Date("2026-08-05T12:00:00");
}

export function mesAno(data: Date | string): string {
  if (typeof data === "string") return data.slice(0, 7);
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;
}

// Monta uma data local a partir de "YYYY-MM-DD", evitando o deslocamento de
// um dia que `new Date("YYYY-MM-DD")` (interpretado como UTC) causa em fusos
// atrás de UTC, como o do Brasil.
export function dataLocal(dataISO: string): Date {
  const [ano, mes, dia] = dataISO.slice(0, 10).split("-").map(Number);
  return new Date(ano, mes - 1, dia);
}
