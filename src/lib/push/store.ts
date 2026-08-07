import "server-only";

export interface InscricaoPush {
  fielId: string;
  subscription: unknown;
  criadaEm: string;
}

// Mock — em produção isso vira uma tabela (fiel_id, subscription jsonb).
export const inscricoesPush: InscricaoPush[] = [];

export function salvarInscricaoPush(fielId: string, subscription: unknown) {
  const existente = inscricoesPush.find((i) => i.fielId === fielId);
  if (existente) {
    existente.subscription = subscription;
    return existente;
  }
  const nova: InscricaoPush = { fielId, subscription, criadaEm: new Date().toISOString() };
  inscricoesPush.push(nova);
  return nova;
}
