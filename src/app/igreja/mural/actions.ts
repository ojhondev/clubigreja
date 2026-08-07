"use server";

import { revalidatePath } from "next/cache";
import { getSessao } from "@/lib/auth/session";
import { comunicadosMural, notificarFieisDaIgreja } from "@/lib/mock-db";

let proximoId = comunicadosMural.length + 1;

export async function publicarComunicado(formData: FormData) {
  const sessao = await getSessao();
  if (!sessao?.igrejaId) return;

  const titulo = String(formData.get("titulo") ?? "").trim();
  const corpo = String(formData.get("corpo") ?? "").trim();
  const emoji = String(formData.get("emoji") ?? "📣").trim() || "📣";

  if (!titulo || !corpo) return;

  comunicadosMural.unshift({
    id: `comunicado-${proximoId++}`,
    igrejaId: sessao.igrejaId,
    titulo,
    corpo,
    emoji,
    publicadoEm: new Date().toISOString().slice(0, 10),
  });

  notificarFieisDaIgreja(sessao.igrejaId, { tipo: "comunicado", titulo: "Novo comunicado no mural", corpo: titulo });

  revalidatePath("/igreja/mural");
  revalidatePath("/fiel/inicio");
  revalidatePath("/fiel/notificacoes");
}
