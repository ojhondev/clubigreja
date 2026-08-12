"use server";

import { redirect } from "next/navigation";
import { encerrarAcessoComo, encerrarSessao } from "./session";

export async function sair() {
  await encerrarSessao();
  redirect("/entrar");
}

// Usado pelo banner "Acessar como" — devolve o webmaster pra própria sessão
// dele (sem deslogar de verdade) e volta pro painel interno.
export async function voltarAoPainelWebmaster() {
  await encerrarAcessoComo();
  redirect("/admin/igrejas");
}
