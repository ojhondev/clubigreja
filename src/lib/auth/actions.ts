"use server";

import { redirect } from "next/navigation";
import { encerrarSessao } from "./session";

export async function sair() {
  await encerrarSessao();
  redirect("/entrar");
}
