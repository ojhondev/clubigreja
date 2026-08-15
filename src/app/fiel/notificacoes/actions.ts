"use server";

import { revalidatePath } from "next/cache";
import { getSessao } from "@/lib/auth/session";
import { marcarNotificacaoLida } from "@/lib/db/repo";

export async function marcarLidaAction(formData: FormData) {
  const sessao = await getSessao();
  if (sessao?.papel !== "fiel") return;

  const notificacaoId = String(formData.get("notificacaoId"));
  if (!notificacaoId) return;

  await marcarNotificacaoLida(notificacaoId, sessao.usuarioId);
  revalidatePath("/fiel/notificacoes");
}
