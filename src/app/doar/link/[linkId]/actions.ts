"use server";

import { redirect } from "next/navigation";
import { getLinkPagamento, getFiel, criarFielConvidado } from "@/lib/db/repo";
import {
  getFielConvidadoId,
  getSessao,
  lembrarFielConvidado,
} from "@/lib/auth/session";
import { gateway } from "@/lib/payments";

export async function doarPublicoAction(formData: FormData) {
  const linkId = String(formData.get("linkId"));
  const link = await getLinkPagamento(linkId);
  if (!link) return;

  const valorBruto = Number(formData.get("valor"));
  const cartaoNumero = formData.get("cartaoNumero");
  const cartaoNome = formData.get("cartaoNome");
  if (!valorBruto || valorBruto <= 0) return;

  const sessao = await getSessao();
  let fielId: string;
  if (sessao?.papel === "fiel") {
    fielId = sessao.usuarioId;
  } else {
    const convidadoId = await getFielConvidadoId();
    const convidado = convidadoId ? await getFiel(convidadoId) : undefined;
    fielId =
      convidado?.igrejaId === link.igrejaId
        ? convidado.id
        : (
            await criarFielConvidado(
              link.igrejaId,
              String(formData.get("nome") ?? "").trim(),
            )
          ).id;
  }

  const dados = await gateway.iniciarContribuicao({
    igrejaId: link.igrejaId,
    fielId,
    tipo: link.tipo,
    campanhaId: null,
    valorBruto,
    novoCartao:
      cartaoNumero && cartaoNome
        ? { numero: String(cartaoNumero), nome: String(cartaoNome) }
        : undefined,
  });

  if (sessao?.papel !== "fiel") {
    await lembrarFielConvidado(fielId);
  }

  redirect(`/doar/pagar/${dados.contribuicaoId}`);
}
