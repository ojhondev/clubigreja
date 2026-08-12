"use server";

import { redirect } from "next/navigation";
import { getCampanha, criarFielConvidado } from "@/lib/db/repo";
import { getSessao } from "@/lib/auth/session";
import { gateway } from "@/lib/payments";

export async function doarCampanhaPublicoAction(formData: FormData) {
  const campanhaId = String(formData.get("campanhaId"));
  const campanha = await getCampanha(campanhaId);
  if (!campanha) return;

  const valorBruto = Number(formData.get("valor"));
  const cartaoNumero = formData.get("cartaoNumero");
  const cartaoNome = formData.get("cartaoNome");
  if (!valorBruto || valorBruto <= 0) return;

  // Fiel já logado: usa a própria conta, sem pedir nome nem recriar um
  // registro de convidado.
  const sessao = await getSessao();
  const fielId =
    sessao?.papel === "fiel"
      ? sessao.usuarioId
      : (await criarFielConvidado(campanha.igrejaId, String(formData.get("nome") ?? "").trim())).id;

  const dados = await gateway.iniciarContribuicao({
    igrejaId: campanha.igrejaId,
    fielId,
    tipo: "campanha",
    campanhaId: campanha.id,
    valorBruto,
    novoCartao:
      cartaoNumero && cartaoNome ? { numero: String(cartaoNumero), nome: String(cartaoNome) } : undefined,
  });

  redirect(`/doar/pagar/${dados.contribuicaoId}`);
}
