"use server";

import { redirect } from "next/navigation";
import { iniciarAcessoComo } from "@/lib/auth/session";
import { webmasterDaSessao } from "@/lib/auth/permissoes";
import { getFiel } from "@/lib/db/repo";

export async function acessarComoFielAction(formData: FormData) {
  const webmaster = await webmasterDaSessao();
  if (!webmaster) return;

  const fielId = String(formData.get("fielId"));
  if (!fielId) return;

  const fiel = await getFiel(fielId);
  if (!fiel) return;

  await iniciarAcessoComo(
    { papel: "fiel", usuarioId: fiel.id, igrejaId: fiel.igrejaId, nome: fiel.nome },
    { webmasterId: webmaster.id, webmasterNome: webmaster.nome }
  );
  redirect("/fiel/inicio");
}
