"use server";

import { redirect } from "next/navigation";
import { getCampanha, getFiel, criarFielConvidado } from "@/lib/db/repo";
import { getFielConvidadoId, getSessao, lembrarFielConvidado } from "@/lib/auth/session";
import { gateway } from "@/lib/payments";

export async function doarCampanhaPublicoAction(formData: FormData) {
  const campanhaId = String(formData.get("campanhaId"));
  const campanha = await getCampanha(campanhaId);
  if (!campanha) return;

  const valorBruto = Number(formData.get("valor"));
  const cartaoNumero = formData.get("cartaoNumero");
  const cartaoNome = formData.get("cartaoNome");
  if (!valorBruto || valorBruto <= 0) return;

  // Fiel já logado: usa a própria conta. Sem login, reaproveita o mesmo
  // registro de convidado se o navegador já é reconhecido (mesma igreja) —
  // só cria um novo convidado na primeira vez.
  const sessao = await getSessao();
  let fielId: string;
  if (sessao?.papel === "fiel") {
    fielId = sessao.usuarioId;
  } else {
    const convidadoId = await getFielConvidadoId();
    const convidado = convidadoId ? await getFiel(convidadoId) : undefined;
    fielId =
      convidado?.igrejaId === campanha.igrejaId
        ? convidado.id
        : (await criarFielConvidado(campanha.igrejaId, String(formData.get("nome") ?? "").trim())).id;
  }

  const dados = await gateway.iniciarContribuicao({
    igrejaId: campanha.igrejaId,
    fielId,
    tipo: "campanha",
    campanhaId: campanha.id,
    valorBruto,
    novoCartao:
      cartaoNumero && cartaoNome ? { numero: String(cartaoNumero), nome: String(cartaoNome) } : undefined,
  });

  if (sessao?.papel !== "fiel") {
    await lembrarFielConvidado(fielId);
  }

  redirect(`/doar/pagar/${dados.contribuicaoId}`);
}
