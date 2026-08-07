"use server";

import { revalidatePath } from "next/cache";
import { marcarNotificacaoLida } from "@/lib/mock-db";

export async function marcarLidaAction(formData: FormData) {
  const notificacaoId = String(formData.get("notificacaoId"));
  marcarNotificacaoLida(notificacaoId);
  revalidatePath("/fiel/notificacoes");
}
