// Datas mockadas são armazenadas como "YYYY-MM-DD". Passar isso direto para
// `new Date(...)` faz o JS interpretar como UTC meia-noite, o que exibe um
// dia a menos em fusos atrás de UTC (ex.: Brasil). Este helper monta a data
// localmente para exibir o dia correto.
export function formatarData(
  dataISO: string,
  opcoes: Intl.DateTimeFormatOptions = {}
): string {
  const [ano, mes, dia] = dataISO.slice(0, 10).split("-").map(Number);
  const data = new Date(ano, mes - 1, dia);
  return data.toLocaleDateString("pt-BR", opcoes);
}
