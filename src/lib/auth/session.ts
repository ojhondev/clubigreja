import "server-only";
import { cookies } from "next/headers";
import {
  COOKIE_CONVIDADO,
  COOKIE_ORIGEM_WEBMASTER,
  COOKIE_SESSAO,
  codificarConvidado,
  codificarOrigemWebmaster,
  codificarSessao,
  decodificarConvidado,
  decodificarOrigemWebmaster,
  decodificarSessao,
  type OrigemWebmaster,
  type Papel,
  type Sessao,
} from "./cookie";

export type { OrigemWebmaster, Papel, Sessao };

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
  store.delete(COOKIE_ORIGEM_WEBMASTER);
}

// "Acessar como": webmaster troca a sessão ativa pra a de uma igreja/fiel
// específicos, mas guarda quem ele é de verdade em um cookie separado — dá
// pra restaurar a sessão de webmaster depois, e pra aplicar a restrição de
// pagamentos mesmo durante o acesso.
export async function getOrigemWebmaster(): Promise<OrigemWebmaster | null> {
  const store = await cookies();
  const raw = store.get(COOKIE_ORIGEM_WEBMASTER)?.value;
  if (!raw) return null;
  return decodificarOrigemWebmaster(raw);
}

export async function iniciarAcessoComo(
  sessaoAlvo: Sessao,
  origem: OrigemWebmaster,
): Promise<void> {
  const store = await cookies();
  const opcoes = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
  store.set(COOKIE_SESSAO, codificarSessao(sessaoAlvo), opcoes);
  store.set(COOKIE_ORIGEM_WEBMASTER, codificarOrigemWebmaster(origem), opcoes);
}

export async function encerrarAcessoComo(): Promise<void> {
  const origem = await getOrigemWebmaster();
  const store = await cookies();
  if (!origem) {
    store.delete(COOKIE_SESSAO);
    store.delete(COOKIE_ORIGEM_WEBMASTER);
    return;
  }
  await criarSessao({
    papel: "webmaster",
    usuarioId: origem.webmasterId,
    nome: origem.webmasterNome,
  });
  store.delete(COOKIE_ORIGEM_WEBMASTER);
}

// Reconhece um doador avulso (sem login) que já doou desse mesmo
// navegador/dispositivo antes — evita pedir cartão de novo a cada doação.
export async function getFielConvidadoId(): Promise<string | null> {
  const store = await cookies();
  const raw = store.get(COOKIE_CONVIDADO)?.value;
  if (!raw) return null;
  return decodificarConvidado(raw)?.fielId ?? null;
}

export async function lembrarFielConvidado(fielId: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_CONVIDADO, codificarConvidado({ fielId }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}
