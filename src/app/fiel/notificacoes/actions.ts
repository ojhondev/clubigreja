"use server";

import { revalidatePath } from "next/cache";
import { marcarNotificacaoLida } from "@/lib/db/repo";

export async function marcarLidaAction(formData: FormData) {
  const notificacaoId = String(formData.get("notificacaoId"));
  await marcarNotificacaoLida(notificacaoId);
  revalidatePath("/fiel/notificacoes");
}
