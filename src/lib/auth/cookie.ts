import { createHmac, timingSafeEqual } from "node:crypto";

// Codificação/verificação dos cookies assinados (HMAC) — usada tanto por
// session.ts (Server Components/Actions, via next/headers) quanto por
// proxy.ts (roda fora do request lifecycle do App Router, lê o cookie cru
// do NextRequest). Extraído aqui pra não duplicar a lógica de assinatura.

export type Papel = "igreja" | "fiel" | "webmaster";

export interface Sessao {
  papel: Papel;
  usuarioId: string;
  igrejaId?: string;
  nome: string;
}

// Presente só durante "Acessar como" (webmaster navegando como uma igreja ou
// fiel específicos) — guarda quem é o webmaster de verdade por trás da
// sessão ativa, pra permitir voltar ao painel e pra aplicar a restrição de
// pagamentos mesmo enquanto o webmaster está "vestindo" outra conta.
export interface OrigemWebmaster {
  webmasterId: string;
  webmasterNome: string;
}

export const COOKIE_SESSAO = "cig_sessao";
export const COOKIE_ORIGEM_WEBMASTER = "cig_origem_webmaster";

const SEGREDO = process.env.SESSION_SECRET;
if (!SEGREDO && process.env.NODE_ENV === "production") {
  throw new Error("SESSION_SECRET não configurado — obrigatório em produção pra assinar a sessão.");
}
const SEGREDO_EFETIVO = SEGREDO ?? "dev-only-insecure-secret-nao-usar-em-producao";

function assinar(payload: string): string {
  return createHmac("sha256", SEGREDO_EFETIVO).update(payload).digest("base64url");
}

function codificar<T>(valor: T): string {
  const payload = Buffer.from(JSON.stringify(valor), "utf8").toString("base64url");
  return `${payload}.${assinar(payload)}`;
}

function decodificar<T>(valor: string): T | null {
  const [payload, assinatura] = valor.split(".");
  if (!payload || !assinatura) return null;

  const esperada = assinar(payload);
  const bufA = Buffer.from(assinatura);
  const bufB = Buffer.from(esperada);
  if (bufA.length !== bufB.length || !timingSafeEqual(bufA, bufB)) return null;

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}

export function codificarSessao(sessao: Sessao): string {
  return codificar(sessao);
}

export function decodificarSessao(valor: string): Sessao | null {
  return decodificar<Sessao>(valor);
}

export function codificarOrigemWebmaster(origem: OrigemWebmaster): string {
  return codificar(origem);
}

export function decodificarOrigemWebmaster(valor: string): OrigemWebmaster | null {
  return decodificar<OrigemWebmaster>(valor);
}
