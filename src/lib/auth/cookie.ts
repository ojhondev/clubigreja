import { createHmac, timingSafeEqual } from "node:crypto";

// Codificação/verificação do cookie de sessão assinado (HMAC) — usada tanto
// por session.ts (Server Components/Actions, via next/headers) quanto por
// proxy.ts (roda fora do request lifecycle do App Router, lê o cookie cru
// do NextRequest). Extraído aqui pra não duplicar a lógica de assinatura.

export type Papel = "igreja" | "fiel" | "webmaster";

export interface Sessao {
  papel: Papel;
  usuarioId: string;
  igrejaId?: string;
  nome: string;
}

export const COOKIE_SESSAO = "cig_sessao";

const SEGREDO = process.env.SESSION_SECRET;
if (!SEGREDO && process.env.NODE_ENV === "production") {
  throw new Error("SESSION_SECRET não configurado — obrigatório em produção pra assinar a sessão.");
}
const SEGREDO_EFETIVO = SEGREDO ?? "dev-only-insecure-secret-nao-usar-em-producao";

function assinar(payload: string): string {
  return createHmac("sha256", SEGREDO_EFETIVO).update(payload).digest("base64url");
}

export function codificarSessao(sessao: Sessao): string {
  const payload = Buffer.from(JSON.stringify(sessao), "utf8").toString("base64url");
  return `${payload}.${assinar(payload)}`;
}

export function decodificarSessao(valor: string): Sessao | null {
  const [payload, assinatura] = valor.split(".");
  if (!payload || !assinatura) return null;

  const esperada = assinar(payload);
  const bufA = Buffer.from(assinatura);
  const bufB = Buffer.from(esperada);
  if (bufA.length !== bufB.length || !timingSafeEqual(bufA, bufB)) return null;

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Sessao;
  } catch {
    return null;
  }
}
