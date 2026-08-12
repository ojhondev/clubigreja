"use server";

import { revalidatePath } from "next/cache";
import { getSessao } from "@/lib/auth/session";
import { criarComunicado, notificarFieisDaIgreja } from "@/lib/db/repo";

export async function publicarComunicado(formData: FormData) {
  const sessao = await getSessao();
  if (!sessao?.igrejaId) return;

  const titulo = String(formData.get("titulo") ?? "").trim();
  const corpo = String(formData.get("corpo") ?? "").trim();
  const emoji = String(formData.get("emoji") ?? "📣").trim() || "📣";

  if (!titulo || !corpo) return;

  await criarComunicado({ igrejaId: sessao.igrejaId, titulo, corpo, emoji });

  await notificarFieisDaIgreja(sessao.igrejaId, { tipo: "comunicado", titulo: "Novo comunicado no mural", corpo: titulo });

  revalidatePath("/igreja/mural");
  revalidatePath("/fiel/inicio");
  revalidatePath("/fiel/notificacoes");
}
