"use server";

import { redirect } from "next/navigation";
import { linksPagamento, criarFielConvidado } from "@/lib/mock-db";
import { gateway } from "@/lib/payments";
import type { MeioPagamento } from "@/lib/types";

export async function doarPublicoAction(formData: FormData) {
  const linkId = String(formData.get("linkId"));
  const link = linksPagamento.find((l) => l.id === linkId);
  if (!link) return;

  const nome = String(formData.get("nome") ?? "").trim();
  const meio = String(formData.get("meio")) as MeioPagamento;
  const valorBruto = Number(formData.get("valor"));
  if (!valorBruto || valorBruto <= 0) return;

  const fielConvidado = criarFielConvidado(link.igrejaId, nome);

  const resultado = await gateway.criarCobranca({
    igrejaId: link.igrejaId,
    fielId: fielConvidado.id,
    tipo: link.tipo,
    campanhaId: null,
    meio,
    valorBruto,
  });

  redirect(`/doar/comprovante/${resultado.id}`);
}
