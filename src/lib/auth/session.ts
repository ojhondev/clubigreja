import "server-only";
import { cookies } from "next/headers";
import { COOKIE_SESSAO, codificarSessao, decodificarSessao, type Papel, type Sessao } from "./cookie";

export type { Papel, Sessao };

export async function getSessao(): Promise<Sessao | null> {
  const store = await cookies();
  const raw = store.get(COOKIE_SESSAO)?.value;
  if (!raw) return null;
  return decodificarSessao(raw);
}

export async function criarSessao(sessao: Sessao): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_SESSAO, codificarSessao(sessao), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function encerrarSessao(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_SESSAO);
}
