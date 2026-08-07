import "server-only";
import { cookies } from "next/headers";

export type Papel = "igreja" | "fiel" | "superadmin";

export interface Sessao {
  papel: Papel;
  usuarioId: string;
  igrejaId?: string;
  nome: string;
}

const COOKIE = "cig_sessao";

export async function getSessao(): Promise<Sessao | null> {
  const store = await cookies();
  const raw = store.get(COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Sessao;
  } catch {
    return null;
  }
}

export async function criarSessao(sessao: Sessao): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, JSON.stringify(sessao), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function encerrarSessao(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}
